<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeOperation extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'categorie',// cotisation - don - depense - autres
        'type', // credit - debit
    ];

    // Relations
    public function operations()
    {
        return $this->hasMany(Operation::class);
    }

    // Scopes
    public function scopeCredits($query)
    {
        return $query->where('type', 'credit');
    }

    public function scopeDebits($query)
    {
        return $query->where('type', 'debit');
    }
}