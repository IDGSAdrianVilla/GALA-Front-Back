<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblPermisos extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'PkTblPermiso';
    protected $table = 'tblpermisos';
    protected $fillable =
    [
        'PkTblPermisos',
        'FkCatRol',
        'ObjetoPermisos'
    ];
}
