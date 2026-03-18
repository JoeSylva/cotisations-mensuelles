<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Operation;
use App\Models\Membre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
class DashboardController extends Controller
{
    public function statistiques(Request $request)
    {
        $dateDebut = $request->get('date_debut', now()->startOfMonth());
        $dateFin = $request->get('date_fin', now()->endOfMonth());

        // Solde total
        $solde = Operation::valides()
            ->selectRaw('SUM(CASE WHEN type_operations.sens = "credit" THEN montant ELSE -montant END) as solde')
            ->join('type_operations', 'operations.type_operation_id', '=', 'type_operations.id')
            ->first();

        // Statistiques par catégorie
        $statsCategories = Operation::valides()
            ->periode($dateDebut, $dateFin)
            ->join('type_operations', 'operations.type_operation_id', '=', 'type_operations.id')
            ->select('type_operations.categorie', 'type_operations.sens')
            ->selectRaw('SUM(operations.montant) as total')
            ->groupBy('type_operations.categorie', 'type_operations.sens')
            ->get();

        // Dernières opérations
        $dernieresOperations = Operation::with(['membre.user', 'typeOperation'])
            ->valides()
            ->orderBy('date_operation', 'desc')
            ->limit(10)
            ->get();

        // Nombre de membres actifs
        $nombreMembres = Membre::actifs()->count();

        return response()->json([
            'solde_total' => $solde->solde ?? 0,
            'stats_categories' => $statsCategories,
            'dernieres_operations' => $dernieresOperations,
            'nombre_membres' => $nombreMembres,
            'periode' => [
                'debut' => $dateDebut,
                'fin' => $dateFin,
            ],
        ]);
    }

    public function solde()
    {
        $solde = Operation::valides()
            ->selectRaw('SUM(CASE WHEN type_operations.sens = "credit" THEN montant ELSE -montant END) as solde')
            ->join('type_operations', 'operations.type_operation_id', '=', 'type_operations.id')
            ->first();

        return response()->json(['solde' => $solde->solde ?? 0]);
    }
}