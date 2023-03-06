<?php

namespace App\Services\Gala;

use App\Repositories\Gala\ClienteRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Class ClienteService
 * @package App\Services
 */
class ClienteService
{
    protected $clienteRepository;

    public function __construct(
        ClienteRepository $ClienteRepository
    )
    {
        $this->clienteRepository = $ClienteRepository;
    }

    public function crearNuevoCliente( $datosCliente){
        $validarCliente = $this->clienteRepository->validarClienteExistente(
            $datosCliente['informacionPersonal']['telefonoCliente'],
        );

        if( $validarCliente > 0 ){
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe un cliente con Información Similar',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $pkCliente = $this->clienteRepository->crearNuevoCliente( $datosCliente['informacionPersonal'] );
            $this->clienteRepository->crearDireccionCliente( $datosCliente['direccion'], $pkCliente);
        DB::commit();

        return response()->json(
            [
                'message' => 'Se creó con éxito el nuevo cliente'
            ],
            200
        );
    }

    public function holi(){
        Log::alert('holi');
    }
}
