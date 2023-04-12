<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatPaquetes extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey ='PkCatPaquete';
    protected $table = 'catpaquetes';
    protected $fillable = 
    [
        'PkCatPaquete',
        'FkCatClasificacionInstalacion',
	    'UnidadMedida',
	    'Cantidad',
	    'CostoPaquete',
	    'Observaciones',
	    'FkTblUsuarioAlta',
	    'FechaAlta',
	    'Activo'
    ];
}
