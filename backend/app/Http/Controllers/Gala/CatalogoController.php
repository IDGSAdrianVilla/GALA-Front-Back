<?php

namespace App\Http\Controllers\Gala;

use App\Http\Controllers\Controller;
use App\Services\Gala\CatalogoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CatalogoController extends Controller
{
    protected $catalogoService;

    public function __construct(
        CatalogoService $CatalogoService
    )
    {
        $this->catalogoService = $CatalogoService;
    }

    public function obtenerPoblaciones(){
        try{
            return $this->catalogoService->obtenerPoblaciones();
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
