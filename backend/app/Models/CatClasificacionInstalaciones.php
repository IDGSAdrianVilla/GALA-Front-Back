<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatClasificacionInstalaciones extends Model
{
    use HasFactory;
    protected $primaryKey ='PkCatClasificacionInstalacion';
    protected $table = 'catclasificacioninstalaciones';
    protected $fillable = 
    [
        'PkCatClasificacionInstalacion',
        'NombreClasificacion',
        'Descripcion',
        'FkTblUsuario',
        'FechaAlta',
        'Activo'
    ];
    
}
