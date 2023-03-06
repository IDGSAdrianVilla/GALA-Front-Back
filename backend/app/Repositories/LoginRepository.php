<?php

namespace App\Repositories;

use App\Models\TblBitacoraSesiones;
use App\Models\TblSesiones;
use App\Models\TblUsuarios;
use Carbon\Carbon;
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
        $temporal = TblUsuarios::select(
                                   'PkTblUsuario',
                                   'Password'
                               )
                               ->where('Correo', $correo)
                               ->first();

        if ($temporal && password_verify($password, $temporal->Password)) {
            return $temporal->PkTblUsuario;
        } else {
            return null;
        }
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
        $registro->Token        = bcrypt(Str::random(50));
        $registro->save();
        
        return $registro->Token;
    }

    public function validarSesionSinFinalizar ( $pkUsuario ) {
        $registro = TblBitacoraSesiones::select('PkTblBitacoraSesion')
                                       ->where('FkTblUsuario', $pkUsuario)
                                       ->whereNull('RegistroSalida')
                                       ->orderBy('PkTblBitacoraSesion', 'desc')
                                       ->limit(1)
                                       ->get();

        $pkBS = $registro[0]->PkTblBitacoraSesion ?? null;

        TblBitacoraSesiones::where('PkTblBitacoraSesion', $pkBS)
                           ->update([
                               'RegistroSalida' => Carbon::now()
                           ]);
    }

    public function crearRegistroBitacora ( $pkUsuario ) {
        $registro = new TblBitacoraSesiones();
        $registro->FkTblUsuario    = $pkUsuario;
        $registro->RegistroEntrada = Carbon::now();
        $registro->save();
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
        $sesiones = TblSesiones::where('Token', $token)->count();
        return $sesiones > 0 ? 'true' : 'false';
    }
    
    public function logout( $token ){
        $sesion = TblSesiones::where('Token', $token);

        $pkUsuarioSesion = $sesion->get()[0]->FkTblUsuario ?? null;

        TblBitacoraSesiones::where('PkTblBitacoraSesion', $pkUsuarioSesion)
                           ->update([
                               'RegistroSalida' => Carbon::now()
                           ]);
        
        $sesion->delete();
    }
}
