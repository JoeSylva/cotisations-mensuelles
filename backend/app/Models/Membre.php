<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Membre extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nom',
        'prenom',
        'telephone',
        'date_naissance',
        'adresse',
        'situation_matrimoniale',
        'profession',
        'date_adhesion',
        'statut',
        'photo_url',
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'date_adhesion' => 'date',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function operations()
    {
        return $this->hasMany(Operation::class);
    }

    // Accessors
    public function getNomCompletAttribute()
    {
        return $this->user->prenom . ' ' . $this->user->nom;
    }

    public function getEmailAttribute()
    {
        return $this->user->email;
    }

    public function getTelephoneAttribute()
    {
        return $this->user->telephone;
    }

    // Scopes
    public function scopeActifs($query)
    {
        return $query->where('statut', 'actif');
    }
}