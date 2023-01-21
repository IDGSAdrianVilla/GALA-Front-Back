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
    public function login ( Request $request ){
        Log::alert("asdasds");
        Log::alert("request", (array) $request->all());
        try{
            return $this->loginService->login( $request->all());
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
