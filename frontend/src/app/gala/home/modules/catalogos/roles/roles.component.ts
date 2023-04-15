import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/gala/services/catalogos/catalogos.service';
import { DataService } from 'src/app/gala/services/data.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import { FuncionesGenericasService } from 'src/app/services/utileria/funciones-genericas.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  @ViewChild('cerrarModal') cerrarModal? : ElementRef;
  @ViewChildren('checkboxes') checkboxes?: QueryList<any>;

  public formNuevoRol! : FormGroup;

  public objetoPermisos : any = [
    {
      'tituloRol' : null,
      'rol' : null,
      'permisosRol' : []
    }
  ];

  public busqueda: string = '';
  public datosRoles : any[] = [];
  public rolesFiltrados : any[] = [];
  public modificacionRol : boolean = false;
  public datosRolModificacion : any = [];

  constructor (
    private fb : FormBuilder,
    public funcionGenerica : FuncionesGenericasService,
    private mensajes : MensajesService,
    private catalogoService : CatalogosService,
    public dataService : DataService
  ) {

  }

  ngOnInit (): void {
    this.crearFormularioRoles();
    this.consultaRoles();
  }

  crearFormularioRoles () : void {
    this.formNuevoRol = this.fb.group({
      pkCatRol         : [],
      nombreRol        : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      descripcionRol   : ['', Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')],
      observacionesRol : ['', Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]
    });
  }

  consultaRoles () : void {
    this.mensajes.mensajeEsperar();
    this.catalogoService.obtenerRoles().subscribe(
      respuesta => {
        this.datosRoles = respuesta.data;
        this.rolesFiltrados = this.datosRoles;
        this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  actualizarObjetoPermisosPadre( modulo : string, event: Event ) : void {
    const checked = (event?.target as HTMLInputElement)?.checked;
    this.objetoPermisos = this.funcionGenerica.actualizarObjetoPermisosPadre(modulo, checked, this.objetoPermisos);
  }

  actualizarObjetoPermisosHijo( modulo : string, permiso : string, event: Event ) : void {
    const checked = (event?.target as HTMLInputElement)?.checked;
    this.objetoPermisos = this.funcionGenerica.actualizarObjetoPermisosHijo(modulo, permiso, checked, this.objetoPermisos);
  }

  cambioObjetoPermisos ( modulo : string, event: Event ) : void {
    const checked = (event?.target as HTMLInputElement)?.checked;

    if ( checked ) {
      switch ( modulo ) {
        case 'clientes':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioClientes);
        break;
        case 'usuarios':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioUsuarios);
        break;
        case 'reportes':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioReportes);
        break;
        case 'instalaciones':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioInstalaciones);
        break;
        case 'catalogos':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioCatalogos);
        break;
        case 'asignacionTareas':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioAsignacionTareas);
        break;
        case 'acciones':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioAcciones);
        break;
        case 'sesiones':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioSesiones);
        break;
        case 'reportesSistema':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioReportesSistema);
        break;
      }
    } else {
      const indexAEliminar = this.objetoPermisos[0].permisosRol.findIndex((permiso : any) => permiso.modulo === modulo);

      indexAEliminar !== -1 ? this.objetoPermisos[0].permisosRol.splice(indexAEliminar, 1) : false;
    }
  }

  validarRegistroRol () : void {
    if ( this.formNuevoRol.invalid ) {
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    if ( this.objetoPermisos[0].permisosRol.length == 0 ) {
      this.mensajes.mensajeGenerico('Para continuar antes debes asignar como mínimo un módulo al nuevo Rol.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Crear Nuevo Rol').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          this.prepararObjetoPermisos();

          let dataRegistro = {
            'datosRol' : this.formNuevoRol.value,
            'token'    : localStorage.getItem('token'),
            'type'     : 'registro'
          };

          this.catalogoService.validaRolExistente( dataRegistro ).subscribe(
            respuesta => {
              if ( respuesta.status == 409 ) {
                this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                return;
              }
              
              if ( respuesta.status == 300 ) {
                this.mensajes.mensajeConfirmacionCustom(respuesta.message, 'warning', respuesta.pregunta).then(
                  respuestaMensajeConsulta => {
                    if ( respuestaMensajeConsulta.isConfirmed ) {
                      this.mensajes.mensajeEsperar();
                      this.crearRegistroRol( dataRegistro );
                    } else {
                      this.mensajes.cerrarMensajes();
                      return;
                    }
                  }
                );
                return;
              }

              this.crearRegistroRol( dataRegistro );
            },

            error => {
              this.mensajes.mensajeGenerico('error', 'error');
            }
          );
        }
      }
    );
  }

  private crearRegistroRol ( dataRegistro : any ) : void {
    this.catalogoService.crearRegistroRol( dataRegistro ).subscribe(
      respuesta => {
        this.limpiarFormulario();
        this.datosRoles = respuesta.roles;
        this.rolesFiltrados = this.datosRoles;
        this.cerrarModal?.nativeElement.click();
        this.mensajes.mensajeGenerico(respuesta.message, 'success');
        return;
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  private prepararObjetoPermisos () : void {
    const nombreFront = this.formNuevoRol.get('nombreRol')?.value;
    this.objetoPermisos[0].tituloRol       = nombreFront;
    this.objetoPermisos[0].rol             = this.convertirACamelCase(nombreFront);
    this.formNuevoRol.value.objetoPermisos = this.objetoPermisos[0];
  }

  private convertirACamelCase(cadena: string): string {
    return cadena.toLowerCase().replace(/\s+/g, '_').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  consultaDatosRolModificacion ( PkCatRol : number ) : void {
    this.mensajes.mensajeEsperar();
    this.modificacionRol = true;

    this.catalogoService.consultaDatosRolModificacion(PkCatRol).subscribe(
      respuesta => {
        this.datosRolModificacion = respuesta.data[0];
        this.cargarFormulario();
        this.cargarObjetoPermisos();
        this.mensajes.mensajeGenericoToast(respuesta.message, 'success');
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  validarModificarRol () : void {
    if ( this.formNuevoRol.invalid ) {
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    if ( this.objetoPermisos[0].permisosRol.length == 0 ) {
      this.mensajes.mensajeGenerico('Para continuar antes debes asignar como mínimo un módulo al nuevo Rol.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Modificar Usuario').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          this.prepararObjetoPermisos();

          let dataModificacion = {
            'datosRol' : this.formNuevoRol.value,
            'token'    : localStorage.getItem('token'),
            'type'     : 'modificacion'
          };

          this.catalogoService.validaRolExistente( dataModificacion ).subscribe(
            respuesta => {
              if ( respuesta.status == 409 ) {
                this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                return;
              }
              
              if ( respuesta.status == 300 ) {
                this.mensajes.mensajeConfirmacionCustom(respuesta.message, 'warning', respuesta.pregunta).then(
                  respuestaMensajeConsulta => {
                    if ( respuestaMensajeConsulta.isConfirmed ) {
                      this.mensajes.mensajeEsperar();
                      this.modificarRol( dataModificacion );
                    } else {
                      this.mensajes.cerrarMensajes();
                      return;
                    }
                  }
                );
                return;
              }

              this.modificarRol( dataModificacion );
            },

            error => {
              this.mensajes.mensajeGenerico('error', 'error');
            }
          );
        }
      }
    );
  }

  private modificarRol( dataModificacion : any ) : void {
    this.catalogoService.modificarRol( dataModificacion ).subscribe(
      respuesta => {
        this.datosRoles = respuesta.problemas;
        this.rolesFiltrados = this.datosRoles;
        this.cerrarModal?.nativeElement.click();
        this.mensajes.mensajeGenerico(respuesta.message, 'success');
        return;
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  cargarFormulario () : void {
    this.formNuevoRol.get('pkCatRol')?.setValue(this.datosRolModificacion.PkCatRol);
    this.formNuevoRol.get('nombreRol')?.setValue(this.datosRolModificacion.NombreRol);
    this.formNuevoRol.get('descripcionRol')?.setValue(this.datosRolModificacion.DescripcionRol);
    this.formNuevoRol.get('observacionesRol')?.setValue(this.datosRolModificacion.Observaciones);
  }

  cargarObjetoPermisos () : void {
    this.objetoPermisos = this.funcionGenerica.obtenerObjetoPermisosDesdeCadena( this.datosRolModificacion.ObjetoPermisos );
    this.cargarObjetoModulos();
  }

  cargarObjetoModulos () : void {
    const modulos = this.objetoPermisos[0].permisosRol.map((permiso : any) => permiso.modulo);

    this.dataService.objModulos.forEach(modulo => {
      if (modulos.includes(modulo.etiquetaModulo)) {
        modulo.status = true;
      }
    });
  }

  limpiarFormulario () : void {
    this.modificacionRol = false;
    this.formNuevoRol.reset();
    this.limpiarChecksYObjetoModulos();
    this.limpiarObjetoPermisosYSwitches();
  }

  private limpiarChecksYObjetoModulos () : void {
    this.dataService.objModulos = this.dataService.objModulos.map((objeto) => {
      objeto.status = false;
      return objeto;
    });

    this.checkboxes?.forEach((checkbox) => {
      checkbox.nativeElement.checked = false;
    });
  }

  private limpiarObjetoPermisosYSwitches () : void {
    this.objetoPermisos.forEach((item : any) => {
      item.permisosRol.forEach((permisos : any) => {
        permisos.permisosModulo.forEach((permiso : any) => {
          permiso.status = false;
        });
        permisos.status = false;
      });
    });    

    this.objetoPermisos = [
      {
        'tituloRol' : null,
        'rol' : null,
        'permisosRol' : []
      }
    ];
  }

  filtrarRoles () : void {
    if (!this.busqueda) {
      this.rolesFiltrados = this.datosRoles;
    } else {
      const textoBusqueda = this.busqueda.toLowerCase();
      this.rolesFiltrados = this.datosRoles.filter((rol : any) => {
        return rol.NombreRol?.toLowerCase().includes(textoBusqueda) ||
               rol.DescripcionRol?.toLowerCase().includes(textoBusqueda);
      });
    }
  }

  activarFiltroBusqueda () : boolean {
    return this.datosRoles.length == 0;
  }

  activarBotonLimpiar() : boolean {
    return this.datosRoles.length == 0;
  }

  limpiarTabla() : void {
    this.busqueda = '';
    this.datosRoles = [];
    this.rolesFiltrados = this.datosRoles;
  }
}
