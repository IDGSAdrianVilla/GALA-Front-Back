<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatPoblaciones extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'PkCatPoblacion';
    protected $table = 'catpoblaciones';
    protected $fillable = 
    [
        'PkCatPoblacion',
        'CodigoPostal',
        'NombrePoblacion',
        'FkTblUsuarioAlta',
        'FechaAlta',
        'Activo'
    ];
}
