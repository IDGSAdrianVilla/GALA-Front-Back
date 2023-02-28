<?php

namespace App\Repositories\Gala;

use App\Models\TblDirecciones;
use App\Models\TblEmpleados;
use App\Models\TblSesiones;
use App\Models\TblUsuarios;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

//use Your Model

/**
 * Class UsuarioRepository.
 */
class UsuarioRepository 
{
    /**
     * @return string
     *  Return the model
     */

    public function obtenerInformacionPorToken( $token ){
        $usuario = TblSesiones::select('vistageneralusuarios.*')
							  ->join('vistageneralusuarios', 'vistageneralusuarios.PkTblUsuario', '=', 'tblsesiones.FkTblUsuario')
							  ->where('Token', '=', $token);

        return $usuario->get();
    }

	public function validarUsuarioExistente ( $telefono, $correo ) {
		$empleadoExistente = TblEmpleados::where('Telefono', $telefono)->count();
		$usuarioExistente  = TblUsuarios::where('Correo', $correo)->count();

		return $empleadoExistente + $usuarioExistente;
	}

	public function crearEmpleadoNuevo( $informacionUsuario ){
		$registro = new TblEmpleados();
		$registro->Nombre 			= trim($informacionUsuario['nombreEmpleado']);
		$registro->ApellidoPaterno 	= trim($informacionUsuario['apellidoPaternoEmpleado']);
		$registro->ApellidoMaterno 	= trim($informacionUsuario['apellidoMaternoEmpleado']);
		$registro->Sexo 			= $informacionUsuario['sexoEmpleado'];
		$registro->Telefono 		= $informacionUsuario['telefonoEmpleado'];
		$registro->FechaNacimiento 	= $informacionUsuario['fechaNacimientoEmpleado'];
		$registro->Observaciones 	= trim($informacionUsuario['observacionesEmpleado']);
		$registro->Activo 			= 1;
		$registro->save();

		return $registro->PkTblEmpleado;
	}

	public function crearUsuarioNuevo( $credenciales, $rolPermisos, $fkEmpleado, $pkUsuario){

		if ( !is_null($rolPermisos['objetoPermisos']) ) {
			$reemplazos = array(
				'\u00e1' => 'á',
				'\u00e9' => 'é',
				'\u00f3' => 'ó',
				'\u00fa' => 'ú'
			);
			
			$nuevaCadenaPermisos = json_encode($rolPermisos['objetoPermisos']);
			$nuevaCadenaPermisos = str_replace(array_keys($reemplazos), array_values($reemplazos), $nuevaCadenaPermisos);
			$rolPermisos['objetoPermisos'] = '['.$nuevaCadenaPermisos.']';
		}

		$registro = new TblUsuarios();
		$registro->FkTblEmpleado 			= $fkEmpleado; 
		$registro->FkCatRol 				= $rolPermisos['rolEmpleado'];
		$registro->Correo 					= trim($credenciales['correoEmpleado']);
		$registro->Password 				= trim($credenciales['passwordEmpleado']);
		$registro->ObjetoPermisosEspeciales = $rolPermisos['objetoPermisos'];
		$registro->FkTblUsuarioAlta 		= $pkUsuario;
		$registro->FechaAlta 				= Carbon::now();
		$registro->Activo 					= 1;
		$registro->save();
	}

	public function crearDireccionEmpleado( $direccion, $pkEmpleado){
		$registro = new TblDirecciones();
		$registro->FkCatPoblacion           = $direccion['poblacionEmpleado'];
		$registro->FkTblEmpleado            = $pkEmpleado;
		$registro->Coordenadas              = trim($direccion['coordenadasEmpleado']);
		$registro->ReferenciasDomicilio     = trim($direccion['referenciasDomicilioEmpleado']);
		$registro->CaracteristicasDomicilio = trim($direccion['caracteristicasDomicilioEmpleado']);
		$registro->Calle                    = trim($direccion['calleEmpleado']);
		$registro->save();
	}

	public function consultaUsuariosPorRoles( $roles, $pk ){
		$usuariosPorRoles = DB::table('vistageneralusuarios')
							  ->where('PkTblUsuario', '!=', $pk)
							  ->whereIn('PkCatRol', $roles);
		
		return $usuariosPorRoles->get();
	}

	public function consultaDatosModificacion( $pkusuario ){
		$usuarioModificacion = DB::table('vistageneralusuarios')
								 ->whereIn('PkTblUsuario', $pkusuario);
								 
		return $usuarioModificacion->get();
	}

}
