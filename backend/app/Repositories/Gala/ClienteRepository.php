<?php

namespace App\Repositories\gala;

use App\Models\TblClientes;
use App\Models\TblDirecciones;
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
    public function validarClienteExistente( $telefono){
        $clienteExistente = TblClientes::where('Telefono', $telefono)->count();

        return $clienteExistente;
    }

    public function crearNuevoCliente( $informacionCliente ){
        $registro = new TblClientes();
		$registro->Nombre 			= trim($informacionCliente['nombreCliente']);
		$registro->ApellidoPaterno 	= trim($informacionCliente['apellidoPaternoCliente']);
		$registro->ApellidoMaterno 	= trim($informacionCliente['apellidoMaternoCliente']);
		$registro->Sexo 			= $informacionCliente['sexoCliente'];
		$registro->Telefono 		= $informacionCliente['telefonoCliente'];
		$registro->Activo 			= 1;
		$registro->save();

		return $registro->PkTblCliente;
    }

    public function crearDireccionCliente( $direccion, $pkCliente ){
		$registro = new TblDirecciones();
		$registro->FkCatPoblacion           = $direccion['poblacionCliente'];
		$registro->FkTblCliente             = $pkCliente;
		$registro->Coordenadas              = trim($direccion['coordenadasCliente']);
		$registro->ReferenciasDomicilio     = trim($direccion['referenciasDomicilioCliente']);
		$registro->CaracteristicasDomicilio = trim($direccion['caracteristicasDomicilioCliente']);
		$registro->Calle                    = trim($direccion['calleCliente']);
		$registro->save();
	}
}
