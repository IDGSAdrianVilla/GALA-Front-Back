<?php

namespace App\Repositories\Gala;

use App\Models\TblDetalleReporte;
use App\Models\TblReportes;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Class ReporteRepository.
 */
class ReporteRepository
{
    public function validarReportePendientePorPK ( $pkCliente ) {
        $reporte = TblReportes::join('catstatus', 'catstatus.PkCatStatus', 'tblreportes.FkCatStatus')
                              ->where([
                                ['catstatus.PkCatStatus', 1],
                                ['tblreportes.FkTblCliente', $pkCliente]
                            ]);
    
        return $reporte->count();
    }

    public function crearRegistroReporte ( $datosReporte, $pkUsuario ) {
        $registro                      = new TblReportes();
        $registro->FkTblCliente        = $datosReporte['pkCliente'];
        $registro->FkTblUsuarioRecibio = $pkUsuario;
        $registro->FechaAlta           = Carbon::now();
        $registro->FkCatStatus         = 1;
        $registro->save();

        return $registro->PkTblReporte;
    }

    public function crearRegistroDetalleReporte ( $datosDetalleReporte, $pkReporte ) {
        $registro                        = new TblDetalleReporte();
        $registro->FkTblReporte          = $pkReporte;
        $registro->FkCatProblemaGenerico = $datosDetalleReporte['problemaReporte'];
        $registro->DescripcionProblema   = trim($datosDetalleReporte['descripcionProblema']);
        $registro->Observaciones         = trim($datosDetalleReporte['observacionesReporte']);
        $registro->Diagnostico           = trim($datosDetalleReporte['diagnosticoReporte']);
        $registro->Solucion              = trim($datosDetalleReporte['solucionReporte']);
        $registro->save();
    }

    public function consultarReportesPorStatus ( $status ) {
        $reportes = TblReportes::select(
                                    'tblreportes.PkTblReporte',
                                    'tblclientes.Nombre',
                                    'tblclientes.ApellidoPaterno',
                                    'catpoblaciones.NombrePoblacion',
                                    'catproblemasgenericos.TituloProblema',
                                    'tbldetallereporte.FkTblUsuarioAtendiendo',
                                    'catstatus.NombreStatus',
                                    'catstatus.ColorStatus'
                                 )
                               ->selectRaw('DATE_FORMAT(tblreportes.FechaAlta, \'%d %b %Y\') as FechaAlta')
                               ->join('tblclientes', 'tblclientes.PkTblCliente', 'tblreportes.FkTblCliente')
                               ->join('tbldirecciones', 'tbldirecciones.FkTblCliente', 'tblreportes.FkTblCliente')
                               ->join('tbldetallereporte', 'tbldetallereporte.FkTblReporte', 'tblreportes.PkTblReporte')
                               ->join('catproblemasgenericos', 'catproblemasgenericos.PkCatProblema', 'tbldetallereporte.FkCatProblemaGenerico')
                               ->join('catpoblaciones', 'catpoblaciones.PkCatPoblacion', 'tbldirecciones.FkCatPoblacion')
                               ->join('catstatus', 'catstatus.PkCatStatus', 'tblreportes.FkCatStatus')
                               ->orderBy('tblreportes.FechaAlta', 'desc');
        
        if ( $status != 0 ) {
            $reportes->where('catstatus.PkCatStatus', $status);
        }

        return $reportes->get();
    }

    public function consultarDatosReporteModificacionPorPK ( $pkReporte ) {
        $reporte = TblReportes::select(
                                    'PkTblReporte',
                                    'FkTblCliente',
                                    'FkTblUsuarioRecibio',
                                    'FkCatStatus'
                                )
                              ->selectRaw('DATE_FORMAT(FechaAlta, \'%d-%m-%Y | %I:%i %p\') as FechaAlta')
                              ->where('PkTblReporte', $pkReporte);

        return $reporte->get();
    }

    public function obtenerDetalleReportePorPK ( $pkReporte ) {
        $detalleReporte = TblDetalleReporte::select(
                                                'catproblemasgenericos.PkCatProblema',
                                                'catproblemasgenericos.TituloProblema',
                                                'tbldetallereporte.DescripcionProblema',
                                                'tbldetallereporte.Observaciones',
                                                'tbldetallereporte.Diagnostico',
                                                'tbldetallereporte.Solucion',
                                                'tbldetallereporte.FechaAtencion',
                                                'tbldetallereporte.FkTblUsuarioAtencion',
                                                'tbldetallereporte.FechaAtendiendo',
                                                'tbldetallereporte.FkTblUsuarioAtendiendo'
                                             )
                                           ->join('catproblemasgenericos', 'catproblemasgenericos.PkCatProblema', 'tbldetallereporte.FkCatProblemaGenerico')
                                           ->where('tbldetallereporte.FkTblReporte', $pkReporte);

        return $detalleReporte->get();
    }

    public function obternerUsuarioPorPK ( $pkUsuario ) {
        $usuario = DB::table('vistageneralusuarios')
                     ->where('PkTblUsuario', $pkUsuario);

        return $usuario->get();
    }

    public function obtenerClientePorPK ( $pkCliente ) {
        $cliente = DB::table('vistageneralclientes')
                     ->where('PkTblCliente', $pkCliente);
        
        return $cliente->get();
    }

    public function validarReporteProblemaPendientePorPK ( $pkReporte, $pkCliente, $pkProblema ) {
        $reportes = TblReportes::join('tbldetallereporte', 'tbldetallereporte.FkTblReporte', '=', 'tblreportes.PkTblReporte')
                                ->where('tblreportes.PkTblReporte', '!=', $pkReporte)
                                ->where('tblreportes.FkTblCliente', $pkCliente)
                                ->where('tbldetallereporte.FkCatProblemaGenerico', $pkProblema);

        return $reportes->count();
    }

    public function modificarDetalleReporteCliente ( $dataReporte ) {
        TblDetalleReporte::where('FkTblReporte', $dataReporte['pkReporte'])
                         ->update([
                            'FkCatProblemaGenerico' => $dataReporte['problemaReporte'],
                            'DescripcionProblema'   => $dataReporte['descripcionProblema'],
                            'Observaciones'         => $dataReporte['observacionesReporte'],
                            'Diagnostico'           => $dataReporte['diagnosticoReporte'],
                            'Solucion'              => $dataReporte['solucionReporte'],
                         ]);
    }
}
