import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private catalogosService : CatalogosService
  ){

  }

  ngOnInit(): void {
    this.mensajes.mensajeEsperar();
    this.crearFormInformacionRegistro();
    this.crearFormDireccionRegistro();
    this.obtenerPoblaciones();
  }

  crearFormInformacionRegistro() : void {
    this.formInformacionRegistro = this.fb.group({
      nombreEmpleado : ['',[Validators.required]],
      apellidoPaternoEmpleado : ['',[Validators.required]],
      apellidoMaterno : ['',[]],
      sexoEmpleado : ['',[Validators.required]],
      fechaNacimientoEmpleado : ['',[Validators.required]],
      observaciones : ['',[]]
    });
  }

  
  crearFormDireccionRegistro() : void {
    this.formDireccionRegistro = this.fb.group({
      poblacionEmpleado : ['',[Validators.required]],
      coordenadasEmpleado : ['',[Validators.required]],
      calleEmpleado : ['',[Validators.required]]
    })
  }
  
  obtenerPoblaciones() : void {
    this.catalogosService.obtenerPoblaciones().subscribe(
      poblaciones => {
        this.poblaciones = poblaciones.data;
        this.mensajes.cerrarMensajes();
      },
      error => {
        this.mensajes.mensajeGenerico('Al parecer ocurrió un error interno, por favor contactarse con el DTIC de Emenet Sistemas', 'error');
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

  funcionPrueba() : void {
    this.mensajes.mensajeEsperar();
    if(this.formDireccionRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta. \n Los campos requeridos están marcados con un *', 'info');
      return;
    }
  }
}
