<?php

namespace App\Services\Gala;

use App\Repositories\Gala\UsuarioRepository;

/**
 * Class UsuarioService
 * @package App\Services
 */
class UsuarioService
{
    protected $usuarioRepository;

    public function __construct(
        UsuarioRepository $UsuarioRepository
    )
    {
        $this->usuarioRepository = $UsuarioRepository;   
    } 

    public function obtenerInformacion( $token ){
        return $this->usuarioRepository->obtenerInformacionPorToken( $token['token'] );
    }
}
