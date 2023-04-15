<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblBitacoraSesiones extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'PkTblBitacoraSesion';
    protected $table = 'tblbitacorasesiones';
    protected $fillable = [
        'PkTblBitacoraSesion',
        'FkTblUsuario',
        'RegistroEntrada',
        'RegistroSalida'
    ];
}
