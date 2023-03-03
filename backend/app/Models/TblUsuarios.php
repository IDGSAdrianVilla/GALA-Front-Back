<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblUsuarios extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey ='PkTblUsuario';
    protected $table = 'tblusuarios';
    protected $fillable = 
    [
        'PkTblUsuario', 
        'FkTblEmpleados', 
        'FkCatRol', 
        'Correo', 
        'Password', 
        'ObjetoPermisosEspeciales'
    ];
}
