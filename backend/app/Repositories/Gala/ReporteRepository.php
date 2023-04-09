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
                                    'tbldetallereporte.Diagnostico',
                                    'tbldetallereporte.Solucion',
                                    'tbldetallereporte.FkTblUsuarioAtendiendo',
                                    'tbldetallereporte.FkTblUsuarioAtencion',
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
                                ->join('catstatus', 'catstatus.PkCatStatus', 'tblreportes.FkCatStatus')
                                ->where([
                                    ['tblreportes.PkTblReporte', '!=', $pkReporte],
                                    ['tblreportes.FkTblCliente', $pkCliente],
                                    ['tbldetallereporte.FkCatProblemaGenerico', $pkProblema],
                                    ['catstatus.PkCatStatus', 1]
                                ]);

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

    public function validarReporteComenzado ( $pkReporte ) {
        $return = TblDetalleReporte::where('FkTblReporte', $pkReporte)
                                   ->where(function ($query) {
                                       $query->whereNotNull('FkTblUsuarioAtendiendo')
                                           ->orWhereNotNull('FechaAtendiendo');
                                   });
    
        return $return->count();
    }

    public function comenzarReporteCliente ( $pkReporte, $pkUsuario ) {
        TblDetalleReporte::where('FkTblReporte', $pkReporte)
                         ->update([
                            'FkTblUsuarioAtendiendo' => $pkUsuario,
                            'FechaAtendiendo'        => Carbon::now()
                         ]);
    }

    public function validarReporteStatusPorUsuario ( $pkReporte, $pkUsuario ) {
        $return = TblDetalleReporte::where([
                                        ['FkTblReporte', $pkReporte],
                                        ['FkTblUsuarioAtendiendo', '!=', $pkUsuario]
                                     ]);

        return $return->count();
    }

    public function validarReporteSinComenzar ( $pkReporte ) {
        $return = TblDetalleReporte::where('FkTblReporte', $pkReporte)
                                   ->where(function ($query) {
                                       $query->whereNull('FkTblUsuarioAtendiendo')
                                           ->orWhereNull('FechaAtendiendo');
                                   });
    
        return $return->count();
    }

    public function dejarReporteEnCurso ( $pkReporte, $pkUsuario ) {
        TblDetalleReporte::where([
                             ['FkTblReporte', $pkReporte],
                             ['FkTblUsuarioAtendiendo', $pkUsuario]
                           ])
                         ->update([
                             'FkTblUsuarioAtendiendo' => null,
                             'FechaAtendiendo'        => null
                           ]);
    }

    public function validarReporteAtendidoPorUsuario ( $pkReporte ) {
        $return = TblDetalleReporte::where('FkTblReporte', $pkReporte)
                                   ->where(function ($query) {
                                       $query->whereNotNull('FkTblUsuarioAtencion')
                                           ->orWhereNotNull('FechaAtencion');
                                   });
    
        return $return->count();
    }

    public function atenderReporteCliente ( $pkReporte, $pkUsuario ) {
        TblReportes::where('PkTblReporte', $pkReporte)
                   ->update([
                      'FkCatStatus' => 2
                   ]);

        TblDetalleReporte::where('FkTblReporte', $pkReporte)
                         ->update([
                            'FkTblUsuarioAtendiendo' => null,
                            'FechaAtendiendo'        => null,
                            'FkTblUsuarioAtencion'   => $pkUsuario,
                            'FechaAtencion'          => Carbon::now()
                         ]);
    }

    public function validarReporteSinAtender ( $pkReporte ) {
        $return = TblDetalleReporte::where('FkTblReporte', $pkReporte)
                                   ->where(function ($query) {
                                       $query->whereNull('FkTblUsuarioAtencion')
                                           ->orWhereNull('FechaAtencion');
                                   });
    
        return $return->count();
    }

    public function retomarReporteCliente ( $pkReporte ) {
        TblReportes::where('PkTblReporte', $pkReporte)
                   ->update([
                      'FkCatStatus' => 1
                   ]);

        TblDetalleReporte::where('FkTblReporte', $pkReporte)
                         ->update([
                             'FkTblUsuarioAtendiendo' => null,
                             'FechaAtendiendo'        => null,
                             'FkTblUsuarioAtencion' => null,
                             'FechaAtencion'        => null
                           ]);
    }
}
