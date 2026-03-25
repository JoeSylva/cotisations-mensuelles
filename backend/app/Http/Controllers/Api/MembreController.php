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

    // app/Http/Controllers/Api/MembreController.php

    public function store(Request $request)
    {
        // Convertir les chaînes vides en null pour nom, prenom, telephone, etc.
        $data = $request->all();
        foreach (['nom', 'prenom', 'telephone', 'email', 'adresse', 'profession'] as $field) {
            if (isset($data[$field]) && $data[$field] === '') {
                $data[$field] = null;
            }
        }

        $validator = validator($data, [
            'nom' => 'nullable|string|max:100',
            'prenom' => 'nullable|string|max:100',
            'email' => 'nullable|email|unique:users',
            'telephone' => 'nullable|string|max:20',
            'date_naissance' => 'nullable|date',
            'situation_matrimoniale' => 'required|string|in:célibataire,marié,divorcé,veuf',
            'adresse' => 'nullable|string',
            'profession' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($data) {
            $user = User::create([
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'email' => $data['email'],
                'telephone' => $data['telephone'],
                'password' => Hash::make('password123'),
                'role' => 'membre',
            ]);

            $membre = $user->membre()->create([
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'telephone' => $data['telephone'],
                'date_naissance' => $data['date_naissance'],
                'situation_matrimoniale' => $data['situation_matrimoniale'],
                'adresse' => $data['adresse'],
                'profession' => $data['profession'],
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
        $data = $request->all();
        foreach (['nom', 'prenom', 'telephone', 'email', 'adresse', 'profession'] as $field) {
            if (isset($data[$field]) && $data[$field] === '') {
                $data[$field] = null;
            }
        }

        $validator = validator($data, [
            'nom' => 'nullable|string|max:100',
            'prenom' => 'nullable|string|max:100',
            'email' => 'nullable|email|unique:users,email,' . $membre->user_id,
            'telephone' => 'nullable|string|max:20',
            'date_naissance' => 'nullable|date',
            'situation_matrimoniale' => 'sometimes|string|in:célibataire,marié,divorcé,veuf',
            'adresse' => 'nullable|string',
            'profession' => 'nullable|string|max:100',
            'statut' => 'sometimes|in:actif,inactif,suspendu',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($data, $membre) {
            $membre->user->update($data);
            $membre->update($data);

            return response()->json($membre->load('user'));
        });
    }

    public function destroy(Membre $membre)
    {
        $membre->user->delete(); // Cascade supprime aussi le membre
        return response()->json(null, 204);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $membre = Membre::where('user_id', $user->id)->with('user')->first();

        return response()->json($membre); // null si non trouvé
    }
}