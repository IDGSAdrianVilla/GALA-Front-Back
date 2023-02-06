<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblBitacoraAcciones extends Model
{
    use HasFactory;
    protected $primaryKey = 'PkTblBitacoraAccion';
    protected $table = 'tblbitacoraacciones';
    protected $fillable = 
    [
        'PkTblBitacoraAcccion',
        'NombreTabla',
        'Accion',
        'FkTblUsuario',
        'ObjetoAntes',
        'ObjetoDespues',
        'FkCatStatus',
        'FechaModificación'
    ];
}
