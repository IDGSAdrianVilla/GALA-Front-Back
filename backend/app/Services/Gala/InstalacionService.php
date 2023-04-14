<?php

namespace App\Services\Gala;

use App\Repositories\gala\ClienteRepository;
use App\Repositories\Gala\InstalacionRepository;
use App\Repositories\Gala\UsuarioRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InstalacionService
{
    protected $instalacionRepository;
    protected $clienteRepository;
    protected $usuarioRepository;

    public function __construct(
        InstalacionRepository $InstalacionRepository,
        ClienteRepository $ClienteRepository,
        UsuarioRepository $UsuarioRepository
    ) {
        $this->instalacionRepository = $InstalacionRepository;
        $this->clienteRepository = $ClienteRepository;
        $this->usuarioRepository = $UsuarioRepository;
    }

    public function registrarNuevaInstalacion ( $datosNuevaInstalacion ) {
        $validarCliente = $this->clienteRepository->validarClienteExistentePorNombre('instalacion', $datosNuevaInstalacion['direccionPersonal']['poblacionCliente'], $datosNuevaInstalacion['informacionPersonal'] );

        if( $validarCliente > 0 ){
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe una Instalación para un Cliente con el mismo nombre y población. Por favor valida la información',
                    'status' => 409
                ],
                200
            );
        }

        $validarTelefono = $this->clienteRepository->validarClienteExistentePorTelefono('instalacion', $datosNuevaInstalacion['informacionPersonal']['telefonoCliente']);

        if( $validarTelefono > 0 ){
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe una Instalación para un Cliente con el mismo número de teléfono. Por favor valida la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $sesion = $this->usuarioRepository->obtenerInformacionPorToken( $datosNuevaInstalacion['token'] );
            $pkCliente = $this->clienteRepository->crearNuevoCliente( $datosNuevaInstalacion['informacionPersonal'], $sesion[0]->PkTblUsuario );
            $this->clienteRepository->crearDireccionCliente( $datosNuevaInstalacion['direccionPersonal'], $pkCliente);
            $pkInstalacion = $this->instalacionRepository->registrarNuevaInstalcion( $pkCliente, $sesion[0]->PkTblUsuario );
            $this->instalacionRepository->registroDetalleNuevaInstalacion( $datosNuevaInstalacion['instalacion'], $pkInstalacion );
        DB::commit();

        return response()->json(
            [
                'message' => 'Se registró la nueva instalación con éxito'
            ],
            200
        );
    }

    public function consultarInstalacionesPorStatus ( $status ) {
        $instalaciones = $this->instalacionRepository->consultarInstalacionesPorStatus( $status );

        return response()->json(
            [
                'instalaciones'  => $instalaciones,
                'message'   => 'Se consultarón las instalaciones con éxito'
            ],
            200
        );
    }

    public function cargaComponenteModificacionInstalacion ( $pkInstalacion ) {
        $dataInstalacion = [];
        $dataInstalacion['datosInstalacion'] = $this->instalacionRepository->consultarDatosInstalacionModificacionPorPK( $pkInstalacion );
        
        if ( count($dataInstalacion['datosInstalacion']) == 0 ) {
            return response()->json(
                [
                    'message'   => 'No se ha encontrado registro de la información proporcionada',
                    'status'    => 204
                ],
                200
            );
        }

        $dataInstalacion['datosDetalleInstalacion'] = $this->instalacionRepository->obtenerDetalleInstalacionPorPK( $dataInstalacion['datosInstalacion'][0]->PkTblInstalacion );
        $dataInstalacion['datosUsuarioAtencion']    = $this->usuarioRepository->obternerUsuarioPorPK( $dataInstalacion['datosDetalleInstalacion'][0]->FkTblUsuarioAtencion );
        $dataInstalacion['datosUsuarioAtendiendo']  = $this->usuarioRepository->obternerUsuarioPorPK( $dataInstalacion['datosDetalleInstalacion'][0]->FkTblUsuarioAtendiendo );
        $dataInstalacion['datosCliente']            = $this->clienteRepository->obtenerClientePorPK( $dataInstalacion['datosInstalacion'][0]->FkTblCliente );
        $dataInstalacion['datosUsuarioRecibio']     = $this->usuarioRepository->obternerUsuarioPorPK( $dataInstalacion['datosInstalacion'][0]->FkTblUsuarioRecibio );

        return response()->json(
            [
                'data'  => $dataInstalacion,
                'message'   => 'Se consultarón los datos con éxito'
            ],
            200
        );
    }

    public function validarModificarInstalacion ( $datosInstalacionModificada ) {
        $validarCliente = $this->clienteRepository->validarClienteExistentePorNombre('instalacion', $datosInstalacionModificada['direccionPersonal']['poblacionCliente'], $datosInstalacionModificada['informacionPersonal'], $datosInstalacionModificada['informacionPersonal']['pkCliente'] );

        if( $validarCliente > 0 ){
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe una Instalación para un Cliente el mismo nombre y población. Por favor valida la información',
                    'status' => 409
                ],
                200
            );
        }

        $validarTelefono = $this->clienteRepository->validarClienteExistentePorTelefono('instalacion', $datosInstalacionModificada['informacionPersonal']['telefonoCliente'], $datosInstalacionModificada['informacionPersonal']['pkCliente']);

        if( $validarTelefono > 0 ){
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe una Instalación para un Cliente con el mismo número de teléfono. Por favor valida la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $pkCliente = $datosInstalacionModificada['informacionPersonal']['pkCliente'];
            $this->clienteRepository->modificarDatosCliente( $pkCliente, $datosInstalacionModificada['informacionPersonal'] );
            $this->clienteRepository->modificarDatosDireccion( $pkCliente, $datosInstalacionModificada['direccionPersonal'] );
            $this->instalacionRepository->modificacionDetalleInstalacion( $datosInstalacionModificada['datosInstalacion']['pkInstalacion'], $datosInstalacionModificada['datosInstalacion'] );
        DB::commit();

        return response()->json(
            [
                'message' => 'Se modificó la instalación con éxito'
            ],
            200
        );
    }

    public function validarComenzarInstalacion ( $pkInstalacion ) {
        $instalacionExistente = $this->instalacionRepository->validarInstalacionExistente( $pkInstalacion );

        if ( count($instalacionExistente) == 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer la instalación ya no existe',
                    'status' => 304
                ],
                200
            );
        }

        $validarInstalacion = $this->instalacionRepository->validarInstalacionComenzada( $pkInstalacion );

        if ( $validarInstalacion > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer esta instalación está siendo atendida por alguien más',
                    'status' => 304
                ],
                200
            );
        }

        return response()->json(
            [
                'message' => 'La instalación se puede atender con éxito'
            ],
            200
        );
    }

    public function comenzarInstalacion ( $datosComenzarInstalacion ) {
        DB::beginTransaction();
            $usuario = $this->usuarioRepository->obtenerInformacionPorToken( $datosComenzarInstalacion['token'] );
            $this->instalacionRepository->comenzarInstalacion( $datosComenzarInstalacion['pkInstalacion'], $usuario[0]->PkTblUsuario );
        DB::commit();

        return response()->json(
            [
                'message' => 'Se comenzó atender la instalación con éxito'
            ],
            200
        );
    }

    public function validarDejarInstalacion ( $datosDejarInstalacion ) {
        $instalacionExistente = $this->instalacionRepository->validarInstalacionExistente( $datosDejarInstalacion['pkInstalacion'] );

        if ( count($instalacionExistente) == 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer la instalación ya no existe',
                    'status' => 304
                ],
                200
            );
        }

        $validaReporte = $this->instalacionRepository->validarInstalacionSinComenzar( $datosDejarInstalacion['pkInstalacion'] );

        if ( $validaReporte > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer la instalación no esta siendo atendida por nadie actualmente',
                    'status' => 304
                ],
                200
            );
        }

        $usuario = $this->usuarioRepository->obtenerInformacionPorToken( $datosDejarInstalacion['token'] );
        $validaReportePorUsuario = $this->instalacionRepository->validarInstalacionStatusPorUsuario( $datosDejarInstalacion['pkInstalacion'], $usuario[0]->PkTblUsuario );

        if ( $validaReportePorUsuario > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer esta instalación está siendo atendida por alguien más',
                    'status' => 304
                ],
                200
            );
        }

        return response()->json(
            [
                'message' => 'La instalación se puede dejar de atender con éxito'
            ],
            200
        );
    }

    public function dejarInstalacion ( $datosDejarInstalacion ) {
        DB::beginTransaction();
            $usuario = $this->usuarioRepository->obtenerInformacionPorToken( $datosDejarInstalacion['token'] );
            $this->instalacionRepository->dejarInstalacionEnCurso( $datosDejarInstalacion['pkInstalacion'], $usuario[0]->PkTblUsuario );
        DB::commit();

        return response()->json(
            [
                'message' => 'Se dejó de atender la instalación con éxito'
            ],
            200
        );
    }

    public function validarConcluirInstalacion ( $datosInstalacionModificada ) {
        $instalacionExistente = $this->instalacionRepository->validarInstalacionExistente($datosInstalacionModificada['datosInstalacion']['pkInstalacion']);

        if ( count($instalacionExistente) == 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer la instalación ya no existe',
                    'status' => 304
                ],
                200
            );
        }

        $usuario = $this->usuarioRepository->obtenerInformacionPorToken( $datosInstalacionModificada['token'] );
        $validaReportePorUsuario = $this->instalacionRepository->validarInstalacionStatusPorUsuario( $datosInstalacionModificada['datosInstalacion']['pkInstalacion'], $usuario[0]->PkTblUsuario );

        if ( $validaReportePorUsuario > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer la instalación está siendo atendido por alguien más',
                    'status' => 304
                ],
                200
            );
        }

        $validaReporteAtendido = $this->instalacionRepository->validarInstalacionAtendidoPorUsuario( $datosInstalacionModificada['datosInstalacion']['pkInstalacion'] );

        if ( $validaReporteAtendido > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer la instalación ya fue concluida',
                    'status' => 304
                ],
                200
            );
        }

        $validarCliente = $this->clienteRepository->validarClienteExistentePorNombre('cliente', $datosInstalacionModificada['direccionPersonal']['poblacionCliente'], $datosInstalacionModificada['informacionPersonal'], $datosInstalacionModificada['informacionPersonal']['pkCliente'] );

        if( $validarCliente > 0 ){
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe un Cliente con el mismo nombre y población. No es posible concluir la instalación. Por favor valida la información',
                    'status' => 304
                ],
                200
            );
        }

        $validarTelefono = $this->clienteRepository->validarClienteExistentePorTelefono('cliente', $datosInstalacionModificada['informacionPersonal']['telefonoCliente'], $datosInstalacionModificada['informacionPersonal']['pkCliente']);

        if( $validarTelefono > 0 ){
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe un Cliente con el mismo número de teléfono. No es posible concluir la instalación. Por favor valida la información',
                    'status' => 304
                ],
                200
            );
        }

        return response()->json(
            [
                'message' => 'La instalación se puede concluir con éxito'
            ],
            200
        );
    }

    public function concluirInstalacion ( $datosInstalacionModificada ) {
        DB::beginTransaction();
            $pkCliente = $datosInstalacionModificada['informacionPersonal']['pkCliente'];
            $usuario = $this->usuarioRepository->obtenerInformacionPorToken( $datosInstalacionModificada['token'] );
            if ( !isset($datosInstalacionModificada['grid']) ) {
                $this->clienteRepository->modificarDatosCliente( $pkCliente, $datosInstalacionModificada['informacionPersonal'], 1 );
                $this->clienteRepository->modificarDatosDireccion( $pkCliente, $datosInstalacionModificada['direccionPersonal'] );
                $this->instalacionRepository->modificacionDetalleInstalacion( $datosInstalacionModificada['datosInstalacion']['pkInstalacion'], $datosInstalacionModificada['datosInstalacion'] );
            }
            $this->instalacionRepository->concluirInstalacion( $datosInstalacionModificada['datosInstalacion']['pkInstalacion'], $usuario[0]->PkTblUsuario, $pkCliente );
        DB::commit();

        return response()->json(
            [
                'message' => 'Se concluyó la instalación con éxito'
            ],
            200
        );
    }

    public function validarRetomarInstalacion ( $datosInstalacionModificada ) {
        $instalacionExistente = $this->instalacionRepository->validarInstalacionExistente($datosInstalacionModificada['datosInstalacion']['pkInstalacion']);

        if ( count($instalacionExistente) == 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer la instalación ya no existe',
                    'status' => 304
                ],
                200
            );
        }

        $validaInstalacion = $this->instalacionRepository->validarInstalacionSinAtender( $datosInstalacionModificada['datosInstalacion']['pkInstalacion'] );

        if ( $validaInstalacion > 0 ) {
            return response()->json(
                [
                    'message' => 'Upss! Al parecer la instalación no ha sido concluida',
                    'status' => 304
                ],
                200
            );
        }

        $validarCliente = $this->clienteRepository->validarClienteExistentePorNombre('instalacion', $datosInstalacionModificada['direccionPersonal']['poblacionCliente'], $datosInstalacionModificada['informacionPersonal'], $datosInstalacionModificada['informacionPersonal']['pkCliente'] );

        if( $validarCliente > 0 ){
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe una Instalación para un Cliente el mismo nombre y población. Por favor valida la información',
                    'status' => 409
                ],
                200
            );
        }

        $validarTelefono = $this->clienteRepository->validarClienteExistentePorTelefono('instalacion', $datosInstalacionModificada['informacionPersonal']['telefonoCliente'], $datosInstalacionModificada['informacionPersonal']['pkCliente']);

        if( $validarTelefono > 0 ){
            return response()->json(
                [
                    'message' => 'Upss! Al parecer ya existe una Instalación para un Cliente con el mismo número de teléfono. Por favor valida la información',
                    'status' => 409
                ],
                200
            );
        }

        return response()->json(
            [
                'message' => 'La instalación se puede retomar con éxito'
            ],
            200
        );
    }

    public function retomarInstalacion ( $datosInstalacionModificada ) {
        DB::beginTransaction();
            $pkCliente = $datosInstalacionModificada['informacionPersonal']['pkCliente'];
            if ( !isset($datosInstalacionModificada['grid']) ) {
                $this->clienteRepository->modificarDatosCliente( $pkCliente, $datosInstalacionModificada['informacionPersonal'], 1 );
                $this->clienteRepository->modificarDatosDireccion( $pkCliente, $datosInstalacionModificada['direccionPersonal'] );
                $this->instalacionRepository->modificacionDetalleInstalacion( $datosInstalacionModificada['datosInstalacion']['pkInstalacion'], $datosInstalacionModificada['datosInstalacion'] );
            }
            $this->instalacionRepository->retomarInstalacion( $datosInstalacionModificada['datosInstalacion']['pkInstalacion'], $pkCliente );
        DB::commit();

        return response()->json(
            [
                'message' => 'Se retomó la instalación con éxito'
            ],
            200
        );
    }
}