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
		$registro->Nombre 			= $this->trimValidator($informacionUsuario['nombreEmpleado']);
		$registro->ApellidoPaterno 	= $this->trimValidator($informacionUsuario['apellidoPaternoEmpleado']);
		$registro->ApellidoMaterno 	= $this->trimValidator($informacionUsuario['apellidoMaternoEmpleado']);
		$registro->Sexo 			= $informacionUsuario['sexoEmpleado'];
		$registro->Telefono 		= $this->trimValidator($informacionUsuario['telefonoEmpleado']);
		$registro->FechaNacimiento 	= $informacionUsuario['fechaNacimientoEmpleado'];
		$registro->Observaciones 	= $this->trimValidator($informacionUsuario['observacionesEmpleado']);
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
		$registro->Correo 					= $this->trimValidator($credenciales['correoEmpleado']);
		$registro->Password 				= bcrypt($this->trimValidator($credenciales['passwordEmpleado']));
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
		$registro->Coordenadas              = $this->trimValidator($direccion['coordenadasEmpleado']);
		$registro->ReferenciasDomicilio     = $this->trimValidator($direccion['referenciasDomicilioEmpleado']);
		$registro->CaracteristicasDomicilio = $this->trimValidator($direccion['caracteristicasDomicilioEmpleado']);
		$registro->Calle                    = $this->trimValidator($direccion['calleEmpleado']);
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
						'Nombre' 		  => $this->trimValidator($datosEmpleados['nombreEmpleado'] 		 ?? $datosEmpleados['nombrePerfil']),
						'ApellidoPaterno' => $this->trimValidator($datosEmpleados['apellidoPaternoEmpleado'] ?? $datosEmpleados['apellidoPaternoPerfil']),
						'ApellidoMaterno' => $this->trimValidator($datosEmpleados['apellidoMaternoEmpleado'] ?? $datosEmpleados['apellidoMaternoPerfil']),
						'Sexo' 			  => $datosEmpleados['sexoEmpleado'] 				 ?? $datosEmpleados['sexoPerfil'],
						'Telefono' 		  => $this->trimValidator($datosEmpleados['telefonoEmpleado'] 		 ?? $datosEmpleados['telefonoPerfil']),
						'FechaNacimiento' => $datosEmpleados['fechaNacimientoEmpleado'] 	 ?? $datosEmpleados['fechaNacimientoPerfil'],
						'Observaciones'   => $this->trimValidator($datosEmpleados['observacionesEmpleado'] 	 ?? $datosEmpleados['observacionesPerfil'])
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
						'Coordenadas' 			   => $this->trimValidator($datosDireccion['coordenadasEmpleado'] ?? $datosDireccion['coordenadasPerfil']),
						'ReferenciasDomicilio' 	   => $this->trimValidator($datosDireccion['referenciasDomicilioEmpleado'] ?? $datosDireccion['referenciasDomicilioPerfil']),
						'CaracteristicasDomicilio' => $this->trimValidator($datosDireccion['caracteristicasDomicilioEmpleado'] ?? $datosDireccion['caracteristicasDomicilioPerfil']),
						'Calle' 				   => $this->trimValidator($datosDireccion['calleEmpleado'] ?? $datosDireccion['callePerfil'])
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
				  		'Correo' => $this->trimValidator($datosUsuario['correoPerfil']),
				  		'Password' => bcrypt($this->trimValidator($datosUsuario['contraseniaNueva']))
				   ]);
	}

	public function obternerUsuarioPorPK ( $pkUsuario ) {
        $usuario = DB::table('vistageneralusuarios')
                     ->where('PkTblUsuario', $pkUsuario);

        return $usuario->get();
    }

	public function trimValidator ( $value ) {
		return $value != null && trim($value) != '' ? trim($value) : null;
	}
}
