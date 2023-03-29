<?php

namespace App\Repositories\Gala;

use App\Models\TblDetalleReporte;
use App\Models\TblReportes;
use Carbon\Carbon;

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
                                    'tblreportes.FechaAlta', 'catstatus.NombreStatus'
                                 )
                               ->join('tblclientes', 'tblclientes.PkTblCliente', 'tblreportes.FkTblCliente')
                               ->join('tbldirecciones', 'tbldirecciones.FkTblCliente', 'tblreportes.FkTblCliente')
                               ->join('tbldetallereporte', 'tbldetallereporte.FkTblReporte', 'tblreportes.PkTblReporte')
                               ->join('catproblemasgenericos', 'catproblemasgenericos.PkCatProblema', 'tbldetallereporte.FkCatProblemaGenerico')
                               ->join('catpoblaciones', 'catpoblaciones.PkCatPoblacion', 'tbldirecciones.FkCatPoblacion')
                               ->join('catstatus', 'catstatus.PkCatStatus', 'tblreportes.FkCatStatus');
        
        if ( $status != 0 ) {
            $reportes->where('catstatus.PkCatStatus', $status);
        }

        return $reportes->get();
    }
}
