import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/gala/services/usuarios/usuarios.service';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';
import { CatalogosService } from '../../../../services/catalogos/catalogos.service';
import { FuncionesGenericasService } from '../../../../../services/utileria/funciones-genericas.service';

@Component({
  selector: 'app-usuarios-registro',
  templateUrl: './usuarios-registro.component.html',
  styleUrls: ['./usuarios-registro.component.css']
})
export class UsuariosRegistroComponent implements OnInit {

  public formInformacionRegistro! : FormGroup;
  public formDireccionRegistro! : FormGroup;
  public formCredencialesRegistro! : FormGroup;
  public formPermisosRegistro! : FormGroup;
  public poblaciones : any = [];
  public roles : any = [];
  public objetoPermisos : any = [];
  public prevUsuarioNuevo : any = {};

  constructor(
    private fb : FormBuilder,
    private mensajes : MensajesService,
    private catalogosService : CatalogosService,
    private usuariosService : UsuariosService,
    public funcionGenerica : FuncionesGenericasService
  ){

  }

  ngOnInit(): void {
    this.mensajes.mensajeEsperar();

    this.crearFormInformacionRegistro();
    this.crearFormDireccionRegistro();
    this.crearFormRolesRegistro();
    this.crearFormCredencialesRegistro();

    this.obtenerPoblaciones();
    this.obtenerRoles();
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

  crearFormCredencialesRegistro() : void {
    this.formCredencialesRegistro = this.fb.group({
      correoEmpleado     : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*'), Validators.email]],
      passwordEmpleado   : ['emenetSistemas2021', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      valPasswordMaterno : ['emenetSistemas2021', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
    });
  }
  
  obtenerPoblaciones() : void {
    this.catalogosService.obtenerPoblaciones().subscribe(
      poblaciones => {
        this.poblaciones = poblaciones.data;
        this.mensajes.cerrarMensajes();
      },
      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }
  
  obtenerRoles() : void {
    this.catalogosService.obtenerRoles().subscribe(
      roles => {
        this.roles = roles.data;
        this.mensajes.cerrarMensajes();
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
    return JSON.parse( this.roles.filter( (rol : any) => rol.PkCatRol == rolSeleccionado )[0].ObjetoPermisos.replace(/'/g, '"') );
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

  crearNuevoUsuario() : void {
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

    if(this.formCredencialesRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de las Credenciales.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Crear Nuevo Usuario').then(
      confirm =>{
        if(confirm.isConfirmed){
          this.mensajes.mensajeEsperar();

          this.formPermisosRegistro.value.objetoPermisos = this.validarPermisosEspeciales();

          let datosNuevoUsuario = {
            'informacionPersonal' : this.formInformacionRegistro.value,
            'direccion' : this.formDireccionRegistro.value,
            'rolPermisos' : this.formPermisosRegistro.value,
            'credenciales' : this.formCredencialesRegistro.value,
            'token' : localStorage.getItem('token')
          };

          this.usuariosService.crearNuevoUsuario(datosNuevoUsuario).subscribe(
            respuesta =>{
              if ( respuesta.status != 409 ) {
                this.mensajes.mensajeGenerico(respuesta.message, 'success');
                return;
              }

              this.mensajes.mensajeGenerico(respuesta.message, 'warning');
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
