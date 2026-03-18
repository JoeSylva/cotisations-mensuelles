<?php

namespace Database\Seeders;

use App\Models\TypeOperation;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Types d'opérations complets
        $typesOperations = [
            // Crédits - Cotisations
            ['nom' => 'Cotisation mensuelle', 'description' => 'Cotisation régulière des membres', 'categorie' => 'cotisation', 'sens' => 'credit'],
            ['nom' => 'Cotisation trimestrielle', 'description' => 'Cotisation trimestrielle', 'categorie' => 'cotisation', 'sens' => 'credit'],
            ['nom' => 'Cotisation annuelle', 'description' => 'Cotisation annuelle', 'categorie' => 'cotisation', 'sens' => 'credit'],
            
            // Crédits - Dons
            ['nom' => 'Don volontaire', 'description' => 'Don libre des membres', 'categorie' => 'don', 'sens' => 'credit'],
            ['nom' => 'Don exceptionnel', 'description' => 'Don pour occasion spéciale', 'categorie' => 'don', 'sens' => 'credit'],
            ['nom' => 'Don de solidarité', 'description' => 'Don pour soutien mutuel', 'categorie' => 'don', 'sens' => 'credit'],
            
            // Débits - Dépenses
            ['nom' => 'Frais de fonctionnement', 'description' => 'Frais administratifs et logistiques', 'categorie' => 'depense', 'sens' => 'debit'],
            ['nom' => 'Achat matériel', 'description' => 'Achat de matériel et équipement', 'categorie' => 'depense', 'sens' => 'debit'],
            ['nom' => 'Frais d\'événement', 'description' => 'Organisation d\'événements', 'categorie' => 'depense', 'sens' => 'debit'],
            ['nom' => 'Aide sociale', 'description' => 'Aide aux membres en difficulté', 'categorie' => 'depense', 'sens' => 'debit'],
            
            // Autres
            ['nom' => 'Intérêts bancaires', 'description' => 'Intérêts perçus', 'categorie' => 'autres', 'sens' => 'credit'],
            ['nom' => 'Frais bancaires', 'description' => 'Frais de tenue de compte', 'categorie' => 'autres', 'sens' => 'debit'],
            ['nom' => 'Remboursement', 'description' => 'Remboursement de frais', 'categorie' => 'autres', 'sens' => 'credit'],
            ['nom' => 'Divers', 'description' => 'Autres opérations non catégorisées', 'categorie' => 'autres', 'sens' => 'debit'],
        ];

        foreach ($typesOperations as $type) {
            TypeOperation::create($type);
        }

        // Admin user
        User::create([
            'nom' => 'Admin',
            'prenom' => 'System',
            'email' => 'admin@family.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Trésorier user
        User::create([
            'nom' => 'Trésorier',
            'prenom' => 'Family',
            'email' => 'tresorier@family.com',
            'password' => Hash::make('password'),
            'role' => 'tresorier',
        ]);
    }
}