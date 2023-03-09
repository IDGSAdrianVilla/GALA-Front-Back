<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatProblemasGenericos extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'PkCatProblema';
    protected $fillable = 
    [
        'PkCatProblemaGenerico',
        'TituloProblema',
        'DescripcionProblema',
        'FkTblUsuariosAlta',
        'FechaAlta',
        'Activo'
    ];
}
