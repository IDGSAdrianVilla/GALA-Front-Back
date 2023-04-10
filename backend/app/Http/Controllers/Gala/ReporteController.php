<?php

namespace App\Http\Controllers\Gala;

use App\Http\Controllers\Controller;
use App\Services\Gala\ReporteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReporteController extends Controller
{
    protected $reporteService;

    public function __construct(
        ReporteService $ReporteService
    ) {
        $this->reporteService = $ReporteService;
    }

    public function validarReportePendienteExistente( Request $request ){
        try{
            return $this->reporteService->validarReportePendienteExistente($request->all());
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

    public function crearNuevoReporte( Request $request ){
        try{
            return $this->reporteService->crearNuevoReporte($request->all());
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

    public function consultarReportesPorStatus( $parametro ){
        try{
            return $this->reporteService->consultarReportesPorStatus($parametro);
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

    public function cargaComponenteModificacionReporte( $pkReporte ){
        try{
            return $this->reporteService->cargaComponenteModificacionReporte($pkReporte);
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

    public function validarReporteProblemaPendienteExistente( Request $request ){
        try{
            return $this->reporteService->validarReporteProblemaPendienteExistente($request->all());
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

    public function modificarReporteCliente( Request $request ){
        try{
            return $this->reporteService->modificarReporteCliente($request->all());
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

    public function validarComenzarReporteCliente( $pkReporte ){
        try{
            return $this->reporteService->validarComenzarReporteCliente( $pkReporte );
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
    
    public function comenzarReporteCliente( Request $request ){
        try{
            return $this->reporteService->comenzarReporteCliente( $request->all() );
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

    public function validarDejarReporteCliente( Request $request ){
        try{
            return $this->reporteService->validarDejarReporteCliente( $request->all() );
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

    public function dejarReporteCliente( Request $request ){
        try{
            return $this->reporteService->dejarReporteCliente( $request->all() );
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

    public function validarAtenderReporteCliente( Request $request ){
        try{
            return $this->reporteService->validarAtenderReporteCliente( $request->all() );
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

    public function atenderReporteCliente( Request $request ){
        try{
            return $this->reporteService->atenderReporteCliente( $request->all() );
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

    public function validarRetomarReporteCliente( Request $request ){
        try{
            return $this->reporteService->validarRetomarReporteCliente( $request->all() );
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

    public function retomarReporteCliente( Request $request ){
        try{
            return $this->reporteService->retomarReporteCliente( $request->all() );
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
    public function validarEliminarReporteCliente( Request $request ){
        try{
            return $this->reporteService->validarEliminarReporteCliente( $request->all() );
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
    public function eliminarReporteCliente( Request $request ){
        try{
            return $this->reporteService->eliminarReporteCliente( $request->all() );
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
