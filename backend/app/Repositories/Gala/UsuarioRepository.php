<?php

namespace App\Repositories\Gala;

use App\Models\TblSesiones;

//use Your Model

/**
 * Class UsuarioRepository.
 */
class UsuarioRepository 
{
    /**
     * @return string
     *  Return the model
     */

    public function obtenerInformacionPorToken( $token ){
        $return = TblSesiones::select(
                                'tblusuarios.PkTblUsuario',
	                            'tblusuarios.Correo',
	                            'tblusuarios.Password',
	                            'tblusuarios.ObjetoPermisosEspeciales', 
	                            'tblempleados.PkTblEmpleado',
	                            'tblempleados.NombreEmpleado',
	                            'tblempleados.ApellidoPaterno',
	                            'tblempleados.ApellidoMaterno',
	                            'tblempleados.Sexo',
	                            'tblempleados.Telefono',
	                            'tbldirecciones.PkTblDireccion',
	                            'tbldirecciones.Calle',
	                            'tbldirecciones.Coordenadas',
	                            'tbldirecciones.ReferenciasDomicilio',
	                            'tbldirecciones.CaracteristicasDomicilio',
	                            'tbldirecciones.Calle',
	                            'catpoblaciones.PkCatPoblacion',
	                            'catpoblaciones.NombrePoblacion',
	                            'catpoblaciones.CodigoPostal',
	                            'catroles.PkCatRol',
	                            'catroles.NombreRol',
	                            'catroles.DescripcionRol'
                             )
                             ->join('tblusuarios', 'tblusuarios.PkTblUsuario', '=', 'tblsesiones.FkTblUsuario')
                             ->join('tblempleados', 'tblempleados.PkTblEmpleado', '=', 'tblusuarios.FkTblEmpleado')
                             ->leftJoin('tbldirecciones','tbldirecciones.FkTblEmpleado', '=', 'tblempleados.PkTblEmpleado')
                             ->leftJoin('catpoblaciones', 'catpoblaciones.PkCatPoblacion', '=', 'tbldirecciones.FkCatPoblacion')
                             ->join('catroles', 'catroles.PkCatRol', '=', 'tblusuarios.FkCatRol')
                             ->leftJoin('tblpermisos', 'tblpermisos.FkCatRol', '=', 'catroles.PkCatRol')
                             ->where('tblsesiones.Token', '=', $token);

        return $return->get();
    } 
}
