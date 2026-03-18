<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('type_operations', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);//nom précise de l'operation
            $table->text('description')->nullable();
            $table->enum('categorie', ['cotisation', 'don', 'depense', 'autres']);
            $table->enum('type', ['debit', 'credit']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('type_operations');
    }
};