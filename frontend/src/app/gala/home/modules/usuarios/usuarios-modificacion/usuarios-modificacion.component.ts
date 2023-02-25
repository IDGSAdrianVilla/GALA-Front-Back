import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';
import { UsuariosService } from '../../../../services/usuarios/usuarios.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FuncionesGenericasService } from '../../../../../services/utileria/funciones-genericas.service';

@Component({
  selector: 'app-usuarios-modificacion',
  templateUrl: './usuarios-modificacion.component.html',
  styleUrls: ['./usuarios-modificacion.component.css']
})
export class UsuariosModificacionComponent implements OnInit{
    
  private pkusuario : any;
  private datosUsuarioModificacion : any;

  public formInformacionRegistro! : FormGroup;
  public formDireccionRegistro! : FormGroup;
  public formCredencialesRegistro! : FormGroup;
  public formPermisosRegistro! : FormGroup;
  public prevUsuarioNuevo : any = {};
  public poblaciones : any = [];
  public roles : any = [];
  public objetoPermisos : any = [
    {
      'tituloRol' : 'Super Administrador',
      'rol' : 'superAdministrador',
      'permisosRol' : [
        {
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
    private mensajes : MensajesService,
    private rutaActiva : ActivatedRoute,
    private usuariosService : UsuariosService,
    private fb : FormBuilder,
    public funcionGenerica : FuncionesGenericasService
  ){
    
  }

  ngOnInit(): void {
    this.consultaDatosModificacion();
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
    });
  }

  crearFormRolesRegistro() : void {
    this.formPermisosRegistro = this.fb.group({
      rolEmpleado : ['',[Validators.required]]
    });
  }

  crearFormCredencialesRegistro() : void {
    this.formCredencialesRegistro = this.fb.group({
      correoEmpleado : ['',[Validators.required]],
      passwordEmpleado : ['emenetSistemas2021',[Validators.required]],
      valPasswordMaterno : ['emenetSistemas2021',[Validators.required]]
    });
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
  
  prevNuevoUsuario () {
    this.prevUsuarioNuevo.nombreEmpleado          = this.formInformacionRegistro.get('nombreEmpleado')?.value;
    this.prevUsuarioNuevo.apellidoPaternoEmpleado = this.formInformacionRegistro.get('apellidoPaternoEmpleado')?.value;
    this.prevUsuarioNuevo.apellidoMaternoEmpleado = this.formInformacionRegistro.get('apellidoMaternoEmpleado')?.value;
    this.prevUsuarioNuevo.sexoEmpleado            = this.formInformacionRegistro.get('sexoEmpleado')?.value;
    this.prevUsuarioNuevo.telefonoEmpleado        = this.formInformacionRegistro.get('telefonoEmpleado')?.value;
    const poblacionSelect                         = document.getElementById('poblacionEmpleado') as HTMLSelectElement;
    const poblacionSelectedOption                 = poblacionSelect.selectedOptions[0];
    const poblacionSelectedText                   = poblacionSelectedOption.text;
    this.prevUsuarioNuevo.poblacionEmpleado       = poblacionSelectedText != 'Seleccione una población' ? poblacionSelectedText : '';
  }
  
  consultaDatosModificacion() : void {
    this.mensajes.mensajeEsperar();
    this.pkusuario = this.rutaActiva.snapshot.params['pkusuario'];
    this.usuariosService.consultaDatosModificacion(this.pkusuario).subscribe(
      usuarioModificacion =>{
        this.datosUsuarioModificacion = usuarioModificacion.data[0];
        this.mensajes.mensajeGenerico('Se consultó con éxito la información','success');
      },
      
      error =>{
        this.mensajes.mensajeGenerico('error', 'error');
      }
    )
  }
}
