import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';
import { UsuariosService } from '../../../../services/usuarios/usuarios.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FuncionesGenericasService } from '../../../../../services/utileria/funciones-genericas.service';
import { CatalogosService } from 'src/app/gala/services/catalogos/catalogos.service';

@Component({
  selector: 'app-usuarios-modificacion',
  templateUrl: './usuarios-modificacion.component.html',
  styleUrls: ['./usuarios-modificacion.component.css']
})
export class UsuariosModificacionComponent implements OnInit{
  public formInformacionRegistro! : FormGroup;
  public formDireccionRegistro! : FormGroup;
  public formPermisosRegistro! : FormGroup;
  
  public poblaciones : any = [];
  public roles : any = [];
  public objetoPermisos : any = [];
  public prevUsuarioNuevo : any = {};
  public datosUsuarioModificacion : any = [];
  public pkusuario : number = 0;

  constructor(
    private fb : FormBuilder,
    private mensajes : MensajesService,
    private catalogosService : CatalogosService,
    private usuariosService : UsuariosService,
    public funcionGenerica : FuncionesGenericasService,
    private rutaActiva : ActivatedRoute,
    private router : Router
  ){

  }

  async ngOnInit(): Promise<void> {
    this.mensajes.mensajeEsperar();
  
    this.crearFormInformacionRegistro();
    this.crearFormDireccionRegistro();
    this.crearFormRolesRegistro();
  
    await Promise.all([this.obtenerPoblaciones(), this.obtenerRoles(), this.consultarDatosUsuarioModificacion()]);
  }
  

  crearFormInformacionRegistro() : void {
    this.formInformacionRegistro = this.fb.group({
      nombreEmpleado          : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      apellidoPaternoEmpleado : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      apellidoMaternoEmpleado : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      sexoEmpleado            : ['', [Validators.required]],
      telefonoEmpleado        : ['', [Validators.required, Validators.pattern('[0-9]*')]],
      fechaNacimientoEmpleado : ['', [Validators.required]],
      observacionesEmpleado   : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
    });
  }
  
  crearFormDireccionRegistro() : void {
    this.formDireccionRegistro = this.fb.group({
      poblacionEmpleado                : ['', [Validators.required]],
      coordenadasEmpleado              : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      calleEmpleado                    : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      referenciasDomicilioEmpleado     : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      caracteristicasDomicilioEmpleado : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
    });
  }

  crearFormRolesRegistro() : void {
    this.formPermisosRegistro = this.fb.group({
      rolEmpleado : ['', [Validators.required]]
    });
  }
  
