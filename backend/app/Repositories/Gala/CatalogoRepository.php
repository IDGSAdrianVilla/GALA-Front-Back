<?php

namespace App\Repositories\Gala;

use App\Models\CatClasificacionInstalaciones;
use App\Models\CatPaquetes;
use App\Models\CatPoblaciones;
use App\Models\CatProblemasGenericos;
use App\Models\CatRoles;
use App\Models\TblPermisos;
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
                         ->orderBy('catroles.NombreRol', 'asc');

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
        $registro->NombrePoblacion  = $this->trimValidator($datosPoblacion['nombrePoblacion']);
        $registro->CodigoPostal     = $this->trimValidator($datosPoblacion['cpPoblacion']);
        $registro->Observaciones    = $this->trimValidator($datosPoblacion['observacionesPoblacion']);
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
                        'NombrePoblacion' => $this->trimValidator($datosModificacion['nombrePoblacion']),
                        'CodigoPostal'    => $this->trimValidator($datosModificacion['cpPoblacion']),
                        'Observaciones'   => $this->trimValidator($datosModificacion['observacionesPoblacion'])
                      ]);
    }

    public function validarProblemaExistente ( $titulo, $pkProblema = 0 ) {
        $problemaExistente = CatProblemasGenericos::where('TituloProblema', 'like', '%'.$titulo.'%')
                                                  ->where('PkCatProblema', '!=', $pkProblema);

        return $problemaExistente->count();
    }

    public function crearNuevoProblema ( $datosProblema, $pkUsuario ) {
        $registro = new CatProblemasGenericos();
        $registro->TituloProblema      = $this->trimValidator($datosProblema['tituloProblema']);
        $registro->DescripcionProblema = $this->trimValidator($datosProblema['descripcionProblema']);
        $registro->Observaciones       = $this->trimValidator($datosProblema['observacionesProblema']);
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
                                'TituloProblema'      => $this->trimValidator($datosModificacion['tituloProblema']),
                                'DescripcionProblema' => $this->trimValidator($datosModificacion['descripcionProblema']),
                                'Observaciones'       => $this->trimValidator($datosModificacion['observacionesProblema'])
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
        $registro->NombreClasificacion      = $this->trimValidator($datosTipoInstalacion['nombreClasificacion']);
        $registro->Descripcion              = $this->trimValidator($datosTipoInstalacion['descripcionClasificacion']);
        $registro->Observaciones            = $this->trimValidator($datosTipoInstalacion['observacionesClasificacion']);
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
                                        'NombreClasificacion' => $this->trimValidator($datosModificacion['nombreClasificacion']),  
                                        'Descripcion'         => $this->trimValidator($datosModificacion['descripcionClasificacion']),
                                        'Observaciones'       => $this->trimValidator($datosModificacion['observacionesClasificacion'])
                                    ]);
    }

    public function validarRolExistente ( $nombre, $pkRol = 0 ) {
        $rolExistente = CatRoles::where('NombreRol', 'like', '%'.$nombre.'%')
                                     ->where('PkCatRol', '!=', $pkRol);

        return $rolExistente->count();
    }

    public function validarPermisosExistentes ( $objetoPermisos, $pkRol = 0 ) {
        if ( !is_null($objetoPermisos) ) {
			$reemplazos = array(
				'\u00e1' => 'á',
				'\u00e9' => 'é',
				'\u00f3' => 'ó',
				'\u00fa' => 'ú'
			);
			
			$nuevaCadenaPermisos = json_encode($objetoPermisos['permisosRol']);
			$objetoPermisos = str_replace(array_keys($reemplazos), array_values($reemplazos), $nuevaCadenaPermisos);
		}

        $permisosExistentes = TblPermisos::where('ObjetoPermisos', 'like', '%'.$objetoPermisos.'%')
                                         ->where('FkCatRol', '!=', $pkRol);

        return $permisosExistentes->count();
    }

    public function crearNuevoRol ( $informacionRol, $pkUsuario ) {
        $registro = new CatRoles();
		$registro->NombreRol 	     = $this->trimValidator($informacionRol['nombreRol']);
		$registro->DescripcionRol 	 = $this->trimValidator($informacionRol['descripcionRol']);
        $registro->Observaciones 	 = $this->trimValidator($informacionRol['observacionesRol']);
		$registro->FkTblUsuariosAlta = $pkUsuario;
		$registro->FechaAlta 	     = Carbon::now();
		$registro->Activo 		     = 1;
		$registro->save();

		return $registro->PkCatRol;
    }

    public function crearNuevoPremiso ( $objetoPermisos, $pkCatRol ) {
        if ( !is_null($objetoPermisos) ) {
			$reemplazos = array(
				'\u00e1' => 'á',
				'\u00e9' => 'é',
				'\u00f3' => 'ó',
				'\u00fa' => 'ú'
			);
			
			$nuevaCadenaPermisos = json_encode($objetoPermisos);
			$nuevaCadenaPermisos = str_replace(array_keys($reemplazos), array_values($reemplazos), $nuevaCadenaPermisos);
			$objetoPermisos = '['.$nuevaCadenaPermisos.']';
		}

        $registro = new TblPermisos();
        $registro->FkCatRol       = $pkCatRol;
        $registro->ObjetoPermisos = $objetoPermisos;
        $registro->save();
    }

    public function consultaDatosRolModificacion ( $pkCatRol ) {
        $roles = CatRoles::join('tblpermisos', 'tblpermisos.FkCatRol', 'catroles.PkCatRol')
                         ->where('catroles.PkCatRol', $pkCatRol)
                         ->orderBy('catroles.PkCatRol', 'desc');

        return $roles->get();
    }

    public function modificarRol ( $datosRol ) {
        CatRoles::where('PkCatRol', $datosRol['pkCatRol'])
                ->update([
                    'NombreRol'      => $datosRol['nombreRol'],
                    'DescripcionRol' => $datosRol['descripcionRol'],
                    'Observaciones'  => $datosRol['observacionesRol']
                ]);
    }

    public function modificarPermisos ( $objetoPermisos, $pkCatRol ) {
        if ( !is_null($objetoPermisos) ) {
			$reemplazos = array(
				'\u00e1' => 'á',
				'\u00e9' => 'é',
				'\u00f3' => 'ó',
				'\u00fa' => 'ú'
			);
			
			$nuevaCadenaPermisos = json_encode($objetoPermisos);
			$nuevaCadenaPermisos = str_replace(array_keys($reemplazos), array_values($reemplazos), $nuevaCadenaPermisos);
			$objetoPermisos = '['.$nuevaCadenaPermisos.']';
		}

        TblPermisos::where('FkCatRol', $pkCatRol)
                   ->update([
                        'ObjetoPermisos' => $objetoPermisos
                   ]);
    }

    public function obtenerPaquetes () {
        $return = CatPaquetes::orderBy('Cantidad', 'asc');

        return $return->get();
    }

    public function trimValidator ( $value ) {
		return $value != null && trim($value) != '' ? trim($value) : null;
	}
}