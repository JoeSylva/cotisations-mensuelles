<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Operation extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'membre_id',
        'type_operation_id',
        'montant',
        'date_operation',
        'mois_cotisation',
        'description',
        'mode_paiement',
        'reference_paiement',
        'statut',
        'created_by',
    ];

    protected $casts = [
        'date_operation' => 'date',
        'montant' => 'decimal:2',
    ];

    // Relations
    public function membre()
    {
        return $this->belongsTo(Membre::class);
    }

    public function typeOperation()
    {
        return $this->belongsTo(TypeOperation::class);
    }

    public function createur()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scopes
    public function scopeValides($query)
    {
        return $query->where('statut', 'valide');
    }

    public function scopePeriode($query, $debut, $fin)
    {
        return $query->whereBetween('date_operation', [$debut, $fin]);
    }

    // Accessors
    public function getEstCreditAttribute()
    {
        return $this->typeOperation->type === 'credit';
    }

    public function getEstDebitAttribute()
    {
        return $this->typeOperation->type === 'debit';
    }
}