<?php

namespace App\Models;

use Illuminate\Database\DBAL\TimestampType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblSesiones extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'PkTblSesion';
    protected $table = 'tblsesiones';
    protected $fillable = 
    [
        'PkTblSesion',
        'FkTblUsuario',
        'Token'
    ]; 

    public $sequence = null;
}
