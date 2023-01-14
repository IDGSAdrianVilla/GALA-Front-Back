<?php

namespace App\Services;

use App\Repositories\LoginRepository;

/**
 * Class LoginService
 * @package App\Services
 */
class LoginService
{
    protected $loginRepository;
    
    public function __construct(
        LoginRepository $loginRepository
    )
    {
        $this->loginRepository = $loginRepository;
    }

    public function login(){
        return $this->loginRepository->login();
    }
}
