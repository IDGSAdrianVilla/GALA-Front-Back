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
Route::get('/catalogos/obtenerPaquetes', 'App\Http\Controllers\Gala\CatalogoController@obtenerPaquetes');

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

Route::post('/reportes/validarReportePendienteExistente', 'App\Http\Controllers\Gala\ReporteController@validarReportePendienteExistente');
Route::post('/reportes/crearNuevoReporte', 'App\Http\Controllers\Gala\ReporteController@crearNuevoReporte');
Route::get('/reportes/consultarReportesPorStatus/{status}', 'App\Http\Controllers\Gala\ReporteController@consultarReportesPorStatus');
Route::get('/reportes/cargaComponenteModificacionReporte/{pkReporte}', 'App\Http\Controllers\Gala\ReporteController@cargaComponenteModificacionReporte');
Route::post('/reportes/validarReporteProblemaPendienteExistente', 'App\Http\Controllers\Gala\ReporteController@validarReporteProblemaPendienteExistente');
Route::post('/reportes/modificarReporteCliente', 'App\Http\Controllers\Gala\ReporteController@modificarReporteCliente');
Route::get('/reportes/validarComenzarReporteCliente/{pkReporte}', 'App\Http\Controllers\Gala\ReporteController@validarComenzarReporteCliente');
Route::post('/reportes/comenzarReporteCliente', 'App\Http\Controllers\Gala\ReporteController@comenzarReporteCliente');
Route::post('/reportes/validarDejarReporteCliente', 'App\Http\Controllers\Gala\ReporteController@validarDejarReporteCliente');
Route::post('/reportes/dejarReporteCliente', 'App\Http\Controllers\Gala\ReporteController@dejarReporteCliente');
Route::post('/reportes/validarAtenderReporteCliente', 'App\Http\Controllers\Gala\ReporteController@validarAtenderReporteCliente');
Route::post('/reportes/atenderReporteCliente', 'App\Http\Controllers\Gala\ReporteController@atenderReporteCliente');
Route::post('/reportes/validarRetomarReporteCliente', 'App\Http\Controllers\Gala\ReporteController@validarRetomarReporteCliente');
Route::post('/reportes/retomarReporteCliente', 'App\Http\Controllers\Gala\ReporteController@retomarReporteCliente');
Route::post('/reportes/validarEliminarReporteCliente', 'App\Http\Controllers\Gala\ReporteController@validarEliminarReporteCliente');
Route::post('/reportes/eliminarReporteCliente', 'App\Http\Controllers\Gala\ReporteController@eliminarReporteCliente');

Route::post('/instalaciones/registrarNuevaInstalacion', 'App\Http\Controllers\Gala\InstalacionController@registrarNuevaInstalacion');
Route::get('/instalaciones/consultarInstalacionesPorStatus/{status}', 'App\Http\Controllers\Gala\InstalacionController@consultarInstalacionesPorStatus');