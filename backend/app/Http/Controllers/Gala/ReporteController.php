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
}
