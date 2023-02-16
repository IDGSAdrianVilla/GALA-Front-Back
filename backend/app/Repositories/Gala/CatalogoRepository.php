<?php

namespace App\Repositories\Gala;

use App\Models\CatPoblaciones;
//use Your Model

/**
 * Class CatalogoRepository.
 */
class CatalogoRepository
{
    
    public function obtenerPoblaciones(){
        $poblaciones = CatPoblaciones::orderBy('NombrePoblacion', 'asc');

        return $poblaciones->get();
    }
}
