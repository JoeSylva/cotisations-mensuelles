<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('operations', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique()->default(DB::raw('gen_random_uuid()'));
            $table->foreignId('membre_id')->constrained()->onDelete('cascade');
            $table->foreignId('type_operation_id')->constrained();
            $table->decimal('montant', 12, 2);
            $table->date('date_operation');
            $table->string('mois_cotisation', 7)->nullable(); // Format: 'YYYY-MM'
            $table->text('description')->nullable();
            $table->enum('mode_paiement', ['espece', 'mobile_money'])->default('espece');
            $table->string('reference_paiement', 100)->nullable();
            $table->enum('statut', ['valide', 'annule', 'en_attente'])->default('valide');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            
            $table->index(['date_operation', 'membre_id']);
            $table->index('mois_cotisation');
        });
    }

    public function down()
    {
        Schema::dropIfExists('operations');
    }
};