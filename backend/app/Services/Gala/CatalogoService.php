<?php

namespace App\Services\Gala;
use App\Repositories\Gala\CatalogoRepository;
use App\Repositories\Gala\UsuarioRepository;
use Illuminate\Support\Facades\DB;

/**
 * Class CatalogoService
 * @package App\Services
 */
class CatalogoService
{
    protected $catalogoRepository;
    protected $usuarioRepository;

    public function __construct(
        CatalogoRepository $CatalogoRepository,
        UsuarioRepository $UsuarioRepository
    )
    {
        $this->catalogoRepository = $CatalogoRepository;
        $this->usuarioRepository  = $UsuarioRepository;
    }

    public function obtenerPoblaciones(){
        $poblaciones = $this->catalogoRepository->obtenerPoblaciones();
        
        return response()->json(
            [
                'data'      => $poblaciones,
                'mensaje'   => 'Se consultaron las poblaciones con éxito'
            ],
            200
        );
    }

    public function obtenerRoles(){
        $roles = $this->catalogoRepository->obtenerRoles();
        return response()->json(
            [
                'data' => $roles
            ],
            200
        );
    }

    public function crearNuevaPoblacion( $datosPoblacion ){
        $validarPoblacion = $this->catalogoRepository->validarPoblacionExistente(
            $datosPoblacion['datosPoblacion']['nombrePoblacion'],
            $datosPoblacion['datosPoblacion']['cpPoblacion']
        );

        if ( $validarPoblacion > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe una Población con información similar. Por favor valida la información',
                    'status' => 409
                ],
                200
            );
        }
    
        DB::beginTransaction();
            $sesion = $this->usuarioRepository->obtenerInformacionPorToken( $datosPoblacion['token'] );
            
            $this->catalogoRepository->crearNuevaPoblacion( $datosPoblacion['datosPoblacion'], $sesion[0]->PkTblUsuario );
        DB::commit();

        return response()->json(
            [
                'poblaciones'   => $this->catalogoRepository->obtenerPoblaciones(),
                'message'       => 'Se registró con éxito la nueva población'
            ],
            200
        );
    }

    public function consultaDatosPoblacionModificacion ( $pkCatPoblacion ) {
        $poblacion = $this->catalogoRepository->consultaDatosPoblacionPorPk($pkCatPoblacion['PkCatPoblacion']);
        
        return response()->json(
            [
                'data' => $poblacion,
                'message' => 'Se consultó la información con éxito'
            ],
            200
        );
    }

    public function modificarPoblacion( $datosPoblacion ){
        $validarPoblacion = $this->catalogoRepository->validarPoblacionExistente(
            $datosPoblacion['datosPoblacion']['nombrePoblacion'],
            $datosPoblacion['datosPoblacion']['cpPoblacion'],
            $datosPoblacion['datosPoblacion']['pkCatPoblacion']
        );

        if ( $validarPoblacion > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe una Población con información similar. Por favor valida la información',
                    'status' => 409
                ],
                200
            );
        }
    
        DB::beginTransaction();
            $this->catalogoRepository->modificarPoblacion( $datosPoblacion['datosPoblacion'] );
        DB::commit();

        return response()->json(
            [
                'poblaciones'   => $this->catalogoRepository->obtenerPoblaciones(),
                'message'       => 'Se modificó con éxito la población'
            ],
            200
        );
    }

    public function crearNuevoProblema ( $datosProblema ) {
        $validarProblema = $this->catalogoRepository->validarProblemaExistente(
            $datosProblema['datosProblema']['tituloProblema']
        );

        if ( $validarProblema > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe un Problema con información similar. Por favor valida la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $sesion = $this->usuarioRepository->obtenerInformacionPorToken( $datosProblema['token'] );

            $this->catalogoRepository->crearNuevoProblema( $datosProblema['datosProblema'], $sesion[0]->PkTblUsuario );
        DB::commit();

        return response()->json(
            [
                'problemas' => $this->catalogoRepository->obtenerProblemas(),
                'message'   => 'Se registró con éxito el nuevo problema'
            ],
            200
        );
    }

    public function obtenerProblemas () {
        $problemas = $this->catalogoRepository->obtenerProblemas();

        return response()->json(
            [
                'data'      => $problemas,
                'mensaje'   => 'Se consultaron los problemas con éxito'
            ],
            200
        );
    }

    public function consultaDatosProblemaModificacion ( $pkCatProblema ) {
        $problema = $this->catalogoRepository->consultaDatosProblemaModificacion( $pkCatProblema );

        return response()->json(
            [
                'data'      => $problema,
                'message'   => 'Se consultó la información con éxito'
            ],
            200
        );
    }

    public function modificarProblema ( $datosProblema ) {
        $validarProblema = $this->catalogoRepository->validarProblemaExistente(
            $datosProblema['datosProblema']['tituloProblema'],
            $datosProblema['datosProblema']['pkCatProblema']
        );

        if ( $validarProblema > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe un Problema con información similar. Por favor valida la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $this->catalogoRepository->modificarProblema( $datosProblema['datosProblema'] );
        DB::commit();

        return response()->json(
            [
                'problemas' => $this->catalogoRepository->obtenerProblemas(),
                'message'   => 'Se modificó con éxito el problema'
            ],
            200
        );
    }
}
