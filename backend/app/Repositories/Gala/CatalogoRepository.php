<?php

namespace App\Repositories\Gala;

use App\Models\CatClasificacionInstalaciones;
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
                        'NombrePoblacion' => trim($datosModificacion['nombrePoblacion']),
                        'CodigoPostal'    => trim($datosModificacion['cpPoblacion']),
                        'Observaciones'   => trim($datosModificacion['observacionesPoblacion'])
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
                                'TituloProblema'      => trim($datosModificacion['tituloProblema']),
                                'DescripcionProblema' => trim($datosModificacion['descripcionProblema']),
                                'Observaciones'       => trim($datosModificacion['observacionesProblema'])
                             ]);
    }

    public function validarTipoInstalacionExistente( $titulo, $pkTipoInstalacion = 0 ) {
        $tipoInstalacionExistente = CatClasificacionInstalaciones::where('NombreClasificacion', 'like', '%'.$titulo.'%')
                                                                 ->where('PkCatClasificacionInstalacion', '!=', $pkTipoInstalacion);

        return $tipoInstalacionExistente->count();
    }

    public function obtenerTipoInstalaciones(){
        $tipoInstalaciones = CatClasificacionInstalaciones::orderBy('NombreClasificacion', 'asc');

        return $tipoInstalaciones->get();
    }

    public function crearNuevoTipoInstalacion( $datosTipoInstalacion, $pkUsuario){
        $registro = new CatClasificacionInstalaciones();
        $registro->NombreClasificacion      = trim($datosTipoInstalacion['nombreClasificacion']);
        $registro->Descripcion              = trim($datosTipoInstalacion['descripcionClasificacion']);
        $registro->Observaciones            = trim($datosTipoInstalacion['observacionesClasificacion']);
        $registro->FkTblUsuario             = $pkUsuario;
        $registro->FechaAlta                = Carbon::now();
        $registro->Activo                   = 1;
        $registro->save();
    }

    public function consultaDatosTipoInstalacionModificacion( $pkCatClasificacionInstalacion ){
        $return = CatClasificacionInstalaciones::where('PkCatClasificacionInstalacion', $pkCatClasificacionInstalacion);

        return $return->get();
    }

    public function modificarTipoInstalacion( $datosModificacion ){
        CatClasificacionInstalaciones::where('PkCatClasificacionInstalacion', $datosModificacion['pkCatClasificacionInstalacion'])
                                     ->update([
                                        'NombreClasificacion' => trim($datosModificacion['nombreClasificacion']),  
                                        'Descripcion'         => trim($datosModificacion['descripcionClasificacion']),
                                        'Observaciones'       => trim($datosModificacion['observacionesClasificacion'])
                                    ]);
    }
}