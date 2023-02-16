<?php

namespace App\Services\Gala;
use App\Repositories\Gala\CatalogoRepository;
/**
 * Class CatalogoService
 * @package App\Services
 */
class CatalogoService
{
    protected $catalogoRepository;

    public function __construct(
        CatalogoRepository $CatalogoRepository
    )
    {
        $this->catalogoRepository = $CatalogoRepository;
    }

    public function obtenerPoblaciones(){
        $poblaciones = $this->catalogoRepository->obtenerPoblaciones();
        return response()->json(
            [
                'data' => $poblaciones
            ],
            200
        );
    }
}
