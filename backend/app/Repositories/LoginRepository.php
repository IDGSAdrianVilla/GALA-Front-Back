<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Class LoginRepository.
 */
class LoginRepository
{
    /**
     * @return string
     *  Return the model
     */

    public function login ( $correo, $password ){
        $temporal = DB::table('usuarios')
                      ->where([
                        ['correo', $correo],
                        ['contrasena', $password]
                      ]);
        
        return $temporal->count() == 0 ? [] : $temporal->get()->toArray();
    }
}
