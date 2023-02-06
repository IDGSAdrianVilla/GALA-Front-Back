<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblDetalleReporte extends Model
{
    use HasFactory;
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
        'FechaAtendio',
        'FechaAtendiendo'
    ];
}
