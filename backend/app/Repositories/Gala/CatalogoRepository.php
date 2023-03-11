<?php

namespace App\Repositories\Gala;

use App\Models\CatPoblaciones;
use App\Models\CatProblemasGenericos;
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

    public function obtenerProblemas(){
        $problemas = CatProblemasGenericos::orderBy('TituloProblema', 'asc');

        return $problemas->get();
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
        $registro->NombrePoblacion  = trim($datosPoblacion['nombrePoblacion']);
        $registro->CodigoPostal     = trim($datosPoblacion['cpPoblacion']);
        $registro->Observaciones    = trim($datosPoblacion['observacionesPoblacion']);
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

    public function validarProblemaExistente ( $titulo, $pkProblema = 0 ) {
        $problemaExistente = CatProblemasGenericos::where('TituloProblema', 'like', '%'.$titulo.'%')
                                                  ->where('PkCatProblema', '!=', $pkProblema);

        return $problemaExistente->count();
    }

    public function crearNuevoProblema ( $datosProblema, $pkUsuario ) {
        $registro = new CatProblemasGenericos();
        $registro->TituloProblema      = trim($datosProblema['tituloProblema']);
        $registro->DescripcionProblema = trim($datosProblema['descripcionProblema']);
        $registro->Observaciones       = trim($datosProblema['observacionesProblema']);
        $registro->FkTblUsuarioAlta    = $pkUsuario;
        $registro->FechaAlta           = Carbon::now();
        $registro->Activo              = 1;
        $registro->save();
    }

    public function consultaDatosProblemaModificacion ( $pkCatProblema ) {
        $return = CatProblemasGenericos::where('PkCatProblema', $pkCatProblema);

        return $return->get();
    }

    public function modificarProblema ( $datosModificacion ) {
        CatProblemasGenericos::where('PkCatProblema', $datosModificacion['pkCatProblema'])
                             ->update([
                                'TituloProblema'      => $datosModificacion['tituloProblema'],
                                'DescripcionProblema' => $datosModificacion['descripcionProblema'],
                                'Observaciones'       => $datosModificacion['observacionesProblema']
                             ]);
    }
}
