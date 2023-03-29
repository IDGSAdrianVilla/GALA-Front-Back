<?php

namespace App\Services\Gala;

use App\Repositories\Gala\ReporteRepository;
use App\Repositories\Gala\UsuarioRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Class ReporteService
 * @package App\Services
 */
class ReporteService
{
    protected $reporteRepository;
    protected $usuarioRepository;

    public function __construct(
        ReporteRepository $ReporteRepository,
        UsuarioRepository $UsuarioRepository
    )
    {
        $this->reporteRepository = $ReporteRepository;
        $this->usuarioRepository = $UsuarioRepository;
    }

    public function validarReportePendienteExistente ( $datosReporte ) {
        $validaReportes = $this->reporteRepository->validarReportePendientePorPK($datosReporte['informacionReporte']['pkCliente']);

        if ( $validaReportes > 0 ) {
            return response()->json(
                [
                    'pregunta' => '¿Estás seguro de continuar con el registro?',
                    'message' => 'Al parecer existe un Reporte del mismo cliente con status "Pendiente"',
                    'status' => 300
                ],
                200
            );
        }

        return response()->json(
            [
                'message'   => 'Se puede modificar el registro con éxito'
            ],
            200
        );
    }

    public function crearNuevoReporte ( $datosReporte ) {
        DB::beginTransaction();
            $sesion     = $this->usuarioRepository->obtenerInformacionPorToken( $datosReporte['token'] );
            $pkReporte  = $this->reporteRepository->crearRegistroReporte($datosReporte['informacionReporte'], $sesion[0]->PkTblUsuario);
            $this->reporteRepository->crearRegistroDetalleReporte($datosReporte['informacionReporte'], $pkReporte);
        DB::commit();

        return response()->json(
            [
                'message'   => 'Se registró el reporte con éxito'
            ],
            200
        );
    }

    public function consultarReportesPorStatus ( $status ) {
        $reportes = $this->reporteRepository->consultarReportesPorStatus( $status );

        return response()->json(
            [
                'reportes'  => $reportes,
                'message'   => 'Se consultarón los reportes con éxito'
            ],
            200
        );
    }
}
