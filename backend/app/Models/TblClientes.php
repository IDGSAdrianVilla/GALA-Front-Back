<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblClientes extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'PkTblCliente';
    protected $table = 'tblclientes';
    protected $fillable = 
    [
        'PkTblCliente',
        'Nombre',
        'ApellidoPaterno',
        'ApellidoMaterno',
        'Sexo',
        'Telefono',
        'TelefonoOpcional',
        'FkTblUsuarioAlta',
        'FechaAlta',
        'Validado',
        'Activo'
    ];
}
