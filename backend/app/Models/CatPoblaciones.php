<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatPoblaciones extends Model
{
    use HasFactory;
    protected $primaryKey = 'PkCatPoblacion';
    protected $table = 'catpoblaciones';
    protected $fillable = 
    [
        'PkCatPoblacion',
        'NombrePoblacion',
        'FkTblUusuaio',
        'Activo'
    ];
}
