<?php

namespace App\Repositories\gala;

use App\Models\TblClientes;
use App\Models\TblDirecciones;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ClienteRepository 
{
    public function validarClienteExistentePorNombre($tipo, $pkPoblacion, $data, $pkCliente = 0) {
		$nombreCompleto = $data['nombreCliente'].' '.$data['apellidoPaternoCliente'].' '.($data['apellidoMaternoCliente'] ?? '');

		$clienteNombre = TblClientes::join('tbldirecciones', 'tbldirecciones.FkTblCliente', 'tblclientes.PkTblCliente')
									->whereRaw("TRIM(CONCAT(tblclientes.Nombre, ' ', COALESCE(tblclientes.ApellidoPaterno, ''), ' ', COALESCE(tblclientes.ApellidoMaterno, ''))) SOUNDS LIKE ?", ['%'. trim($nombreCompleto) .'%'])
									->where([
										['tblclientes.PkTblCliente', '!=', $pkCliente],
										['tbldirecciones.FkCatPoblacion', $pkPoblacion]
									]);

		$clienteNombre = $tipo == 'instalacion' ? $clienteNombre->whereNull('Validado') : $clienteNombre->where('Validado', 1);
									  
		return $clienteNombre->count();
	}

	public function validarClienteExistentePorTelefono ($tipo, $telefono, $pkCliente = 0 ) {
		$clienteTelefono = TblClientes::where('Telefono', $telefono)
									  ->where('PkTblCliente', '!=', $pkCliente);

		if ( $tipo == 'instalacion' ) {
			$clienteTelefono = $clienteTelefono->whereNull('Validado');
		}

		return $clienteTelefono->count();
	}

    public function crearNuevoCliente( $informacionCliente, $pkUsuario, $validado = null ){
        $registro = new TblClientes();
		$registro->Nombre 			= $this->trimValidator($informacionCliente['nombreCliente']);
		$registro->ApellidoPaterno 	= $this->trimValidator($informacionCliente['apellidoPaternoCliente']);
		$registro->ApellidoMaterno 	= $this->trimValidator($informacionCliente['apellidoMaternoCliente']);
		$registro->Sexo 			= $informacionCliente['sexoCliente'];
		$registro->Telefono 		= $this->trimValidator($informacionCliente['telefonoCliente']);
		$registro->TelefonoOpcional = $this->trimValidator($informacionCliente['telefonoOpcionalCliente']);
		$registro->FkTblUsuarioAlta = $pkUsuario;
		$registro->FechaAlta		= Carbon::now();
		$registro->Validado			= $validado;
		$registro->Activo 			= 1;
		$registro->save();

		return $registro->PkTblCliente;
    }

    public function crearDireccionCliente( $direccion, $pkCliente ){
		$registro = new TblDirecciones();
		$registro->FkCatPoblacion           = $direccion['poblacionCliente'];
		$registro->FkTblCliente             = $pkCliente;
		$registro->Coordenadas              = $this->trimValidator($direccion['coordenadasCliente']);
		$registro->ReferenciasDomicilio     = $this->trimValidator($direccion['referenciasDomicilioCliente']);
		$registro->CaracteristicasDomicilio = $this->trimValidator($direccion['caracteristicasDomicilioCliente']);
		$registro->Calle                    = $this->trimValidator($direccion['calleCliente']);
		$registro->save();
	}

	public function consultarClientes(){
		$clienteConsulta = DB::table('vistageneralclientes')
		                     ->where('vistageneralclientes.Validado', 1);
		
		return $clienteConsulta->get();
	}

	public function consultarDatosClienteModificacion( $pkcliente ){
		$clienteModificacion = DB::table('vistageneralclientes')
								 ->where('PkTblCliente', $pkcliente);
		
		return $clienteModificacion->get();								 
	}

	public function modificarDatosCliente( $pkClienteModificacion, $datosModificacion, $validado = null ){
		TblClientes::where('PkTblCliente','=', $pkClienteModificacion)
				   ->update([
						'Nombre' 		   => $datosModificacion['nombreCliente'],
						'ApellidoPaterno'  => $datosModificacion['apellidoPaternoCliente'],
						'ApellidoMaterno'  => $datosModificacion['apellidoMaternoCliente'],
						'Sexo' 			   => $datosModificacion['sexoCliente'],
						'Telefono' 		   => $datosModificacion['telefonoCliente'],
						'TelefonoOpcional' => $datosModificacion['telefonoOpcionalCliente'],
						'Validado' 		   => $validado
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

	public function obtenerClientePorPK ( $pkCliente ) {
        $cliente = DB::table('vistageneralclientes')
                     ->where('PkTblCliente', $pkCliente);
        
        return $cliente->get();
    }

	public function trimValidator ( $value ) {
		return $value != null && trim($value) != '' ? trim($value) : null;
	}
}