<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Operation;
use App\Models\TypeOperation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class OperationController extends Controller
{
    public function index(Request $request)
    {
        $query = Operation::with(['membre.user', 'typeOperation', 'createur'])
            ->valides()
            ->orderBy('date_operation', 'desc')
            ->orderBy('created_at', 'desc');

        if ($request->has('membre_id')) {
            $query->where('membre_id', $request->membre_id);
        }

        if ($request->has('type_operation_id')) {
            $ids = explode(',', $request->type_operation_id);
            $query->whereIn('type_operation_id', $ids);
        }

        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->periode($request->date_debut, $request->date_fin);
        }

        $operations = $query->paginate(20);

        return response()->json($operations);
    }

    public function store(Request $request)
    {
        $rules = [
            'membre_id' => 'nullable|exists:membres,id',
            'type_operation_id' => 'required|exists:type_operations,id',
            'montant' => 'required|numeric|min:0.01',
            'date_operation' => 'required|date',
            'mode_paiement' => 'required|in:espece,cheque,virement,mobile_money',
            'reference_paiement' => 'nullable|string|max:100',
            'description' => 'nullable|string',
        ];

        $typeOp = TypeOperation::findOrFail($request->type_operation_id);

        if ($typeOp->categorie === 'cotisation') {
            $rules['mois_cotisations'] = 'required|array|min:1';
            $rules['mois_cotisations.*'] = 'date_format:Y-m';
            $request->validate($rules);
            return $this->handleCotisationStore($request);
        } else {
            $rules['mois_cotisation'] = 'nullable|date_format:Y-m';
            $request->validate($rules);
            return $this->handleStandardStore($request);
        }
    }

    private function handleCotisationStore(Request $request)
    {
        $membre = \App\Models\Membre::findOrFail($request->membre_id);
        $monthlyRate = $membre->getMonthlyCotisationRate();
        $pendingBalance = $membre->pending_balance;
        $amount = $request->montant;
        $selectedMonths = collect($request->mois_cotisations)->sort();

        $totalAvailable = $amount + $pendingBalance;
        $remaining = $totalAvailable;
        $allocations = [];
        $lastMonth = null;

        foreach ($selectedMonths as $month) {
            if ($remaining <= 0) break;
            $allocated = min($remaining, $monthlyRate);
            $allocations[$month] = $allocated;
            $remaining -= $allocated;
            $lastMonth = $month;
        }

        // Report du solde restant sur le mois suivant le dernier mois sélectionné
        if ($remaining > 0 && $lastMonth) {
            $nextMonth = Carbon::parse($lastMonth . '-01')->addMonth()->format('Y-m');
            $allocations[$nextMonth] = $remaining;
            $remaining = 0;
        }

        $operations = [];
        foreach ($allocations as $month => $allocatedAmount) {
            $operation = Operation::create([
                'membre_id' => $membre->id,
                'type_operation_id' => $request->type_operation_id,
                'montant' => $allocatedAmount,
                'date_operation' => $request->date_operation,
                'mois_cotisation' => $month,
                'description' => $request->description,
                'mode_paiement' => $request->mode_paiement,
                'reference_paiement' => $request->reference_paiement,
                'created_by' => $request->user()->id,
            ]);
            $operations[] = $operation;
        }

        // Mise à jour du solde en attente
        $membre->update(['pending_balance' => $remaining]);

        return response()->json([
            'message' => 'Cotisation enregistrée avec allocation',
            'operations' => $operations,
            'pending_balance' => $remaining
        ], 201);
    }

    private function handleStandardStore(Request $request)
    {
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
            'membre_id' => 'nullable|exists:membres,id',
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