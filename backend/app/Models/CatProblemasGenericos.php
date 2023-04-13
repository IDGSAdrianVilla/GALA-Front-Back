<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatProblemasGenericos extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = 'catproblemasgenericos';
    protected $primaryKey = 'PkCatProblema';
    protected $fillable = 
    [
        'PkCatProblema',
        'TituloProblema',
        'DescripcionProblema',
        'Observaciones',
        'FkTblUsuariosAlta',
        'FechaAlta',
        'Activo'
    ];
}