  obtenerPoblaciones(): Promise<any> {
    return this.catalogosService.obtenerPoblaciones().toPromise().then(
      poblaciones => {
        this.poblaciones = poblaciones.data;
      },
      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }
  
  obtenerRoles(): Promise<any> {
    return this.catalogosService.obtenerRoles().toPromise().then(
      roles => {
        this.roles = roles.data;
      },
      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  asignarPermisosPorRol() : void {
    this.objetoPermisos = this.obtenerPermisosPorRol();
  }

  obtenerPermisosPorRol () : any {
    const rolSeleccionado = this.formPermisosRegistro.get('rolEmpleado')?.value;
    const cadenaObjeto = this.roles.filter( (rol : any) => rol.PkCatRol == rolSeleccionado )[0].ObjetoPermisos;
    return this.funcionGenerica.obtenerObjetoPermisosDesdeCadena( cadenaObjeto );
  }

  consultarDatosUsuarioModificacion() : Promise<any> {
    this.pkusuario = this.rutaActiva.snapshot.params['pkusuario'];
    
    return this.usuariosService.consultarDatosUsuarioModificacion(this.pkusuario).toPromise().then(
      usuarioModificacion =>{
        if(usuarioModificacion.data[0] != undefined){
          this.datosUsuarioModificacion = usuarioModificacion.data[0];
          this.cargarFormulario();
          this.prevNuevoUsuario();
          this.cargarObjetoPermisos();
          this.mensajes.mensajeGenericoToast(usuarioModificacion.message, 'success');
        } else {
          this.router.navigate(['/gala/usuarios']);
        }
      },
      
      error =>{
        this.mensajes.mensajeGenerico('error', 'error');
      }
    )
  }

  cargarFormulario() : void {
    this.formInformacionRegistro.get('nombreEmpleado')?.setValue(this.datosUsuarioModificacion.Nombre);
    this.formInformacionRegistro.get('apellidoPaternoEmpleado')?.setValue(this.datosUsuarioModificacion.ApellidoPaterno);
    this.formInformacionRegistro.get('apellidoMaternoEmpleado')?.setValue(this.datosUsuarioModificacion.ApellidoMaterno);
    this.formInformacionRegistro.get('telefonoEmpleado')?.setValue(this.datosUsuarioModificacion.Telefono);
    this.formInformacionRegistro.get('sexoEmpleado')?.setValue(this.datosUsuarioModificacion.Sexo);
    this.formInformacionRegistro.get('fechaNacimientoEmpleado')?.setValue(this.datosUsuarioModificacion.FechaNacimiento);
    this.formInformacionRegistro.get('observacionesEmpleado')?.setValue(this.datosUsuarioModificacion.Observaciones);
    
    this.formDireccionRegistro.get('poblacionEmpleado')?.setValue(this.datosUsuarioModificacion.PkCatPoblacion);
    this.formDireccionRegistro.get('coordenadasEmpleado')?.setValue(this.datosUsuarioModificacion.Coordenadas);
    this.formDireccionRegistro.get('calleEmpleado')?.setValue(this.datosUsuarioModificacion.Calle);
    this.formDireccionRegistro.get('referenciasDomicilioEmpleado')?.setValue(this.datosUsuarioModificacion.ReferenciasDomicilio);
    this.formDireccionRegistro.get('caracteristicasDomicilioEmpleado')?.setValue(this.datosUsuarioModificacion.CaracteristicasDomicilio);
    this.formPermisosRegistro.get('rolEmpleado')?.setValue(this.datosUsuarioModificacion.PkCatRol);
  }

  cargarObjetoPermisos() : void {
    const cadenaObjeto = this.datosUsuarioModificacion.ObjetoPermisosEspeciales != null ?
                           this.datosUsuarioModificacion.ObjetoPermisosEspeciales :
                           this.datosUsuarioModificacion.ObjetoPermisos;

    this.objetoPermisos = this.funcionGenerica.obtenerObjetoPermisosDesdeCadena( cadenaObjeto );
  }

  actualizarObjetoPermisosPadre( modulo : string, event: Event ) : void {
    const checked = (event?.target as HTMLInputElement)?.checked;
    this.objetoPermisos = this.funcionGenerica.actualizarObjetoPermisosPadre(modulo, checked, this.objetoPermisos);
  }

  actualizarObjetoPermisosHijo( modulo : string, permiso : string, event: Event ) : void {
    const checked = (event?.target as HTMLInputElement)?.checked;
    this.objetoPermisos = this.funcionGenerica.actualizarObjetoPermisosHijo(modulo, permiso, checked, this.objetoPermisos);
  }

  prevNuevoUsuario () {
    this.prevUsuarioNuevo.nombreEmpleado          = this.formInformacionRegistro.get('nombreEmpleado')?.value;
    this.prevUsuarioNuevo.apellidoPaternoEmpleado = this.formInformacionRegistro.get('apellidoPaternoEmpleado')?.value;
    this.prevUsuarioNuevo.apellidoMaternoEmpleado = this.formInformacionRegistro.get('apellidoMaternoEmpleado')?.value;
    this.prevUsuarioNuevo.sexoEmpleado            = this.formInformacionRegistro.get('sexoEmpleado')?.value;
    this.prevUsuarioNuevo.telefonoEmpleado        = this.formInformacionRegistro.get('telefonoEmpleado')?.value;
    const poblacionSelect                         = (document.getElementById('poblacionEmpleado') as HTMLSelectElement).selectedOptions[0].text;
    this.prevUsuarioNuevo.poblacionEmpleado       = poblacionSelect != 'Seleccione una Población' ? poblacionSelect : '';
    const rolSelect                               = (document.getElementById('rolEmpleado') as HTMLSelectElement).selectedOptions[0].text;
    this.prevUsuarioNuevo.rolEmpleado             = rolSelect != 'Seleccione un Rol' ? rolSelect : '';
  }

  actualizarUsuario() : void {
    if(this.formInformacionRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Información Personal.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    if(this.formDireccionRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Dirección Personal.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    if(this.formPermisosRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de los Permisos.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Modificar Usuario').then(
      confirm =>{
        if(confirm.isConfirmed){
          this.mensajes.mensajeEsperar();

          this.formPermisosRegistro.value.objetoPermisos = this.validarPermisosEspeciales();

          let datosModificacionUsuario = {
            'informacionPersonal' : this.formInformacionRegistro.value,
            'direccion' : this.formDireccionRegistro.value,
            'rolPermisos' : this.formPermisosRegistro.value,
            'pkUsuarioModificacion' : this.pkusuario,
            'token' : localStorage.getItem('token')
          };

          this.usuariosService.modificarDatosUsuario(datosModificacionUsuario).subscribe(
            respuesta =>{
              if ( respuesta.status == 409 ) {
                this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                return;
              }

              this.mensajes.mensajeGenerico(respuesta.message, 'success');
              return;
            },

            error =>{
              this.mensajes.mensajeGenerico('error', 'error');
            }
          );
        }
      }
    );
  }

  validarPermisosEspeciales () : any {
    const permisosDefectoRol = this.obtenerPermisosPorRol();
    return JSON.stringify(permisosDefectoRol[0]) == JSON.stringify(this.objetoPermisos[0]) ? null : this.objetoPermisos[0];
  }  
}
