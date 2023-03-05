<?php

namespace App\Services;

use App\Repositories\LoginRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Class LoginService
 * @package App\Services
 */
class LoginService
{
    protected $loginRepository;
    
    public function __construct(
        LoginRepository $loginRepository
    )
    {
        $this->loginRepository = $loginRepository;
    }

    public function login( $credenciales ){
        $pkUsuario = $this->loginRepository->validarExistenciaUsuario( $credenciales['correo'], $credenciales['password'] );

        if( !is_null($pkUsuario) ){

            if ( !$this->loginRepository->validarUsuarioActivo( $pkUsuario ) ) {
                return response()->json(
                    [
                        'mensaje' => 'Upss! Al parecer tu cuenta esta actualmente supendida',
                        'status' => 409
                    ],
                    200
                );
            }

            DB::beginTransaction();
                $this->loginRepository->depurarSesionPorPK( $pkUsuario );
                $token = $this->loginRepository->crearSesionYAsignarToken( $pkUsuario );
            DB::commit();
            
            return response()->json(
                [
                    'data' => $token,
                    'status' => 200
                ],
                200
            );
        }

        return response()->json(
            [
                'mensaje' => 'Upss! Al parecer las credenciales no son correctas para poder ingresar',
                'status' => 204
            ],
            200
        );
    }

    public function auth( $token ){
        return $this->loginRepository->auth($token['token']);
    }

    public function logout( $token ){
        return $this->loginRepository->logout($token['token']);
    }
}
