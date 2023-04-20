<?php

namespace App\Services\Gala;

use App\Repositories\Gala\UsuarioRepository;
use App\Repositories\LoginRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Class UsuarioService
 * @package App\Services
 */
class UsuarioService
{
    protected $usuarioRepository;
    protected $loginRepository;

    public function __construct(
        UsuarioRepository $UsuarioRepository,
        LoginRepository   $LoginRepository
    )
    {
        $this->usuarioRepository = $UsuarioRepository;   
        $this->loginRepository = $LoginRepository;   
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
                'message' => 'Se registró con éxito el nuevo usuario'
            ],
            200
        );
    }

    public function consultaUsuarios( $data ){
        $sesion   = $this->usuarioRepository->obtenerInformacionPorToken( $data['token'] );
        $usuarios = $this->usuarioRepository->consultaUsuarios( $sesion[0]->PkTblUsuario );

        return response()->json(
            [
                'message' => 'Se consultaron los usuarios con éxito',
                'data' => $usuarios
            ], 
            200
        );
    }

    public function consultarDatosUsuarioModificacion( $pkusuario ){
        $usuarioModificar = $this->usuarioRepository->consultarDatosUsuarioModificacion( $pkusuario );
        return response()->json(
            [
                'message' => 'Se consultó la información con éxito',
                'data' => $usuarioModificar
            ]
        );
    }

    public function modificarDatosUsuario( $datosUsuario ){
        $validarUsuario = $this->usuarioRepository->validarUsuarioPorTelefono(
            $datosUsuario['informacionPersonal']['telefonoEmpleado'],
            $datosUsuario['pkUsuarioModificacion']
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
        
        DB::beginTransaction();
            $pkEmpleado = $this->usuarioRepository->obtenerPkEmpleado( $datosUsuario['pkUsuarioModificacion'] );
            $this->usuarioRepository->modificarDatosEmpleado( $pkEmpleado, $datosUsuario['informacionPersonal'] );
            $this->usuarioRepository->modificarDatosUsuario( $datosUsuario['pkUsuarioModificacion'], $datosUsuario['rolPermisos'] );
            $this->usuarioRepository->modificarDatosDireccion( $datosUsuario['direccion'], $pkEmpleado);
        DB::commit();
        
        return response()->json(
            [
                'message' => 'Se modificó el usuario con éxito'
            ],
            200
        );
    }

    public function consultarDatosUsuarioPerfil( $pkperfil ){
        $usuarioModificarPerfil = $this->usuarioRepository->consultarDatosUsuarioModificacionPerfil( $pkperfil );
        return response()->json(
            [
                'message' => 'Se consultó la información con éxito',
                'data' => $usuarioModificarPerfil
            ]
        );
    }

    public function modificarInformacionPerfil($datosUsuarioPerfil){
        $sesion = $this->usuarioRepository->obtenerInformacionPorToken( $datosUsuarioPerfil['sesionActiva'] );
        $validarUsuario = $this->usuarioRepository->validarUsuarioModificacionExistente(
            $datosUsuarioPerfil['informacionPerfil']['telefonoPerfil'],
            $datosUsuarioPerfil['informacionCredenciales']['correoPerfil'],
            $sesion[0]->PkTblUsuario
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

        $validarCredenciales = $this->loginRepository->validarExistenciaUsuario(
            $datosUsuarioPerfil['informacionCredenciales']['correoOriginal'],
            $datosUsuarioPerfil['informacionCredenciales']['contraseniaAntigua'] ?? null
        );

        if( $datosUsuarioPerfil['informacionCredenciales']['cambioContraseniaPerfil'] && is_null($validarCredenciales) ){
            return response()->json(
                [
                    'message' => 'Upss! Al parecer la contraseña es incorrecta. Por favor valida la información',
                    'status' => 204
                ],
                200
            );
        }

        DB::beginTransaction();
            $pkEmpleado = $this->usuarioRepository->obtenerPkEmpleado($sesion[0]->PkTblUsuario);
            $this->usuarioRepository->modificarDatosEmpleado($pkEmpleado, $datosUsuarioPerfil['informacionPerfil']);
            if( $datosUsuarioPerfil['informacionCredenciales']['cambioContraseniaPerfil'] && is_null($validarCredenciales) ){
                $this->usuarioRepository->modificarDatosUsuarioPerfil($pkEmpleado, $datosUsuarioPerfil['informacionCredenciales']);
            }
            $this->usuarioRepository->modificarDatosDireccion($datosUsuarioPerfil['informacionDireccion'], $pkEmpleado);
        DB::commit();

        return response()->json(
            [
                'message' => 'Se modificó el perfil con éxito'
            ],
            200
        );
    }
}
