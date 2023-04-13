<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblDetalleInstalaciones extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'PkTblDetalleInstalacion';
    protected $table = 'tbldetalleinstalaciones';
    protected $fillable = 
    [
        'PkTblDetalleInstalacion',
        'FkTblInstalacion',
        'FkCatClasificacionInstalacion',
        'FkCatPlanInternet',
        'Disponibilidad ',
        'Observaciones',
        'FkTblUsuariosAtendiendo',
        'FechaAtendiendo',
        'FkTblUsuariosAtencion',
        'FechaAtencion'
    ];

}
