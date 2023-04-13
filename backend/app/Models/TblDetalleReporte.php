<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblDetalleReporte extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'PkTblDetalleReporte';
    protected $table = 'tbldetallereporte';
    protected $fillable = 
    [
        'PkTblDetalleReporte',
        'FkTblReporte',
        'FkCatProblemaGenerico',
        'DescripcionProblema ',
        'Observaciones',
        'Diagnostico ',
        'Solucion',
        'FkTblUsuariosAtendiendo',
        'FechaAtencion',
        'FkTblUsuariosAtencion',
        'FechaAtendiendo'
    ];
}
