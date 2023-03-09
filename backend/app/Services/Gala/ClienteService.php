<?php

namespace App\Services\Gala;

use App\Repositories\Gala\ClienteRepository;
use App\Repositories\Gala\UsuarioRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Class ClienteService
 * @package App\Services
 */
class ClienteService
{
    protected $clienteRepository;
    protected $usuarioRepository;

    public function __construct(
        ClienteRepository $ClienteRepository,
        UsuarioRepository $UsuarioRepository
    )
    {
        $this->clienteRepository = $ClienteRepository;
        $this->usuarioRepository = $UsuarioRepository;
    }

    public function crearNuevoCliente( $datosCliente ){
        $validarCliente = $this->clienteRepository->validarClienteExistente( $datosCliente['informacionPersonal'] );

        if( $validarCliente > 0 ){
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe un Cliente con información similar. Por favor valida la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $sesion = $this->usuarioRepository->obtenerInformacionPorToken( $datosCliente['token'] );
            $pkCliente = $this->clienteRepository->crearNuevoCliente( $datosCliente['informacionPersonal'], $sesion[0]->PkTblUsuario );
            
            $this->clienteRepository->crearDireccionCliente( $datosCliente['direccion'], $pkCliente);
        DB::commit();

        return response()->json(
            [
                'message' => 'Se registró con éxito el nuevo cliente'
            ],
            200
        );
    }

    public function consultarClientes(){
        $clienteConsultar = $this->clienteRepository->consultarClientes();
        return response()->json(
            [
                'message' => 'Se consultó la información con éxito',
                'data' => $clienteConsultar
            ]
        );
    }

    public function consultarDatosClienteModificacion( $pkcliente ){
        $clienteModifcar = $this->clienteRepository->consultarDatosClienteModificacion( $pkcliente );
        return response()->json(
            [
                'message' => 'Se consultó con éxito la información',
                'data' => $clienteModifcar
            ]
        );
    }

    public function modificarDatosCliente( $datosCliente ){
        $validarCliente = $this->clienteRepository->validarClienteExistente( $datosCliente['informacionPersonal'], $datosCliente['pkClienteModificacion'] );

        if( $validarCliente > 0 ){
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe un Cliente con información similar. Por favor valida la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $this->clienteRepository->modificarDatosCliente( $datosCliente['pkClienteModificacion'], $datosCliente['informacionPersonal']);
            $this->clienteRepository->modificarDatosDireccion( $datosCliente['pkClienteModificacion'], $datosCliente['direccionPersonal']);
        DB::commit();

        return response()->json(
            [
                'message' => 'Se modificó el cliente '.$datosCliente['informacionPersonal']['nombreCliente'].' con éxito'
            ],
            200
        );
    }
}
