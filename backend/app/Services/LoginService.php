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
        $datos = (array) $this->loginRepository->login( $credenciales['correo'], $credenciales['password'] );

        return response()->json(
            [
                'error' => false,
                'data' => $datos,
                'status' => count($datos) == 0 ? 204 : 200
            ],
            200
        );
    }
}
