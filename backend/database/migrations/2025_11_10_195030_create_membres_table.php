<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('membres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nom', 100)->nullable();
            $table->string('prenom', 100)->nullable();
            $table->string('telephone', 20)->nullable();
            $table->date('date_naissance')->nullable();
            $table->text('adresse')->nullable();
            $table->string('situation_matrimoniale', 50)->nullable(false);
            $table->decimal('pending_balance', 15, 2)->default(0);
            $table->string('profession', 100)->nullable();
            $table->date('date_adhesion')->nullable();
            $table->enum('statut', ['actif', 'inactif'])->default('actif')->nullable();
            $table->string('photo_url')->nullable();
            $table->timestamps();
            $table->index('situation_matrimoniale');
            $table->index('date_adhesion');
        });
    }

    public function down()
    {
        Schema::dropIfExists('membres');
    }
};