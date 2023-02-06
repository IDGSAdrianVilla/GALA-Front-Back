<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblDetalleInstalacion extends Model
{
    use HasFactory;
    protected $primaryKey = 'PkTblDetalleInstalacion';
    protected $table = 'tbldetalleinstalaciones';
    protected $fillable = 
    [
        'PkTblDetalleInstalacion',
        'FkTblInstalacion',
        'FkCatClasificacion',
        'Disponibilidad ',
        'Observaciones',
        'FkTblUsuariosAtendiendo',
        'FechaAtendiendo',
        'FkTblUsuariosAtendio',
        'FechaAtendi'
    ];
    

}
