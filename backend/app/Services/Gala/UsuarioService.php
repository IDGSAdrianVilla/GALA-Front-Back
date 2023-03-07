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
        $validarUsuario = $this->usuarioRepository->validarUsuarioExistente(
            $datosUsuario['informacionPersonal']['telefonoEmpleado'],
            $datosUsuario['credenciales']['correoEmpleado']
        );

        if ( $validarUsuario > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe un Usuario con información similar. Por favor valida la información',
                    'status' => 409
                ],
                200
            );
        }
    
        DB::beginTransaction();
            $sesion = $this->usuarioRepository->obtenerInformacionPorToken( $datosUsuario['token'] );
            $pkEmpleado = $this->usuarioRepository->crearEmpleadoNuevo( $datosUsuario['informacionPersonal'] );
            
            $this->usuarioRepository->crearUsuarioNuevo( $datosUsuario['credenciales'], $datosUsuario['rolPermisos'], $pkEmpleado, $sesion[0]->PkTblUsuario );
            $this->usuarioRepository->crearDireccionEmpleado( $datosUsuario['direccion'], $pkEmpleado );
        DB::commit();

        return response()->json(
            [
                'message' => 'Se creó con éxito el nuevo usuario'
            ],
            200
        );
    }

    public function consultaUsuariosPorRoles( $data ){
        $sesion = $this->usuarioRepository->obtenerInformacionPorToken( $data['token'] );

        $usuariosPorRoles = $this->usuarioRepository->consultaUsuariosPorRoles( $data['roles'], $sesion[0]->PkTblUsuario );

        return response()->json(
            [
                'message' => count($usuariosPorRoles) > 0 ? 'Se consultaron con éxito los datos' : 'No se encontraron Usuarios con los filtros seleccionados',
                'data' => $usuariosPorRoles,
                'status' => count($usuariosPorRoles) > 0 ? 200 : 204
            ], 
            200
        );
    }

    public function consultarDatosUsuarioModificacion( $pkusuario ){
        $usuarioModificar = $this->usuarioRepository->consultarDatosUsuarioModificacion( $pkusuario );
        return response()->json(
            [
                'message' => 'Se encontró con éxito la información',
                'data' => $usuarioModificar
            ]
        );
    }

    public function modificarDatosUsuario( $datosModificacion ){
        $validarUsuario = $this->usuarioRepository->validarUsuarioPorTelefono(
            $datosModificacion['informacionPersonal']['telefonoEmpleado'],
            $datosModificacion['pkUsuarioModificacion']
        );
        
        if ( $validarUsuario > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe un registro con información similar. Por favor valida la información',
                    'status' => 409
                ],
                200
            );
        }
        //crearEmpleadoNuevo
        //crearUsuarioNuevo
        //crearDireccionEmpleado
        DB::beginTransaction();
            $pkEmpleado = $this->usuarioRepository->obtenerPkEmpleado( $datosModificacion['pkUsuarioModificacion'] );
            $this->usuarioRepository->modificarDatosEmpleado( $pkEmpleado, $datosModificacion['informacionPersonal'] );
            $this->usuarioRepository->modificarDatosUsuario( $datosModificacion['pkUsuarioModificacion'], $datosModificacion['rolPermisos'] );
            $this->usuarioRepository->modificarDatosDireccion( $datosModificacion['direccion'], $pkEmpleado);
        DB::commit();
        
        return response()->json(
            [
                'message' => 'Se modificó con éxito el usuario'
            ]
        );
    }
}
