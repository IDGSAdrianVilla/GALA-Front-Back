<?php

namespace App\Http\Controllers\Gala;

use App\Http\Controllers\Controller;
use App\Services\Gala\InstalacionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InstalacionController extends Controller
{
    protected $instalacionService;

    public function __construct(
        InstalacionService $InstalacionService
    ) {
        $this->instalacionService = $InstalacionService;
    }

    public function registrarNuevaInstalacion ( Request $request ) {
        try{
            return $this->instalacionService->registrarNuevaInstalacion($request->all());
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
    
    public function consultarInstalacionesPorStatus ( $status ) {
        try{
            return $this->instalacionService->consultarInstalacionesPorStatus( $status );
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

    public function cargaComponenteModificacionInstalacion ( $pkInstalacion ) {
        try{
            return $this->instalacionService->cargaComponenteModificacionInstalacion( $pkInstalacion );
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

    public function validarModificarInstalacion ( Request $request ) {
        try{
            return $this->instalacionService->validarModificarInstalacion( $request->all() );
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

    public function validarComenzarInstalacion( $pkInstalacion ){
        try{
            return $this->instalacionService->validarComenzarInstalacion( $pkInstalacion );
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
    
    public function comenzarInstalacion( Request $request ){
        try{
            return $this->instalacionService->comenzarInstalacion( $request->all() );
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

    public function validarDejarInstalacion( Request $request ){
        try{
            return $this->instalacionService->validarDejarInstalacion( $request->all() );
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

    public function dejarInstalacion( Request $request ){
        try{
            return $this->instalacionService->dejarInstalacion( $request->all() );
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

    public function validarConcluirInstalacion( Request $request ){
        try{
            return $this->instalacionService->validarConcluirInstalacion( $request->all() );
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

    public function concluirInstalacion( Request $request ){
        try{
            return $this->instalacionService->concluirInstalacion( $request->all() );
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

    public function validarRetomarInstalacion( Request $request ){
        try{
            return $this->instalacionService->validarRetomarInstalacion( $request->all() );
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

    public function retomarInstalacion( Request $request ){
        try{
            return $this->instalacionService->retomarInstalacion( $request->all() );
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
}
