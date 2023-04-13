<?php

namespace App\Repositories\Gala;

use App\Models\TblDetalleInstalaciones;
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
        $registro = new TblDetalleInstalaciones();
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
                                            'tbldetalleinstalaciones.FkTblUsuarioAtendiendo',
                                            'tbldetalleinstalaciones.FkTblUsuarioAtencion',
                                            'catstatus.NombreStatus',
                                            'catstatus.ColorStatus'
                                         )
                                         ->selectRaw('DATE_FORMAT(tblinstalaciones.FechaAlta, \'%d %b %Y\') as FechaAlta')
                                         ->join('tblclientes', 'tblclientes.PkTblCliente', 'tblinstalaciones.FkTblCliente')
                                         ->join('tbldirecciones', 'tbldirecciones.FkTblCliente', 'tblinstalaciones.FkTblCliente')
                                         ->join('tbldetalleinstalaciones', 'tbldetalleinstalaciones.FkTblInstalacion', 'tblinstalaciones.PkTblInstalacion')
                                         ->join('catpoblaciones', 'catpoblaciones.PkCatPoblacion', 'tbldirecciones.FkCatPoblacion')
                                         ->join('catstatus', 'catstatus.PkCatStatus', 'tblinstalaciones.FkCatStatus')
                                         ->orderBy('tblinstalaciones.FechaAlta', 'desc');

        if ( $status != 0 ) {
            $instalaciones->where('catstatus.PkCatStatus', $status);
        }

        return $instalaciones->get();
    }

    public function trimValidator ( $value ) {
		return $value != null && trim($value) != '' ? trim($value) : null;
	}
}