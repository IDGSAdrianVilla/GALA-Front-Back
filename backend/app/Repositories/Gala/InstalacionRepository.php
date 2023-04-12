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

    public function trimValidator ( $value ) {
		return $value != null && trim($value) != '' ? trim($value) : null;
	}
}