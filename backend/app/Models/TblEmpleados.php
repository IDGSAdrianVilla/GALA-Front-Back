<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblEmpleados extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'PkTblEmpleado';
    protected $table = 'tblempleados';
    protected $fillable = 
    [
        'PkTblEmpleado',
        'Nombre',
        'ApellidoPaterno',
        'ApellidoMaterno',
        'Sexo',
        'Telefono',
        'FechaNacimiento',
        'Observaciones',
        'Activo'
    ];
}
