import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/gala/services/usuarios/usuarios.service';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';
import { CatalogosService } from '../../../../services/catalogos/catalogos.service';

@Component({
  selector: 'app-usuarios-registro',
  templateUrl: './usuarios-registro.component.html',
  styleUrls: ['./usuarios-registro.component.css']
})
export class UsuariosRegistroComponent implements OnInit {

  public formInformacionRegistro! : FormGroup;
  public formDireccionRegistro! : FormGroup;
  public formCredencialesRegistro! : FormGroup;
  public poblaciones : any = [];
  public objetoPermisos : any = [
    {
      'tituloRol' : 'Super Administrador',
      'rol' : 'superAdministrador',
      'permisosRol' : [
        {
          'nombreModulo' : 'Empleados',
          'modulo' : 'empleados',
          'status' : true,
          'permisosModulo' : [
            {
              'nombre' : 'Lectura',
              'permiso' : 'lectura',
              'status' : true,
              'disabled' : true
            },{
              'nombre' : 'Escritura',
              'permiso' : 'escritura',
              'status' : true,
              'disabled' : false
            },{
              'nombre' : 'Modificación',
              'permiso' : 'modificacion',
              'status' : true,
              'disabled' : false
            }
          ]
        },{
          'nombreModulo' : 'Usuarios',
          'modulo' : 'usuarios',
          'status' : true,
          'permisosModulo' : [
            {
              'nombre' : 'Lectura',
              'permiso' : 'lectura',
              'status' : true,
              'disabled' : true
            },{
              'nombre' : 'Escritura',
              'permiso' : 'escritura',
              'status' : true,
              'disabled' : false
            },{
              'nombre' : 'Modificación',
              'permiso' : 'modificacion',
              'status' : true,
              'disabled' : false
            },{
              'nombre' : 'Permisos',
              'permiso' : 'permisos',
              'status' : true,
              'disabled' : false
            }
          ]
        },{
          'nombreModulo' : 'Reportes',
          'modulo' : 'reportes',
          'status' : true,
          'permisosModulo' : [
            {
              'nombre' : 'Lectura',
              'permiso' : 'lectura',
              'status' : true,
              'disabled' : true
            },{
              'nombre' : 'Escritura',
              'permiso' : 'escritura',
              'status' : true,
              'disabled' : false
            },{
              'nombre' : 'Modificación',
              'permiso' : 'modificacion',
              'status' : true,
              'disabled' : false
            },{
              'nombre' : 'Eliminación',
              'permiso' : 'eliminacion',
              'status' : true,
              'disabled' : false
            }
          ]
        },{
          'nombreModulo' : 'Instalaciones',
          'modulo' : 'instalaciones',
          'status' : true,
          'permisosModulo' : [
            {
              'nombre' : 'Lectura',
              'permiso' : 'lectura',
              'status' : true,
              'disabled' : true
            },{
              'nombre' : 'Escritura',
              'permiso' : 'escritura',
              'status' : true,
              'disabled' : false
            },{
              'nombre' : 'Modificación',
              'permiso' : 'modificacion',
              'status' : true,
              'disabled' : false
            },{
              'nombre' : 'Eliminación',
              'permiso' : 'eliminacion',
              'status' : true,
              'disabled' : false
            }
          ]
        },{
          'nombreModulo' : 'Clientes',
          'modulo' : 'clientes',
          'status' : true,
          'permisosModulo' : [
            {
              'nombre' : 'Lectura',
              'permiso' : 'lectura',
              'status' : true,
              'disabled' : true
            },{
              'nombre' : 'Escritura',
              'permiso' : 'escritura',
              'status' : true,
              'disabled' : false
            },{
              'nombre' : 'Modificación',
              'permiso' : 'modificacion',
              'status' : true,
              'disabled' : false
            }
          ]
        },
        {
          'nombreModulo' : 'Sesiones',
          'modulo' : 'sesiones',
          'status' : true,
          'permisosModulo' : [
            {
              'nombre' : 'Lectura',
              'permiso' : 'lectura',
              'status' : true,
              'disabled' : true
            },{
              'nombre' : 'Suspensión',
              'permiso' : 'suspencion',
              'status' : true,
              'disabled' : false
            }
          ]
        },{
          'nombreModulo' : 'Catálogos',
          'modulo' : 'catalogos',
          'status' : true,
          'permisosModulo' : [
            {
              'nombre' : 'Lectura',
              'permiso' : 'lectura',
              'status' : true,
              'disabled' : true
            },{
              'nombre' : 'Escritura',
              'permiso' : 'escritura',
              'status' : true,
              'disabled' : false
            },{
              'nombre' : 'Modificación',
              'permiso' : 'modificacion',
              'status' : true,
              'disabled' : false
            }
          ]
        }
      ]
    }
  ];

