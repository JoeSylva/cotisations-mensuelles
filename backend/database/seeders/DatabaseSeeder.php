<?php

namespace Database\Seeders;

use App\Models\Membre;
use App\Models\TypeOperation;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Types d'opérations complets
        $typesOperations = [
            // Crédits - Cotisations
            ['nom' => 'Cotisation mensuelle', 'description' => 'Cotisation régulière des membres', 'categorie' => 'cotisation', 'type' => 'credit'],
            ['nom' => 'Cotisation trimestrielle', 'description' => 'Cotisation trimestrielle', 'categorie' => 'cotisation', 'type' => 'credit'],
            ['nom' => 'Cotisation annuelle', 'description' => 'Cotisation annuelle', 'categorie' => 'cotisation', 'type' => 'credit'],
            
            // Crédits - Dons
            ['nom' => 'Don volontaire', 'description' => 'Don libre des membres', 'categorie' => 'don', 'type' => 'credit'],
            ['nom' => 'Don exceptionnel', 'description' => 'Don pour occasion spéciale', 'categorie' => 'don', 'type' => 'credit'],
            ['nom' => 'Don de solidarité', 'description' => 'Don pour soutien mutuel', 'categorie' => 'don', 'type' => 'credit'],
            
            // Débits - Dépenses
            ['nom' => 'Frais de fonctionnement', 'description' => 'Frais administratifs et logistiques', 'categorie' => 'depense', 'type' => 'debit'],
            ['nom' => 'Achat matériel', 'description' => 'Achat de matériel et équipement', 'categorie' => 'depense', 'type' => 'debit'],
            ['nom' => 'Frais d\'événement', 'description' => 'Organisation d\'événements', 'categorie' => 'depense', 'type' => 'debit'],
            ['nom' => 'Aide sociale', 'description' => 'Aide aux membres en difficulté', 'categorie' => 'depense', 'type' => 'debit'],
            
            // Autres
            ['nom' => 'Intérêts bancaires', 'description' => 'Intérêts perçus', 'categorie' => 'autres', 'type' => 'credit'],
            ['nom' => 'Frais bancaires', 'description' => 'Frais de tenue de compte', 'categorie' => 'autres', 'type' => 'debit'],
            ['nom' => 'Remboursement', 'description' => 'Remboursement de frais', 'categorie' => 'autres', 'type' => 'credit'],
            ['nom' => 'Divers', 'description' => 'Autres opérations non catégorisées', 'categorie' => 'autres', 'type' => 'debit'],
        ];

        foreach ($typesOperations as $type) {
            TypeOperation::firstOrCreate(
                ['nom' => $type['nom']],
                $type
            );
        }

        // Admin user
        User::firstOrCreate(
            ['email' => 'admin@family.com'],
            [
                'nom' => 'Admin',
                'prenom' => 'Joe Sylvain',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // Trésorier user
        $tresorierUser = User::firstOrCreate(
            ['email' => 'tresorier@family.com'],
            [
                'nom' => 'Trésorier',
                'prenom' => 'Rolland',
                'password' => Hash::make('password'),
                'role' => 'tresorier',
            ]
        );

        // Membre "Trésorier" associé à l'utilisateur trésorier
        Membre::firstOrCreate(
            ['user_id' => $tresorierUser->id],
            [
                'nom' => 'Trésorier',
                'prenom' => 'Rolland',
                'date_adhesion' => Carbon::now()->toDateString(), // Ajout de la date d'adhésion
                'statut' => 'actif',
                'situation_matrimoniale' => 'marié',
                // Les autres colonnes (telephone, date_naissance, adresse, profession) sont NULL
                'telephone' => 0347545004,
                'date_naissance' => null,
                'adresse' => null,
                'profession' => null,
            ]
        );
    }
}