<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblReportes extends Model
{
    use HasFactory;
    protected $primaryKey = 'PkTblReporte';
    protected $table = 'tblreportes';
    protected $fillable =
    [
        'PkTblTReporte',
        'FkTblCliente',
        'FkTblUsuarioRecibio',
        'FechaAlta',
        'FkCatStatus'
    ];
}
