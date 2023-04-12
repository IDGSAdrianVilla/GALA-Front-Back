<?php

namespace App\Http\Controllers\Gala;

use App\Http\Controllers\Controller;
use App\Services\Gala\InstalacionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InstalacionController extends Controller
{
    protected $instalacionService;

    public function __construct(
        InstalacionService $InstalacionService
    ) {
        $this->instalacionService = $InstalacionService;
    }

    public function registrarNuevaInstalacion ( Request $request ) {
        try{
            return $this->instalacionService->registrarNuevaInstalacion($request->all());
        } catch( \Exception $error) {
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
