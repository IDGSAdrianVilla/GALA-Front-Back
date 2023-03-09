<?php

namespace App\Http\Controllers\Gala;

use App\Http\Controllers\Controller;
use App\Services\Gala\CatalogoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CatalogoController extends Controller
{
    protected $catalogoService;

    public function __construct(
        CatalogoService $CatalogoService
    )
    {
        $this->catalogoService = $CatalogoService;
    }

    public function obtenerPoblaciones(){
        try{
            return $this->catalogoService->obtenerPoblaciones();
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

    public function obtenerRoles(){
        try{
            return $this->catalogoService->obtenerRoles();
        } catch( \Exception $error ){
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

    public function crearNuevaPoblacion( Request $request ){
        try{
            return $this->catalogoService->crearNuevaPoblacion( $request->all() );
        } catch( \Exception $error ){
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

    public function consultaDatosPoblacionModificacion ( Request $request ) {
        try{
            return $this->catalogoService->consultaDatosPoblacionModificacion( $request->all() );
        } catch( \Exception $error ){
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

    public function modificarPoblacion( Request $request ){
        try{
            return $this->catalogoService->modificarPoblacion( $request->all() );
        } catch( \Exception $error ){
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
