<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblDetalleInstalacion extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'PkTblDetalleInstalacion';
    protected $table = 'tbldetalleinstalacion';
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
