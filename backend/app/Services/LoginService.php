<?php

namespace App\Services;

use App\Repositories\LoginRepository;
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
        $token = $this->loginRepository->login( $credenciales['correo'], $credenciales['password'] );
        return response()->json(
            [
                'data' => $token,
                'status' => $token == null ? 204 : 200
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
