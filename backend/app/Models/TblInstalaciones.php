<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblInstalaciones extends Model
{
    use HasFactory;
    protected $primaryKey = 'PkTblInstalacion';
    protected $table = 'tblinstalaciones';
    protected $fillable = 
    [
        'PkTblInstalacion',
        'FkTblCliente',
        'FkTblUsuarioRecibio',
        'FechaAlta',
        'FkCatStatus'
    ];
}
