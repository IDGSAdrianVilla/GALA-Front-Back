<?php

namespace App\Services\Gala;

use App\Repositories\gala\ClienteRepository;
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
    protected $clienteRepository;

    public function __construct(
        ReporteRepository $ReporteRepository,
        UsuarioRepository $UsuarioRepository,
        ClienteRepository $ClienteRepository,
    )
    {
        $this->reporteRepository = $ReporteRepository;
        $this->usuarioRepository = $UsuarioRepository;
        $this->clienteRepository = $ClienteRepository;
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
        $dataReporte['datosUsuarioAtencion']   = $this->usuarioRepository->obternerUsuarioPorPK( $dataReporte['datosDetalleReporte'][0]->FkTblUsuarioAtencion );
        $dataReporte['datosUsuarioAtendiendo'] = $this->usuarioRepository->obternerUsuarioPorPK( $dataReporte['datosDetalleReporte'][0]->FkTblUsuarioAtendiendo );
        $dataReporte['datosCliente']           = $this->clienteRepository->obtenerClientePorPK( $dataReporte['datosReporte'][0]->FkTblCliente );
        $dataReporte['datosUsuarioRecibio']    = $this->usuarioRepository->obternerUsuarioPorPK( $dataReporte['datosReporte'][0]->FkTblUsuarioRecibio );

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

    public function validarComenzarReporteCliente ( $pkReporte ) {
        $reporteExistente = $this->reporteRepository->validarReporteExistente($pkReporte);

        if ( count($reporteExistente) == 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer el reporte ya no existe',
                    'status' => 304
                ],
                200
            );
        }

        $validaReporte = $this->reporteRepository->validarReporteComenzado($pkReporte);

        if ( $validaReporte > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer este reporte está siendo atendido por alguien más',
                    'status' => 304
                ],
                200
            );
        }

        return response()->json(
            [
                'message' => 'El reporte se puede atender con éxito'
            ],
            200
        );
    }

    public function comenzarReporteCliente ( $datosComenzarReporte ) {
        DB::beginTransaction();
            $usuario = $this->usuarioRepository->obtenerInformacionPorToken( $datosComenzarReporte['token'] );
            $this->reporteRepository->comenzarReporteCliente( $datosComenzarReporte['pkReporte'], $usuario[0]->PkTblUsuario );
        DB::commit();

        return response()->json(
            [
                'message' => 'Se comenzó atender el reporte con éxito'
            ],
            200
        );
    }

    public function validarDejarReporteCliente ( $datosDejarReporte ) {
        $reporteExistente = $this->reporteRepository->validarReporteExistente($datosDejarReporte['pkReporte']);

        if ( count($reporteExistente) == 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer el reporte ya no existe',
                    'status' => 304
                ],
                200
            );
        }

        $usuario = $this->usuarioRepository->obtenerInformacionPorToken( $datosDejarReporte['token'] );
        $validaReportePorUsuario = $this->reporteRepository->validarReporteStatusPorUsuario( $datosDejarReporte['pkReporte'], $usuario[0]->PkTblUsuario );

        if ( $validaReportePorUsuario > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer este reporte está siendo atendido por alguien más',
                    'status' => 304
                ],
                200
            );
        }

        $validaReporte = $this->reporteRepository->validarReporteSinComenzar( $datosDejarReporte['pkReporte'] );

        if ( $validaReporte > 0 ) {
            return response()->json(
                [
                    'message' => 'Al parecer este reporte no esta siendo atendido por nadie actualmente',
                    'status' => 304
                ],
                200
            );
        }

        return response()->json(
            [
                'message' => 'El reporte se puede dejar de atender con éxito'
            ],
            200
        );
    }

    public function dejarReporteCliente ( $datosDejarReporte ) {
        DB::beginTransaction();
            $usuario = $this->usuarioRepository->obtenerInformacionPorToken( $datosDejarReporte['token'] );
            $this->reporteRepository->dejarReporteEnCurso( $datosDejarReporte['pkReporte'], $usuario[0]->PkTblUsuario );
        DB::commit();

        return response()->json(
            [
                'message' => 'Se dejó de atender el reporte con éxito'
            ],
            200
        );
    }

    public function validarAtenderReporteCliente ( $datosAtenderReporte ) {
        $reporteExistente = $this->reporteRepository->validarReporteExistente($datosAtenderReporte['pkReporte']);

        if ( count($reporteExistente) == 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer el reporte ya no existe',
                    'status' => 304
                ],
                200
            );
        }

        $usuario = $this->usuarioRepository->obtenerInformacionPorToken( $datosAtenderReporte['token'] );
        $validaReportePorUsuario = $this->reporteRepository->validarReporteStatusPorUsuario( $datosAtenderReporte['pkReporte'], $usuario[0]->PkTblUsuario );

        if ( $validaReportePorUsuario > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer este reporte está siendo atendido por alguien más',
                    'status' => 304
                ],
                200
            );
        }

        $validaReporteAtendido = $this->reporteRepository->validarReporteAtendidoPorUsuario( $datosAtenderReporte['pkReporte'] );

        if ( $validaReporteAtendido > 0 ) {
            return response()->json(
                [
                    'message' => 'Al parecer el reporte ya fue atendido',
                    'status' => 304
                ],
                200
            );
        }

        return response()->json(
            [
                'message' => 'El reporte se puede atender con éxito'
            ],
            200
        );
    }

    public function atenderReporteCliente ( $datosAtenderReporte ) {
        DB::beginTransaction();
            $usuario = $this->usuarioRepository->obtenerInformacionPorToken( $datosAtenderReporte['token'] );
            if ( isset($datosAtenderReporte['informacionReporteModificado']) ) {
                $this->reporteRepository->modificarDetalleReporteCliente($datosAtenderReporte['informacionReporteModificado']);
            }
            $this->reporteRepository->atenderReporteCliente( $datosAtenderReporte['pkReporte'], $usuario[0]->PkTblUsuario );
        DB::commit();

        return response()->json(
            [
                'message' => 'Se atendió el reporte con éxito'
            ],
            200
        );
    }

    public function validarRetomarReporteCliente ( $datosRetomarReporte ) {
        $reporteExistente = $this->reporteRepository->validarReporteExistente($datosRetomarReporte['pkReporte']);

        if ( count($reporteExistente) == 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer el reporte ya no existe',
                    'status' => 304
                ],
                200
            );
        }

        $validaReporte = $this->reporteRepository->validarReporteSinAtender( $datosRetomarReporte['pkReporte'] );

        if ( $validaReporte > 0 ) {
            return response()->json(
                [
                    'message' => 'Al parecer este reporte no ha sido atendido',
                    'status' => 304
                ],
                200
            );
        }

        return response()->json(
            [
                'message' => 'El reporte se retomar con éxito'
            ],
            200
        );
    }

    public function retomarReporteCliente ( $datosRetomarReporte ) {
        DB::beginTransaction();
            $this->reporteRepository->retomarReporteCliente( $datosRetomarReporte['pkReporte'] );
        DB::commit();

        return response()->json(
            [
                'message' => 'Se retomó el reporte con éxito'
            ],
            200
        );
    }

    public function validarEliminarReporteCliente ( $datosEliminarReporte ) {
        $reporteExistente = $this->reporteRepository->validarReporteExistente($datosEliminarReporte['pkReporte']);

        if ( count($reporteExistente) == 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer el reporte ya no existe',
                    'status' => 304
                ],
                200
            );
        }

        $usuario = $this->usuarioRepository->obtenerInformacionPorToken( $datosEliminarReporte['token'] );
        $validaReportePorUsuario = $this->reporteRepository->validarReporteStatusPorUsuario( $datosEliminarReporte['pkReporte'], $usuario[0]->PkTblUsuario );

        if ( $validaReportePorUsuario > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer este reporte está siendo atendido por alguien más',
                    'status' => 304
                ],
                200
            );
        }

        return response()->json(
            [
                'message' => 'El reporte se eliminar con éxito'
            ],
            200
        );
    }

    public function eliminarReporteCliente ( $datosEliminarReporte ) {
        DB::beginTransaction();
            $this->reporteRepository->eliminarReporteCliente( $datosEliminarReporte['pkReporte'] );
            $this->reporteRepository->eliminarDetalleReporteCliente( $datosEliminarReporte['pkReporte'] );
        DB::commit();

        return response()->json(
            [
                'message' => 'Se eliminó el reporte con éxito'
            ],
            200
        );
    }
}