  constructor(
    private fb : FormBuilder,
    private mensajes : MensajesService,
    private catalogosService : CatalogosService,
    private usuariosService : UsuariosService
  ){

  }

  ngOnInit(): void {
    this.mensajes.mensajeEsperar();
    this.crearFormInformacionRegistro();
    this.crearFormDireccionRegistro();
    this.crearFormCredenciales();
    this.obtenerPoblaciones();
  }

  crearFormInformacionRegistro() : void {
    this.formInformacionRegistro = this.fb.group({
      nombreEmpleado : ['',[Validators.required]],
      apellidoPaternoEmpleado : ['',[Validators.required]],
      apellidoMaternoEmpleado : ['',[]],
      sexoEmpleado : ['',[Validators.required]],
      telefonoEmpleado : ['',[Validators.required]],
      fechaNacimientoEmpleado : ['',[Validators.required]],
      observacionesEmpleado : ['',[]]
    });
  }
  
  crearFormDireccionRegistro() : void {
    this.formDireccionRegistro = this.fb.group({
      poblacionEmpleado : ['',[Validators.required]],
      coordenadasEmpleado : ['',[Validators.required]],
      calleEmpleado : ['',[Validators.required]],
      referenciasDomicilioEmpleado : ['',[Validators.required]],
      caracteristicasDomicilioEmpleado : ['',[Validators.required]]
    })
  }

  crearFormCredenciales() : void {
    this.formCredencialesRegistro = this.fb.group({
      correoEmpleado : ['',[Validators.required]],
      passwordEmpleado : ['emenetSistemas2021',[Validators.required]],
      valPasswordMaterno : ['emenetSistemas2021',[Validators.required]]
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
  
  actualizoPadre (event: Event) {
    const id = (event?.target as HTMLInputElement)?.id;
    const checked = (event?.target as HTMLInputElement)?.checked;

    const modulo = id.split("-")[1];

    if ( checked ) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"].permiso-'+modulo);
      for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i] as HTMLInputElement;
        checkbox.checked = true;
      }
    } else {
      const checkboxes = document.querySelectorAll('input[type="checkbox"].permiso-'+modulo);
      for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i] as HTMLInputElement;
        checkbox.checked = false;
      }
    }
  }

  actualizoHijo (event: Event) {
    const clase = (event?.target as HTMLInputElement)?.classList.item(1)?.toString();
    const checked = (event?.target as HTMLInputElement)?.checked;

    const modulo = clase?.split("-")[1];

    if ( checked ) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"].permiso-'+modulo);
      let count = 0;
      
      for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i] as HTMLInputElement;
        count = checkbox.checked ? count + 1 : count ;
      }

      if ( count != 0 ) {
        const checkbox = document.getElementById('modulo-'+modulo) as HTMLInputElement;
        checkbox.checked = true;
        const checkboxHijo = document.getElementById('permiso-'+modulo+'-lectura') as HTMLInputElement;
        checkboxHijo.checked = true;
      }
    }
  }

  crearNuevoUusario() : void {
    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos','question','Crear Nuevo Usuario').then(
      confirm =>{
        if(confirm.isConfirmed){
          let datosNuevoUsuario = {
            'informacionPersonal' : this.formInformacionRegistro.value,
            'direccion' : this.formDireccionRegistro.value,
            'credenciales' : this.formCredencialesRegistro.value,
            'token' : localStorage.getItem('token')
          };

          this.usuariosService.crearNuevoUsuario(datosNuevoUsuario).subscribe(
            respuesta =>{
              this.mensajes.mensajeGenerico('Se guardó con éxito la información','success');
            },

            error =>{
              this.mensajes.mensajeGenerico('error','error');
            }
          );
        }
      }
    );

    /*if(this.formInformacionRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Información Personal.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    if(this.formDireccionRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Dirección Personal.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    if(this.formCredencialesRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de las Credenciales.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }*/
  }
}
