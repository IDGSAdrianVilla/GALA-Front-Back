<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatProblemasGenericos extends Model
{
    use HasFactory;
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
