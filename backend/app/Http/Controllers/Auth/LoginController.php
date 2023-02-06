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
        try{
            return $this->loginService->login( $request->all());
        } catch ( \Exception $error ) {
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error al consultar' 
                ],
                500                
            );
        }
    }

    public function auth( Request $request ){
        try{
            return $this->loginService->auth( $request->all());
        } catch ( \Exception $error ) {
            Log::alert($error);
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
