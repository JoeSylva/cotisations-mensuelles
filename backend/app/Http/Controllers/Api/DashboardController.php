<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Operation;
use App\Models\Membre;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function statistiques(Request $request)
    {
        $dateDebut = $request->get('date_debut', now()->startOfMonth());
        $dateFin = $request->get('date_fin', now()->endOfMonth());

        $solde = Operation::valides()
            ->selectRaw("SUM(CASE WHEN type_operations.type = 'credit' THEN montant ELSE -montant END) as solde")
            ->join('type_operations', 'operations.type_operation_id', '=', 'type_operations.id')
            ->first();

        $statsCategories = Operation::valides()
            ->periode($dateDebut, $dateFin)
            ->join('type_operations', 'operations.type_operation_id', '=', 'type_operations.id')
            ->select('type_operations.categorie', 'type_operations.type')
            ->selectRaw('SUM(operations.montant) as total')
            ->groupBy('type_operations.categorie', 'type_operations.type')
            ->get();

        $dernieresOperations = Operation::with(['membre.user', 'typeOperation'])
            ->valides()
            ->orderBy('date_operation', 'desc')
            ->limit(10)
            ->get();

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
            ->selectRaw("SUM(CASE WHEN type_operations.type = 'credit' THEN montant ELSE -montant END) as solde")
            ->join('type_operations', 'operations.type_operation_id', '=', 'type_operations.id')
            ->first();

        return response()->json(['solde' => $solde->solde ?? 0]);
    }

    public function monthlyEvolution(Request $request)
    {
        $year = $request->get('year', now()->year);
        $start = Carbon::create($year, 1, 1)->startOfDay();
        $end = Carbon::create($year, 12, 31)->endOfDay();

        $operations = Operation::valides()
            ->join('type_operations', 'operations.type_operation_id', '=', 'type_operations.id')
            ->whereBetween('date_operation', [$start, $end])
            ->selectRaw('DATE_TRUNC(\'month\', date_operation) as month')
            ->selectRaw('SUM(CASE WHEN type_operations.type = \'credit\' THEN montant ELSE 0 END) as revenus')
            ->selectRaw('SUM(CASE WHEN type_operations.type = \'debit\' THEN montant ELSE 0 END) as depenses')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $result = [];
        for ($m = 1; $m <= 12; $m++) {
            $monthDate = Carbon::create($year, $m, 1);
            $monthKey = $monthDate->startOfMonth();
            $found = $operations->firstWhere('month', $monthKey);
            $result[] = [
                'month' => $monthDate->format('M'),
                'revenus' => $found ? (float) $found->revenus : 0,
                'depenses' => $found ? (float) $found->depenses : 0,
            ];
        }

        return response()->json($result);
    }
}