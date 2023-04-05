<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', 'App\Http\Controllers\Auth\LoginController@login');
Route::post('/auth', 'App\Http\Controllers\Auth\LoginController@auth');
Route::post('/logout', 'App\Http\Controllers\Auth\LoginController@logout');

Route::post('/usuarios/obtenerInformacion', 'App\Http\Controllers\Gala\UsuarioController@obtenerInformacion');
Route::post('/usuarios/crearUsuarioNuevo', 'App\Http\Controllers\Gala\UsuarioController@crearUsuarioNuevo');
Route::post('/usuarios/consultaUsuariosPorRoles', 'App\Http\Controllers\Gala\UsuarioController@consultaUsuariosPorRoles');
Route::post('/usuarios/consultarDatosUsuarioModificacion', 'App\Http\Controllers\Gala\UsuarioController@consultarDatosUsuarioModificacion');
Route::post('/usuarios/modificarDatosUsuario', 'App\Http\Controllers\Gala\UsuarioController@modificarDatosUsuario');
Route::post('/usuarios/consultarDatosUsuarioPerfil', 'App\Http\Controllers\Gala\UsuarioController@consultarDatosUsuarioPerfil');
Route::post('/usuarios/modificarInformacionPerfil', 'App\Http\Controllers\Gala\UsuarioController@modificarInformacionPerfil');

Route::post('/clientes/crearNuevoCliente', 'App\Http\Controllers\Gala\ClienteController@crearNuevoCliente');
Route::get('/clientes/consultarClientes','App\Http\Controllers\Gala\ClienteController@consultarClientes');
Route::post('/clientes/consultarDatosClienteModificacion','App\Http\Controllers\Gala\ClienteController@consultarDatosClienteModificacion');
Route::post('/clientes/modificarDatosCliente','App\Http\Controllers\Gala\ClienteController@modificarDatosCliente');

Route::get('/catalogos/obtenerPoblaciones', 'App\Http\Controllers\Gala\CatalogoController@obtenerPoblaciones');
Route::get('/catalogos/obtenerRoles', 'App\Http\Controllers\Gala\CatalogoController@obtenerRoles');
Route::get('/catalogos/obtenerProblemas', 'App\Http\Controllers\Gala\CatalogoController@obtenerProblemas');
Route::get('/catalogos/obtenerTipoInstalaciones', 'App\Http\Controllers\Gala\CatalogoController@obtenerTipoInstalaciones');

Route::post('/catalogos/poblaciones/crearNuevaPoblacion', 'App\Http\Controllers\Gala\CatalogoController@crearNuevaPoblacion');
Route::post('/catalogos/poblaciones/consultaDatosPoblacionModificacion', 'App\Http\Controllers\Gala\CatalogoController@consultaDatosPoblacionModificacion');
Route::post('/catalogos/poblaciones/modificarPoblacion', 'App\Http\Controllers\Gala\CatalogoController@modificarPoblacion');

Route::post('/catalogos/problemas/crearNuevoProblema', 'App\Http\Controllers\Gala\CatalogoController@crearNuevoProblema');
Route::post('/catalogos/problemas/consultaDatosProblemaModificacion', 'App\Http\Controllers\Gala\CatalogoController@consultaDatosProblemaModificacion');
Route::post('/catalogos/problemas/modificarProblema', 'App\Http\Controllers\Gala\CatalogoController@modificarProblema');

Route::post('/catalogos/tipoInstalaciones/crearNuevoTipoInstalacion', 'App\Http\Controllers\Gala\CatalogoController@crearNuevoTipoInstalacion');
Route::post('/catalogos/tipoInstalaciones/consultaDatosTipoInstalacionModificacion', 'App\Http\Controllers\Gala\CatalogoController@consultaDatosTipoInstalacionModificacion');
Route::post('/catalogos/tipoInstalaciones/modificarTipoInstalacion', 'App\Http\Controllers\Gala\CatalogoController@modificarTipoInstalacion');

Route::post('/catalogos/roles/crearRegistroRol', 'App\Http\Controllers\Gala\CatalogoController@crearRegistroRol');
Route::post('/catalogos/roles/consultaDatosRolModificacion', 'App\Http\Controllers\Gala\CatalogoController@consultaDatosRolModificacion');
Route::post('/catalogos/roles/validaRolExistente', 'App\Http\Controllers\Gala\CatalogoController@validaRolExistente');
Route::post('/catalogos/roles/modificarRol', 'App\Http\Controllers\Gala\CatalogoController@modificarRol');