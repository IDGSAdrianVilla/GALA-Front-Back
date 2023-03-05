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

    public function validarExistenciaUsuario ( $correo, $password ) {
        $temporal = TblUsuarios::select('PkTblUsuario')
                               ->where([
                                   ['Correo', $correo], 
                                   ['Password', $password]
                               ]);
        
        return $temporal->get()[0]->PkTblUsuario ?? null;
    }

    public function validarUsuarioActivo ( $pkUsuario ) {
        $usuario = TblUsuarios::where([
                                ['PkTblUsuario', $pkUsuario],
                                ['Activo', 1]
                              ]);

        return $usuario->count() > 0 ? true : false;
    }

    public function depurarSesionPorPK ( $pkUsuario ) {
        TblSesiones::where('FkTblUsuario', $pkUsuario)
                   ->delete();
    }

    public function crearSesionYAsignarToken ( $pkUsuario ){
        $registro = new TblSesiones();
        $registro->FkTblUsuario = $pkUsuario;
        $registro->Token = Str::random(50);
        $registro->save();
        
        return $registro->Token;
    }

    public function obtenerPermisosPorPK ( $pkUsuario ) {
        $permisos = DB::table('vistageneralusuarios')
                      ->selectRaw('
                            CASE
                                WHEN ObjetoPermisosEspeciales IS NULL THEN ObjetoPermisos 
                                ELSE ObjetoPermisosEspeciales 
                            END AS permisos
                      ')
                      ->where('PkTblUsuario', $pkUsuario);
                      
        return $permisos->get()[0]->permisos;
    }

    public function auth( $token ){
        $sesiones = TblSesiones::where('Token', '=', $token)->count();
        return $sesiones > 0 ? 'true' : 'false';
    }
    
    public function logout( $token ){
        return TblSesiones::where('Token', '=', $token)->delete();
    }
}
