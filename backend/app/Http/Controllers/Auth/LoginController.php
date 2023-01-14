<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\LoginService;

class LoginController extends Controller
{
    protected $loginService;

    public function __construct(
        LoginService $loginService
    )
    {
        $this->loginService = $loginService;
    }
    public function login (){
       
        try{
            return $this->loginService->login();

        } catch ( \Exception $error ) {
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error al consultar' 
                ],
                500                
            );
        }
    }
}
