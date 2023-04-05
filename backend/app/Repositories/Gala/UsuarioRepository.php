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
		$registro->Telefono 		= trim($informacionUsuario['telefonoEmpleado']);
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
		$registro->Password 				= bcrypt(trim($credenciales['passwordEmpleado']));
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

	public function consultarDatosUsuarioModificacion( $pkusuario ){
		$usuarioModificacion = DB::table('vistageneralusuarios')
								 ->where('PkTblUsuario', $pkusuario);
								 
		return $usuarioModificacion->get();
	}

	public function validarUsuarioPorTelefono( $telefono, $pk ){
		$usuariosEncontrados = DB::table('vistageneralusuarios')
								 ->where('Telefono', '=', $telefono)
								 ->where('PkTblUsuario','!=', $pk);

		return $usuariosEncontrados->count();
	}

	public function obtenerPkEmpleado( $pkUsuario ){
		$obtenerPk = DB::table('vistageneralusuarios')
					   ->select('PkTblEmpleado')
					   ->where('PkTblUsuario','=', $pkUsuario);
		
		return $obtenerPk->get()[0]->PkTblEmpleado;			   
	}

	public function modificarDatosEmpleado( $pkEmpleado, $datosEmpleados ){
		TblEmpleados::where('PkTblEmpleado', '=', $pkEmpleado)
					->update([
						'Nombre' 		  => trim($datosEmpleados['nombreEmpleado'] 		 ?? $datosEmpleados['nombrePerfil']),
						'ApellidoPaterno' => trim($datosEmpleados['apellidoPaternoEmpleado'] ?? $datosEmpleados['apellidoPaternoPerfil']),
						'ApellidoMaterno' => trim($datosEmpleados['apellidoMaternoEmpleado'] ?? $datosEmpleados['apellidoMaternoPerfil']),
						'Sexo' 			  => $datosEmpleados['sexoEmpleado'] 				 ?? $datosEmpleados['sexoPerfil'],
						'Telefono' 		  => trim($datosEmpleados['telefonoEmpleado'] 		 ?? $datosEmpleados['telefonoPerfil']),
						'FechaNacimiento' => $datosEmpleados['fechaNacimientoEmpleado'] 	 ?? $datosEmpleados['fechaNacimientoPerfil'],
						'Observaciones'   => trim($datosEmpleados['observacionesEmpleado'] 	 ?? $datosEmpleados['observacionesPerfil'])
					]);
	} 

	public function modificarDatosUsuario( $pkUsuario, $datosUsuario ){
		if ( !is_null($datosUsuario['objetoPermisos']) ) {
			$reemplazos = array(
				'\u00e1' => 'á',
				'\u00e9' => 'é',
				'\u00f3' => 'ó',
				'\u00fa' => 'ú'
			);
			
			$nuevaCadenaPermisos = json_encode($datosUsuario['objetoPermisos']);
			$nuevaCadenaPermisos = str_replace(array_keys($reemplazos), array_values($reemplazos), $nuevaCadenaPermisos);
			$datosUsuario['objetoPermisos'] = '['.$nuevaCadenaPermisos.']';
		}

		TblUsuarios::where('PkTblUsuario','=', $pkUsuario)
				   ->update([
						'FkCatRol' 					=> $datosUsuario['rolEmpleado'],
						'ObjetoPermisosEspeciales' 	=> $datosUsuario['objetoPermisos']
				   ]);
	}

	public function modificarDatosDireccion( $datosDireccion, $pkEmpleado ){
		TblDirecciones::where('FkTblEmpleado', '=', $pkEmpleado)
					  ->update([
						'FkCatPoblacion' 		   => $datosDireccion['poblacionEmpleado'] ?? $datosDireccion['poblacionPerfil'],
						'Coordenadas' 			   => trim($datosDireccion['coordenadasEmpleado'] ?? $datosDireccion['coordenadasPerfil']),
						'ReferenciasDomicilio' 	   => trim($datosDireccion['referenciasDomicilioEmpleado'] ?? $datosDireccion['referenciasDomicilioPerfil']),
						'CaracteristicasDomicilio' => trim($datosDireccion['caracteristicasDomicilioEmpleado'] ?? $datosDireccion['caracteristicasDomicilioPerfil']),
						'Calle' 				   => trim($datosDireccion['calleEmpleado'] ?? $datosDireccion['callePerfil'])
					  ]);
	}

	public function consultarDatosUsuarioModificacionPerfil( $pkperfil ){
		$usuarioModificacionPerfil = DB::table('vistageneralusuarios')
								       ->where('PkTblUsuario', $pkperfil);
								 
		return $usuarioModificacionPerfil->get();
	}

	public function validarUsuarioModificacionExistente( $telefono, $correo, $pk ){
		$return = DB::table('vistageneralusuarios')
								 ->where([
									['Telefono', $telefono],
									['Correo', $correo],
									['PkTblUsuario','!=', $pk]
								 ]);

		return $return->count();
	}

	public function modificarDatosUsuarioPerfil($pkEmpleado, $datosUsuario){
		TblUsuarios::where('FkTblEmpleado', $pkEmpleado)
				   ->update([
				  		'Correo' => trim($datosUsuario['correoPerfil']),
				  		'Password' => bcrypt(trim($datosUsuario['contraseniaNueva']))
				   ]);
	}
}
