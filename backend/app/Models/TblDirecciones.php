<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblDirecciones extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'PkTblDireccion';
    protected $table = 'tbldirecciones';
    protected $fillable = 
    [
        'PkTblDireccion',
        'FkCatPoblacion',
        'FkTblCliente',
        'FkTblEmpleado',
        'Coordenadas',
        'ReferenciasDomicilio',
        'CaracteristicasDomicilio',
        'Calle'
    ];
}
