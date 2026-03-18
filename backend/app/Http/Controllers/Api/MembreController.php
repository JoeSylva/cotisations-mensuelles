<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Membre;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
class MembreController extends Controller
{
    public function index()
    {
        $membres = Membre::with('user')
            ->actifs()
            ->orderBy('date_adhesion', 'desc')
            ->get();

        return response()->json($membres);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'telephone' => 'nullable|string|max:20',
            'date_naissance' => 'nullable|date',
            'adresse' => 'nullable|string',
            'profession' => 'nullable|string|max:100',
        ]);

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'email' => $request->email,
                'telephone' => $request->telephone,
                'password' => Hash::make('password123'), // Mot de passe temporaire
                'role' => 'membre',
            ]);

            $membre = $user->membre()->create([
                'nom' => $request->nom,               
                'prenom' => $request->prenom,         
                'telephone' => $request->telephone,
                'date_naissance' => $request->date_naissance,
                'adresse' => $request->adresse,
                'profession' => $request->profession,
                'date_adhesion' => now(),
                'statut' => 'actif',
            ]);

            return response()->json($membre->load('user'), 201);
        });
    }

    public function show(Membre $membre)
    {
        return response()->json($membre->load(['user', 'operations.typeOperation']));
    }

    public function update(Request $request, Membre $membre)
    {
        $request->validate([
            'nom' => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:users,email,' . $membre->user_id,
            'telephone' => 'nullable|string|max:20',
            'date_naissance' => 'nullable|date',
            'adresse' => 'nullable|string',
            'profession' => 'nullable|string|max:100',
            'statut' => 'sometimes|in:actif,inactif,suspendu',
        ]);

        return DB::transaction(function () use ($request, $membre) {
            $membre->user->update($request->only(['nom', 'prenom', 'email', 'telephone']));
            $membre->update($request->only(['date_naissance', 'adresse', 'profession', 'statut']));

            return response()->json($membre->load('user'));
        });
    }

    public function destroy(Membre $membre)
    {
        $membre->user->delete(); // Cascade supprime aussi le membre
        return response()->json(null, 204);
    }
}