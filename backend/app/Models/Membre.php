<?php
// app/Models/Membre.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function operations()
    {
        return $this->hasMany(Operation::class);
    }

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

    public function scopeActifs($query)
    {
        return $query->where('statut', 'actif');
    }
    public function getMonthlyCotisationRate()
    {
        if (!$this->date_naissance) {
            return 3000;
        }
        $age = Carbon::parse($this->date_naissance)->age;
        if ($age < 18) {
            return 3000;
        }
        // majeur
        if ($this->situation_matrimoniale === 'célibataire') {
            return 3000;
        }
        return 5000;
    }
}