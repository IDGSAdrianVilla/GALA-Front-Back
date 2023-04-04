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
}
