<?php

namespace App\Repositories\Gala;

use App\Models\TblDirecciones;
use App\Models\TblEmpleados;
use App\Models\TblSesiones;
use App\Models\TblUsuarios;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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

	public function crearEmpleadoNuevo( $informacionUsuario ){
		$registro = new TblEmpleados();
		$registro->NombreEmpleado 	= $informacionUsuario['nombreEmpleado'];
		$registro->ApellidoPaterno 	= $informacionUsuario['apellidoPaternoEmpleado'];
		$registro->ApellidoMaterno 	= $informacionUsuario['apellidoMaternoEmpleado'];
		$registro->Sexo 			= $informacionUsuario['sexoEmpleado'];
		$registro->Telefono 		= $informacionUsuario['telefonoEmpleado'];
		$registro->FechaNacimiento 	= $informacionUsuario['fechaNacimientoEmpleado'];
		$registro->Observaciones 	= $informacionUsuario['observacionesEmpleado'];
		$registro->Activo 			= 1;
		$registro->save();

		return $registro->PkTblEmpleado;
	}

	public function crearUsuarioNuevo( $credenciales, $fkEmpleado, $pkUsuario /*$fkRol*/ ){ 
		$registro = new TblUsuarios();
		$registro->FkTblEmpleado 			= $fkEmpleado; 
		//$registro->FkCatRol 				= $fkRol;
		$registro->Correo 					= $credenciales['correoEmpleado'];
		$registro->Password 				= $credenciales['passwordEmpleado'];
		//$registro->ObjetoPermisosEspeciales = 
		$registro->FkTblUsuarioAlta 		= $pkUsuario;
		$registro->FechaAlta 				= Carbon::now();
		$registro->Activo 					= 1;
		$registro->save();
	}

	public function crearDireccionEmpleado( $direccion, $pkEmpleado){
		$registro = new TblDirecciones();
		$registro->FkCatPoblacion           = $direccion['poblacionEmpleado'];
		$registro->FkTblEmpleado            = $pkEmpleado;
		$registro->Coordenadas              = $direccion['coordenadasEmpleado'];
		$registro->ReferenciasDomicilio     = $direccion['referenciasDomicilioEmpleado'];
		$registro->CaracteristicasDomicilio = $direccion['caracteristicasDomicilioEmpleado'];
		$registro->Calle                    = $direccion['calleEmpleado'];
		$registro->save();
	}

	public function consultaUsuariosPorRoles( $roles ){
		$usuariosPorRoles = DB::table('vistageneralusuarios')
							  ->whereIn('PkCatRol', $roles);
		
		return $usuariosPorRoles->get();
	}

}
