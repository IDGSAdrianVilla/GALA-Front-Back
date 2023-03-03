<?php

namespace App\Http\Controllers\Gala;

use App\Http\Controllers\Controller;
use App\Services\Gala\UsuarioService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UsuarioController extends Controller
{
    protected $usuarioService;

    public function __construct(
        UsuarioService $UsuarioService
    )
    {
        $this->usuarioService = $UsuarioService;
    }

    public function obtenerInformacion( Request $request ){
        try{
            return $this->usuarioService->obtenerInformacion( $request->all() );
        } catch( \Exception $error ) {
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

    public function crearUsuarioNuevo( Request $request ){
        try{
            return $this->usuarioService->crearUsuarioNuevo($request->all());
        } catch( \Exception $error ) {
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

    public function consultaUsuariosPorRoles( Request $request ){
        try{
            return $this->usuarioService->consultaUsuariosPorRoles($request->all());
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

    public function consultarDatosUsuarioModificacion( Request $request ){
        try{
            return $this->usuarioService->consultarDatosUsuarioModificacion($request->all());
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

    public function modificarDatosUsuario( Request $request ){
        try{
            return $this->usuarioService->modificarDatosUsuario($request->all());
        } catch(\Exception $error) {
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
