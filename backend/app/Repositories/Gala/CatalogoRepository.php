<?php

namespace App\Repositories\Gala;

use App\Models\CatPoblaciones;
use App\Models\CatRoles;

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

    public function obtenerRoles(){
        $roles = CatRoles::orderBy('PkCatRol', 'asc');

        return $roles->get();
    }
}
