<?php

namespace App\Repositories;

use App\Models\TblSesiones;
use App\Models\TblUsuarios;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
/**
 * Class LoginRepository.
 */
class LoginRepository
{
    /**
     * @return string
     *  Return the model
     */

    public function login ( $correo, $password ){
        $temporal = TblUsuarios::select('PkTblUsuario')
                    ->where([
                        ['Correo', $correo], 
                        ['Password', $password]
                    ]);
                    
        $pk = $temporal->count() == 0 ? null : $temporal->get()[0]->PkTblUsuario;
        
        if(!is_null($pk)){
            DB::beginTransaction();
                TblSesiones::where('FkTblUsuario', '=', $pk)->delete();
                $registro = new TblSesiones();
                $registro->FkTblUsuario = $pk;
                $registro->Token = Str::random(50);
                $registro->save();
            DB::commit();
            return $registro->Token;
        }

        return null;
    }

    public function auth( $token ){
        $sesiones = TblSesiones::where('Token', '=', $token)->count();
        return $sesiones > 0 ? 'true' : 'false';
    }
    
    public function logout( $token ){
        return TblSesiones::where('Token', '=', $token)->delete();
    }
}
