<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatClasificacionInstalaciones extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey ='PkCatClasificacionInstalacion';
    protected $table = 'catclasificacioninstalaciones';
    protected $fillable = 
    [
        'PkCatClasificacionInstalacion',
        'NombreClasificacion',
        'Descripcion',
        'Observaciones',
        'FkTblUsuario',
        'FechaAlta',
        'Activo'
    ];
}
