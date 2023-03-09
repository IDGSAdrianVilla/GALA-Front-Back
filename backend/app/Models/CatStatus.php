<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatStatus extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'PkCatStatus';
    protected $table = 'catstatus';
    protected $fillable = 
    [
        'PkCatStatus',
        'NombreStatus',
        'DescripcionStatus',
        'FkTblUsuariosAlta',
        'FechaAlta',
        'Actuivo'
    ];
}
