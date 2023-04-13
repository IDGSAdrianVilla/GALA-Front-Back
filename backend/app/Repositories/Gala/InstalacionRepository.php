<?php

namespace App\Repositories\Gala;

use App\Models\TblDetalleInstalacion;
use App\Models\TblInstalaciones;
use Carbon\Carbon;

class InstalacionRepository
{
    public function registrarNuevaInstalcion ( $pkCliente, $pkUsuario ) {
        $registro = new TblInstalaciones();
        $registro->FkTblCliente        = $pkCliente;
        $registro->FkTblUsuarioRecibio = $pkUsuario;
        $registro->FechaAlta           = Carbon::now();
        $registro->FkCatStatus         = 1;
        $registro->save();

        return $registro->PkTblInstalacion;
    }

    public function registroDetalleNuevaInstalacion ( $datosInstalacion, $pkInstalacion ) {
        $registro = new TblDetalleInstalacion();
        $registro->FkTblInstalacion              = $pkInstalacion;
        $registro->FkCatClasificacionInstalacion = $datosInstalacion['clasificacionInstalacion'];
        $registro->FkCatPlanInternet             = $datosInstalacion['paqueteInstalacion'];
        $registro->Disponibilidad                = $this->trimValidator($datosInstalacion['disponibilidadInstalacion']);
        $registro->Observaciones                 = $this->trimValidator($datosInstalacion['observacionesInstalacion']);
        $registro->save();
    }

    public function consultarInstalacionesPorStatus ( $status ) {
        $instalaciones = TblInstalaciones::select(
                                            'tblinstalaciones.PkTblInstalacion',
                                            'tblclientes.Nombre',
                                            'tblclientes.ApellidoPaterno',
                                            'catpoblaciones.NombrePoblacion',
                                            'catclasificacioninstalaciones.NombreClasificacion',
                                            'tbldetalleinstalacion.FkTblUsuarioAtendiendo',
                                            'tbldetalleinstalacion.FkTblUsuarioAtencion',
                                            'catstatus.NombreStatus',
                                            'catstatus.ColorStatus'
                                         )
                                         ->selectRaw('DATE_FORMAT(tblinstalaciones.FechaAlta, \'%d %b %Y\') as FechaAlta')
                                         ->join('tblclientes', 'tblclientes.PkTblCliente', 'tblinstalaciones.FkTblCliente')
                                         ->join('tbldirecciones', 'tbldirecciones.FkTblCliente', 'tblinstalaciones.FkTblCliente')
                                         ->join('tbldetalleinstalacion', 'tbldetalleinstalacion.FkTblInstalacion', 'tblinstalaciones.PkTblInstalacion')
                                         ->join('catpoblaciones', 'catpoblaciones.PkCatPoblacion', 'tbldirecciones.FkCatPoblacion')
                                         ->join('catstatus', 'catstatus.PkCatStatus', 'tblinstalaciones.FkCatStatus')
                                         ->join('catclasificacioninstalaciones', 'catclasificacioninstalaciones.PkCatClasificacionInstalacion', 'tbldetalleinstalacion.FkCatClasificacionInstalacion')
                                         ->orderBy('tblinstalaciones.FechaAlta', 'desc');

        if ( $status != 0 ) {
            $instalaciones->where('catstatus.PkCatStatus', $status);
        }

        return $instalaciones->get();
    }

    public function consultarDatosInstalacionModificacionPorPK ( $pkInstalacion ) {
        $instalacion = TblInstalaciones::select(
                                            'tblinstalaciones.PkTblInstalacion',
                                            'tblinstalaciones.FkTblCliente',
                                            'tblinstalaciones.FkTblUsuarioRecibio',
                                            'tblinstalaciones.FkCatStatus'
                                       )
                                       ->selectRaw('DATE_FORMAT(tblinstalaciones.FechaAlta, \'%d-%m-%Y | %I:%i %p\') as FechaAlta')
                                       ->selectRaw('COALESCE(DATE_FORMAT(tbldetalleinstalacion.FechaAtendiendo, \'%d-%m-%Y | %I:%i %p\'), NULL) as FechaAtendiendo')
                                       ->selectRaw('COALESCE(DATE_FORMAT(tbldetalleinstalacion.FechaAtencion, \'%d-%m-%Y | %I:%i %p\'), NULL) as FechaAtencion')
                                       ->join('tbldetalleinstalacion', 'tbldetalleinstalacion.FkTblInstalacion', 'tblinstalaciones.PkTblInstalacion')
                                       ->where('tblinstalaciones.PkTblInstalacion', $pkInstalacion);

        return $instalacion->get();
    }

    public function obtenerDetalleInstalacionPorPK ( $pkInstalacion ) {
        $detalleInstalacion = TblDetalleInstalacion::select(
                                                       'FkCatClasificacionInstalacion',
                                                       'FkCatPlanInternet',
                                                       'Disponibilidad',
                                                       'Observaciones',
                                                       'FkTblUsuarioAtendiendo',
                                                       'FechaAtendiendo',
                                                       'FkTblUsuarioAtencion',
                                                       'FechaAtencion'
                                                   )
                                                   ->where('FkTblInstalacion', $pkInstalacion);

        return $detalleInstalacion->get();
    }

    public function modificacionDetalleInstalacion ( $pkInstalacion, $datosInstalacion ) {
        TblDetalleInstalacion::where('PkTblDetalleInstalacion', $pkInstalacion)
                             ->update([
                                'FkCatClasificacionInstalacion' => $datosInstalacion['clasificacionInstalacion'],
                                'FkCatPlanInternet'             => $datosInstalacion['paqueteInstalacion'],
                                'Disponibilidad'                => $this->trimValidator($datosInstalacion['disponibilidadInstalacion']),
                                'Observaciones'                 => $this->trimValidator($datosInstalacion['observacionesInstalacion'])
                             ]);
    }

    public function trimValidator ( $value ) {
		return $value != null && trim($value) != '' ? trim($value) : null;
	}
}