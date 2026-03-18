<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TypeOperation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TypeOperationController extends Controller
{
    public function index(Request $request)
    {
        $query = TypeOperation::query();

        if ($request->has('categorie')) {
            $query->where('categorie', $request->categorie);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $typeOperations = $query->orderBy('categorie')->orderBy('nom')->get();
        return response()->json($typeOperations);
    }

    public function show(TypeOperation $typeOperation)
    {
        return response()->json($typeOperation);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        // Journalisation pour débogage
        Log::info('Tentative de création de type', [
            'user_id' => $user?->id,
            'user_role' => $user?->role,
            'authenticated' => !is_null($user),
        ]);

        if (!$user) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé : vous devez être administrateur'], 403);
        }

        $request->validate([
            'nom' => 'required|string|max:100|unique:type_operations,nom',
            'description' => 'nullable|string',
            'categorie' => 'required|in:cotisation,don,depense,autres',
            'type' => 'required|in:debit,credit',
        ]);

        $typeOperation = TypeOperation::create($request->all());
        return response()->json($typeOperation, 201);
    }

    public function update(Request $request, TypeOperation $typeOperation)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'nom' => 'sometimes|string|max:100|unique:type_operations,nom,' . $typeOperation->id,
            'description' => 'nullable|string',
            'categorie' => 'sometimes|in:cotisation,don,depense,autres',
            'type' => 'sometimes|in:debit,credit',
        ]);

        $typeOperation->update($request->all());
        return response()->json($typeOperation);
    }

    public function destroy(TypeOperation $typeOperation)
    {
        if ($typeOperation->operations()->count() > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer ce type car il est utilisé dans des opérations'
            ], 422);
        }

        $typeOperation->delete();
        return response()->json(null, 204);
    }

    public function byCategory($category)
    {
        $types = TypeOperation::where('categorie', $category)
            ->orderBy('nom')
            ->get();
        return response()->json($types);
    }

    public function bytype($type)
    {
        if (!in_array($type, ['credit', 'debit'])) {
            return response()->json(['message' => 'type invalide'], 422);
        }
        $types = TypeOperation::where('type', $type)
            ->orderBy('categorie')
            ->orderBy('nom')
            ->get();
        return response()->json($types);
    }
}