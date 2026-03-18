<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Operation;
use App\Models\TypeOperation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class OperationController extends Controller
{
    public function index(Request $request)
    {
        $query = Operation::with(['membre.user', 'typeOperation', 'createur'])
            ->valides()
            ->orderBy('date_operation', 'desc')
            ->orderBy('created_at', 'desc');

        // Filtres
        if ($request->has('membre_id')) {
            $query->where('membre_id', $request->membre_id);
        }

        if ($request->has('type_operation_id')) {
            $query->where('type_operation_id', $request->type_operation_id);
        }

        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->periode($request->date_debut, $request->date_fin);
        }

        $operations = $query->paginate(20);

        return response()->json($operations);
    }

    public function store(Request $request)
    {
        $request->validate([
            'membre_id' => 'required|exists:membres,id',
            'type_operation_id' => 'required|exists:type_operations,id',
            'montant' => 'required|numeric|min:0.01',
            'date_operation' => 'required|date',
            'mois_cotisation' => 'nullable|date_format:Y-m',
            'description' => 'nullable|string',
            'mode_paiement' => 'required|in:espece,cheque,virement,mobile_money',
            'reference_paiement' => 'nullable|string|max:100',
        ]);

        $operation = Operation::create([
            'membre_id' => $request->membre_id,
            'type_operation_id' => $request->type_operation_id,
            'montant' => $request->montant,
            'date_operation' => $request->date_operation,
            'mois_cotisation' => $request->mois_cotisation,
            'description' => $request->description,
            'mode_paiement' => $request->mode_paiement,
            'reference_paiement' => $request->reference_paiement,
            'created_by' => $request->user()->id,
        ]);

        return response()->json($operation->load(['membre.user', 'typeOperation']), 201);
    }

    public function show(Operation $operation)
    {
        return response()->json($operation->load(['membre.user', 'typeOperation', 'createur']));
    }

    public function update(Request $request, Operation $operation)
    {
        $request->validate([
            'type_operation_id' => 'sometimes|exists:type_operations,id',
            'montant' => 'sometimes|numeric|min:0.01',
            'date_operation' => 'sometimes|date',
            'description' => 'nullable|string',
            'mode_paiement' => 'sometimes|in:espece,cheque,virement,mobile_money',
            'reference_paiement' => 'nullable|string|max:100',
            'statut' => 'sometimes|in:valide,annule,en_attente',
        ]);

        $operation->update($request->all());

        return response()->json($operation->load(['membre.user', 'typeOperation']));
    }

    public function destroy(Operation $operation)
    {
        $operation->update(['statut' => 'annule']);
        return response()->json(null, 204);
    }
}