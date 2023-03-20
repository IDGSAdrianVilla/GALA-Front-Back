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

    public function crearNuevoProblema( Request $request ){
        try{
            return $this->catalogoService->crearNuevoProblema( $request->all() );
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

    public function obtenerProblemas () {
        try{
            return $this->catalogoService->obtenerProblemas();
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

    public function consultaDatosProblemaModificacion ( Request $request ) {
        try{
            return $this->catalogoService->consultaDatosProblemaModificacion( $request->all() );
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

    public function modificarProblema ( Request $request) {
        try{
            return $this->catalogoService->modificarProblema( $request->all() );
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

    public function crearNuevoTipoInstalacion( Request $request ){
        try{
            return $this->catalogoService->crearNuevoTipoInstalacion($request->all() );
        } catch(\Exception $error){
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

    public function obtenerTipoInstalaciones(){
        try{
            return $this->catalogoService->obtenerTipoInstalaciones();
        } catch(\Exception $error){
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

    public function consultaDatosTipoInstalacionModificacion( Request $request){
        try{
            return $this->catalogoService->consultaDatosTipoInstalacionModificacion($request->all());
        } catch(\Exception $error){
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

    public function modificarTipoInstalacion( Request $request){
        try{
            return $this->catalogoService->modificarTipoInstalacion($request->all());
        } catch(\Exception $error){
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

    public function crearRegistroRol ( Request $request ) {
        try{
            return $this->catalogoService->crearRegistroRol($request->all());
        } catch(\Exception $error){
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

    public function consultaDatosRolModificacion ( Request $request ) {
        try{
            return $this->catalogoService->consultaDatosRolModificacion($request->all());
        } catch(\Exception $error){
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

    public function validaRolExistente ( Request $request ) {
        try{
            return $this->catalogoService->validaRolExistente($request->all());
        } catch(\Exception $error){
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

    public function modificarRol ( Request $request ) {
        try{
            return $this->catalogoService->modificarRol($request->all());
        } catch(\Exception $error){
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
