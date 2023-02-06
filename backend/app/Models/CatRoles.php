<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatRoles extends Model
{
    use HasFactory;
    protected $primaryKey = 'PkCatRol';
    protected $table = 'catroles';
    protected $fillable = 
    [
        'PkCatRol',
        'FkTblPermisos',
        'DescripcionProblema',
        'FkUsuariosAlta',
        'FechaAlta',
        'Activo'
    ];
}
