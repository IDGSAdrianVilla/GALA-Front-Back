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

    public function cargaComponenteModificacionReporte ( $pkReporte ) {
        $dataReporte = [];

        $dataReporte['datosReporte'] = $this->reporteRepository->consultarDatosReporteModificacionPorPK( $pkReporte );

        if ( count($dataReporte['datosReporte']) == 0 ) {
            return response()->json(
                [
                    'message'   => 'No se ha encontrado registro de la información proporcionada',
                    'status'    => 204
                ],
                200
            );
        }

        $dataReporte['datosDetalleReporte']    = $this->reporteRepository->obtenerDetalleReportePorPK( $dataReporte['datosReporte'][0]->PkTblReporte );
        $dataReporte['datosUsuarioAtencion']   = $this->reporteRepository->obternerUsuarioPorPK( $dataReporte['datosDetalleReporte'][0]->FkTblUsuarioAtencion );
        $dataReporte['datosUsuarioAtendiendo'] = $this->reporteRepository->obternerUsuarioPorPK( $dataReporte['datosDetalleReporte'][0]->FkTblUsuarioAtendiendo );
        $dataReporte['datosCliente']           = $this->reporteRepository->obtenerClientePorPK( $dataReporte['datosReporte'][0]->FkTblCliente );
        $dataReporte['datosUsuarioRecibio']    = $this->reporteRepository->obternerUsuarioPorPK( $dataReporte['datosReporte'][0]->FkTblUsuarioRecibio );

        return response()->json(
            [
                'data'  => $dataReporte,
                'message'   => 'Se consultarón los datos con éxito'
            ],
            200
        );
    }

    public function validarReporteProblemaPendienteExistente ( $datosReporteModificado ) {
        $validaReportes = $this->reporteRepository->validarReporteProblemaPendientePorPK(
                              $datosReporteModificado['informacionReporteModificado']['pkReporte'],
                              $datosReporteModificado['informacionReporteModificado']['pkCliente'],
                              $datosReporteModificado['informacionReporteModificado']['problemaReporte']
                          );

        if ( $validaReportes > 0 ) {
            return response()->json(
                [
                    'pregunta' => '¿Estás seguro de continuar con la modificación?',
                    'message' => 'Al parecer existe un Reporte del mismo cliente y problema con status "Pendiente"',
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

    public function modificarReporteCliente ( $datosReporteModificado ) {
        DB::beginTransaction();
            $this->reporteRepository->modificarDetalleReporteCliente($datosReporteModificado['informacionReporteModificado']);
        DB::commit();

        return response()->json(
            [
                'message'   => 'Se modificó el reporte con éxito'
            ],
            200
        );
    }
}
