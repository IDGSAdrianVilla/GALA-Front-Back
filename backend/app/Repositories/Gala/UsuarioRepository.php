<?php

namespace App\Repositories\Gala;

use App\Models\TblDirecciones;
use App\Models\TblEmpleados;
use App\Models\TblSesiones;
use App\Models\TblUsuarios;
use Carbon\Carbon;

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
        $usuario = TblSesiones::select(
									'tblusuarios.PkTblUsuario',
									'tblusuarios.Correo',
									'tblusuarios.Password',
									'tblusuarios.ObjetoPermisosEspeciales', 
									'tblempleados.PkTblEmpleado',
									'tblempleados.NombreEmpleado',
									'tblempleados.ApellidoPaterno',
									'tblempleados.ApellidoMaterno',
									'tblempleados.Sexo',
									'tblempleados.Telefono',
									'tbldirecciones.PkTblDireccion',
									'tbldirecciones.Calle',
									'tbldirecciones.Coordenadas',
									'tbldirecciones.ReferenciasDomicilio',
									'tbldirecciones.CaracteristicasDomicilio',
									'tbldirecciones.Calle',
									'catpoblaciones.PkCatPoblacion',
									'catpoblaciones.NombrePoblacion',
									'catpoblaciones.CodigoPostal',
									'catroles.PkCatRol',
									'catroles.NombreRol',
									'catroles.DescripcionRol'
								)
							  ->join('tblusuarios', 'tblusuarios.PkTblUsuario', '=', 'tblsesiones.FkTblUsuario')
							  ->join('tblempleados', 'tblempleados.PkTblEmpleado', '=', 'tblusuarios.FkTblEmpleado')
							  ->leftJoin('tbldirecciones','tbldirecciones.FkTblEmpleado', '=', 'tblempleados.PkTblEmpleado')
							  ->leftJoin('catpoblaciones', 'catpoblaciones.PkCatPoblacion', '=', 'tbldirecciones.FkCatPoblacion')
							  ->join('catroles', 'catroles.PkCatRol', '=', 'tblusuarios.FkCatRol')
							  ->leftJoin('tblpermisos', 'tblpermisos.FkCatRol', '=', 'catroles.PkCatRol')
							  ->where('tblsesiones.Token', '=', $token);

        return $usuario->get();
    } 

	public function crearEmpleadoNuevo( $informacionUsuario, $pkUsuario ){
		$registro = new TblEmpleados();
		$registro->NombreEmpleado 	= $informacionUsuario['nombreEmpleado'];
		$registro->ApellidoPaterno 	= $informacionUsuario['apellidoPaternoEmpleado'];
		$registro->ApellidoMaterno 	= $informacionUsuario['apellidoMaternoEmpleado'];
		$registro->Sexo 			= $informacionUsuario['sexoEmpleado'];
		$registro->Telefono 		= $informacionUsuario['telefonoEmpleado'];
		$registro->FechaNacimiento 	= $informacionUsuario['fechaNacimientoEmpleado'];
		$registro->Observaciones 	= $informacionUsuario['observacionesEmpleado'];
		$registro->FkTblUsuarioAlta = $pkUsuario;
		$registro->FechaAlta 		= Carbon::now();
		$registro->Activo 			= 1;
		$registro->save();

		return $registro->PkTblEmpleado;
	}

	public function crearUsuarioNuevo( $credenciales, $fkEmpleado /*$fkRol*/ ){ 
		$registro = new TblUsuarios();
		$registro->FkTblEmpleado 			= $fkEmpleado; 
		//$registro->FkCatRol 				= $fkRol;
		$registro->Correo 					= $credenciales['correoEmpleado'];
		$registro->Password 				= $credenciales['passwordEmpleado'];
		//$registro->ObjetoPermisosEspeciales = 
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

}
