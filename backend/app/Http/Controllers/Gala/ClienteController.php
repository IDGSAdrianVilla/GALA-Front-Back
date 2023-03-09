<?php

namespace App\Http\Controllers\Gala;

use App\Http\Controllers\Controller;
use App\Services\Gala\ClienteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClienteController extends Controller
{
    protected $clienteService;

    public function __construct(
        ClienteService $ClienteService
    )
    {
        $this->clienteService = $ClienteService;
    }

    public function crearNuevoCliente( Request $request ){
        try{
            return $this->clienteService->crearNuevoCliente($request->all());
        } catch( \Exception $error) {
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error al consultar'
                ],
                500
            );
        }

    }

    public function consultarClientes(){
        try{
            return $this->clienteService->consultarClientes();
        } catch( \Exception $error){
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error al consultar'
                ],
                500
            );
        }
    }

    public function consultarDatosClienteModificacion( Request $request ){
        try{
            return $this->clienteService->consultarDatosClienteModificacion($request->all());
        } catch( \Exception $error){
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error al consultar'
                ],
                500
            );
        }
    }

    public function modificarDatosCliente( Request $request){
        try{
            return $this->clienteService->modificarDatosCliente($request->all());
        } catch( \Exception $error){
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error al consultar'
                ],
                500
            );
        }
    }
}
