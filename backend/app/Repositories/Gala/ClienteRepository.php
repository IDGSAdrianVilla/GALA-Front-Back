<?php

namespace App\Repositories\gala;

use App\Models\TblClientes;
use App\Models\TblDirecciones;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use JasonGuru\LaravelMakeRepository\Repository\BaseRepository;
//use Your Model

/**
 * Class ClienteRepository.
 */
class ClienteRepository 
{
    /**
     * @return string
     *  Return the model
     */
    public function validarClienteExistente($data, $pkCliente = 0) {
		$clienteNombre = TblClientes::whereRaw('Nombre SOUNDS LIKE ? ', ['%' . $data['nombreCliente'] . '%'])
									->whereRaw('ApellidoPaterno SOUNDS LIKE ? ', ['%' . $data['apellidoPaternoCliente'] . '%'])
									->whereRaw('ApellidoMaterno SOUNDS LIKE ? ', ['%' . $data['apellidoMaternoCliente'] . '%'])
									->where('PkTblCliente', '!=', $pkCliente)
									->count();
									
		$clienteTelefono = TblClientes::where('Telefono', $data['telefonoCliente'])
									  ->where('PkTblCliente', '!=', $pkCliente)
									  ->count();
									  
		return $clienteTelefono + $clienteNombre;
	}

    public function crearNuevoCliente( $informacionCliente, $pkUsuario ){
        $registro = new TblClientes();
		$registro->Nombre 			= trim($informacionCliente['nombreCliente']);
		$registro->ApellidoPaterno 	= trim($informacionCliente['apellidoPaternoCliente']);
		$registro->ApellidoMaterno 	= trim($informacionCliente['apellidoMaternoCliente']);
		$registro->Sexo 			= $informacionCliente['sexoCliente'];
		$registro->Telefono 		= trim($informacionCliente['telefonoCliente']);
		$registro->TelefonoOpcional = trim($informacionCliente['telefonoOpcionalCliente']);
		$registro->FkTblUsuarioAlta = $pkUsuario;
		$registro->FechaAlta		= Carbon::now();
		$registro->Activo 			= 1;
		$registro->save();

		return $registro->PkTblCliente;
    }

    public function crearDireccionCliente( $direccion, $pkCliente ){
		$registro = new TblDirecciones();
		$registro->FkCatPoblacion           = $direccion	['poblacionCliente'];
		$registro->FkTblCliente             = 				 $pkCliente;
		$registro->Coordenadas              = trim($direccion['coordenadasCliente']);
		$registro->ReferenciasDomicilio     = trim($direccion['referenciasDomicilioCliente']);
		$registro->CaracteristicasDomicilio = trim($direccion['caracteristicasDomicilioCliente']);
		$registro->Calle                    = trim($direccion['calleCliente']);
		$registro->save();
	}

	public function consultarClientes(){
		$clienteConsulta = DB::table('vistageneralclientes');
		
		return $clienteConsulta->get();
	}

	public function consultarDatosClienteModificacion( $pkcliente ){
		$clienteModificacion = DB::table('vistageneralclientes')
								 ->where('PkTblCliente', $pkcliente);
		
		return $clienteModificacion->get();								 
	}

	public function modificarDatosCliente( $pkClienteModificacion, $datosModificacion ){
		TblClientes::where('PkTblCliente','=', $pkClienteModificacion)
				   ->update([
						'Nombre' 		   => $datosModificacion['nombreCliente'],
						'ApellidoPaterno'  => $datosModificacion['apellidoPaternoCliente'],
						'ApellidoMaterno'  => $datosModificacion['apellidoMaternoCliente'],
						'Sexo' 			   => $datosModificacion['sexoCliente'],
						'Telefono' 		   => $datosModificacion['telefonoCliente'],
						'TelefonoOpcional' => $datosModificacion['telefonoOpcionalCliente']
				   ]);
	}

	public function modificarDatosDireccion( $pkClienteModificacion, $datosDireccion ){
		TblDirecciones::where('FkTblCliente','=',$pkClienteModificacion)
					  ->update([
							'FkCatPoblacion'  			=> $datosDireccion['poblacionCliente'],
							'Coordenadas'     			=> $datosDireccion['coordenadasCliente'],
							'ReferenciasDomicilio'  	=> $datosDireccion['referenciasDomicilioCliente'],
							'CaracteristicasDomicilio'  => $datosDireccion['caracteristicasDomicilioCliente'],
							'Calle' 					=> $datosDireccion['calleCliente']
					  ]);
	}
}
