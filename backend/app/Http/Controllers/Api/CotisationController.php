<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Membre;
use App\Models\Operation;
use App\Models\TypeOperation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class CotisationController extends Controller
{
    public function suivi(Request $request)
{
    Log::info('Méthode suivi appelée');
    $moisDebut = $request->input('debut', now()->subMonths(11)->format('Y-m'));
    $moisFin = $request->input('fin', now()->format('Y-m'));

    $period = \Carbon\CarbonPeriod::create($moisDebut.'-01', '1 month', $moisFin.'-01');
    $moisList = [];
    foreach ($period as $date) {
        $moisList[] = $date->format('Y-m');
    }

    $membres = Membre::with('user')->actifs()->get();

    $typeCotisation = TypeOperation::where('categorie', 'cotisation')->first();
    if (!$typeCotisation) {
        return response()->json([
            'message' => 'Aucun type d\'opération de catégorie "cotisation" n\'existe. Veuillez en créer un avant de pouvoir suivre les cotisations.',
            'code' => 'MISSING_COTISATION_TYPE'
        ], 422);
    }

    $operations = Operation::where('type_operation_id', $typeCotisation->id)
        ->whereIn('mois_cotisation', $moisList)
        ->get(['membre_id', 'mois_cotisation', 'montant']);

    $paiements = [];
    foreach ($operations as $op) {
        $paiements[$op->membre_id][$op->mois_cotisation] = $op->montant;
    }

    $result = [];
    foreach ($membres as $membre) {
        $ligne = [
            'id' => $membre->id,
            'nom' => $membre->nom,
            'prenom' => $membre->prenom,
            'email' => $membre->user->email,
            'date_adhesion' => $membre->date_adhesion,
            'cotisations' => []
        ];
        foreach ($moisList as $mois) {
            $ligne['cotisations'][$mois] = $paiements[$membre->id][$mois] ?? null;
        }
        $result[] = $ligne;
    }

    return response()->json([
        'mois' => $moisList,
        'membres' => $result
    ]);
}
}