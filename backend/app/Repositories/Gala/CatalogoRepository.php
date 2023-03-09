<?php

namespace App\Repositories\Gala;

use App\Models\CatPoblaciones;
use App\Models\CatRoles;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

//use Your Model

/**
 * Class CatalogoRepository.
 */
class CatalogoRepository
{
    
    public function obtenerPoblaciones(){
        $poblaciones = CatPoblaciones::orderBy('NombrePoblacion', 'asc');

        return $poblaciones->get();
    }

    public function obtenerRoles(){
        $roles = CatRoles::join('tblpermisos', 'tblpermisos.FkCatRol', 'catroles.PkCatRol')
                         ->orderBy('catroles.PkCatRol', 'desc');

        return $roles->get();
    }

    public function validarPoblacionExistente ( $nombrePoblacion, $cpPoblacion, $pkPoblacion = 0 ) {
        $poblacionExistente = CatPoblaciones::where(function ( $condiciones ) use ( $nombrePoblacion, $cpPoblacion ) {
                                                $condiciones->where('NombrePoblacion', 'like', '%'.$nombrePoblacion.'%')
                                                            ->orWhere('CodigoPostal', 'like', '%'.$cpPoblacion.'%');
                                              })
                                            ->where('PkCatPoblacion', '!=', $pkPoblacion);
        
        return $poblacionExistente->count();
    }

    public function crearNuevaPoblacion ( $datosPoblacion, $pkUsuario ) {
        $registro = new CatPoblaciones();
        $registro->NombrePoblacion  = $datosPoblacion['nombrePoblacion'];
        $registro->CodigoPostal     = $datosPoblacion['cpPoblacion'];
        $registro->Observaciones    = $datosPoblacion['observacionesPoblacion'];
        $registro->FkTblUsuarioAlta = $pkUsuario;
        $registro->FechaAlta        = Carbon::now();
        $registro->Activo           = 1;
        $registro->save();
    }

    public function consultaDatosPoblacionPorPk ( $pkPoblacion ) {
        $return = CatPoblaciones::where('PkCatPoblacion', $pkPoblacion);

        return $return->get();
    }

    public function modificarPoblacion ( $datosModificacion ) {
        CatPoblaciones::where('PkCatPoblacion', $datosModificacion['pkCatPoblacion'])
                      ->update([
                        'NombrePoblacion' => $datosModificacion['nombrePoblacion'],
                        'CodigoPostal'    => $datosModificacion['cpPoblacion'],
                        'Observaciones'   => $datosModificacion['observacionesPoblacion']
                      ]);
    }
}
