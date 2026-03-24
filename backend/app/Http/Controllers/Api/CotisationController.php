<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Membre;
use App\Models\Operation;
use App\Models\TypeOperation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CotisationController extends Controller
{
    public function suivi(Request $request)
    {
        Log::info('Méthode suivi appelée');

        $typeCotisation = TypeOperation::where('categorie', 'cotisation')->first();
        if (!$typeCotisation) {
            return response()->json([
                'message' => 'Aucun type d\'opération de catégorie "cotisation" n\'existe. Veuillez en créer un avant de pouvoir suivre les cotisations.',
                'code' => 'MISSING_COTISATION_TYPE'
            ], 422);
        }

        // Si des paramètres début/fin sont fournis, on les utilise
        if ($request->has('debut') && $request->has('fin')) {
            $moisDebut = $request->debut;
            $moisFin = $request->fin;
            $period = \Carbon\CarbonPeriod::create($moisDebut . '-01', '1 month', $moisFin . '-01');
            $moisList = [];
            foreach ($period as $date) {
                $moisList[] = $date->format('Y-m');
            }
        } else {
            // Sinon, on calcule la plage à partir des cotisations existantes
            $minMonth = Operation::where('type_operation_id', $typeCotisation->id)
                ->whereNotNull('mois_cotisation')
                ->min('mois_cotisation');
            $maxMonth = Operation::where('type_operation_id', $typeCotisation->id)
                ->whereNotNull('mois_cotisation')
                ->max('mois_cotisation');

            if ($minMonth && $maxMonth) {
                $period = \Carbon\CarbonPeriod::create($minMonth . '-01', '1 month', $maxMonth . '-01');
                $moisList = [];
                foreach ($period as $date) {
                    $moisList[] = $date->format('Y-m');
                }
            } else {
                // Aucune cotisation, période par défaut (12 derniers mois)
                $moisDebut = now()->subMonths(11)->format('Y-m');
                $moisFin = now()->format('Y-m');
                $period = \Carbon\CarbonPeriod::create($moisDebut . '-01', '1 month', $moisFin . '-01');
                $moisList = [];
                foreach ($period as $date) {
                    $moisList[] = $date->format('Y-m');
                }
            }
        }

        $membres = Membre::with('user')->actifs()->get();

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
                'nom' => $membre->user->nom,          // ← utilise user
                'prenom' => $membre->user->prenom,    // ← utilise user
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