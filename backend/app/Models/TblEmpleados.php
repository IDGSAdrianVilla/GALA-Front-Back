<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblEmpleados extends Model
{
    use HasFactory;
    protected $primaryKey = 'PkTblEmpleado';
    protected $table = 'tblempleados';
    protected $fillable = 
    [
        'PkTblEmpleado',
        'NombreEmpleado',
        'ApellidoPaterno',
        'ApellidoMaterno',
        'Sexo',
        'Telefono',
        'FkTblUsuarioAlta',
        'FechaAlta',
        'Activo'
    ];
}
