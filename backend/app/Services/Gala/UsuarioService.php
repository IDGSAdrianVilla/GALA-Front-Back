<?php

namespace App\Services\Gala;

use App\Repositories\Gala\UsuarioRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Class UsuarioService
 * @package App\Services
 */
class UsuarioService
{
    protected $usuarioRepository;

    public function __construct(
        UsuarioRepository $UsuarioRepository
    )
    {
        $this->usuarioRepository = $UsuarioRepository;   
    } 

    public function obtenerInformacion( $token ){
        return $this->usuarioRepository->obtenerInformacionPorToken( $token['token'] );
    }

    public function crearUsuarioNuevo( $datosUsuario ){
        $sesion = $this->usuarioRepository->obtenerInformacionPorToken( $datosUsuario['token'] );
        
        DB::beginTransaction();
            $pkEmpleado = $this->usuarioRepository->crearEmpleadoNuevo( $datosUsuario['informacionPersonal'], $sesion[0]->PkTblUsuario );
            $this->usuarioRepository->crearUsuarioNuevo( $datosUsuario['credenciales'], $pkEmpleado );
            $this->usuarioRepository->crearDireccionEmpleado( $datosUsuario['direccion'], $pkEmpleado );
        DB::commit();

        return response()->json(
            [
                'message' => 'Se creó con éxito el nuevo usuario'
            ],
            200
        );
    }
}
