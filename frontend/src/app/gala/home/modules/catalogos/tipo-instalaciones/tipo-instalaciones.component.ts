import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';
import { CatalogosService } from '../../../../services/catalogos/catalogos.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FuncionesGenericasService } from '../../../../../services/utileria/funciones-genericas.service';

@Component({
  selector: 'app-tipo-instalaciones',
  templateUrl: './tipo-instalaciones.component.html',
  styleUrls: ['./tipo-instalaciones.component.css']
})
export class TipoInstalacionesComponent implements OnInit{
  @ViewChild('cerrarModal') cerrarModal?: ElementRef;


  public formNuevoTipoInstalacion! : FormGroup;


  public busqueda: string = '';
  public datosTipoInstalacion: string[] = [];
  public tipoInstalacionesFiltrados: any[] = [];
  public datosTipoInstalacionModificacion : any = [];
  public modificacionTipoInstalacion : boolean = false;
  protected permisos : any;

  constructor (
    private fb : FormBuilder,
    public funcionGenerica : FuncionesGenericasService,
    private mensajes : MensajesService,
    private catalogoService : CatalogosService
  ) {

  }

  ngOnInit(): void {
    this.crearFormularioTipoInstalaciones();
    this.obtenerPermisosModulo();
    this.consultaTiposDeInstalacion();
  }

  crearFormularioTipoInstalaciones() : void {
    this.formNuevoTipoInstalacion = this.fb.group({
      pkCatClasificacionInstalacion : [],
      nombreClasificacion           : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      descripcionClasificacion      : ['',[Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      observacionesClasificacion    : ['',[Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
    });
  }

  private async obtenerPermisosModulo () : Promise<any> {
    this.permisos = this.funcionGenerica.obtenerPermisosPorModulo('catalogos');
  }

  consultaTiposDeInstalacion() : void {
    this.mensajes.mensajeEsperar();
    this.catalogoService.consultaTiposDeInstalacion().subscribe(
      respuesta => {
        this.datosTipoInstalacion = respuesta.data;
        this.tipoInstalacionesFiltrados = this.datosTipoInstalacion;
        this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  crearRegistroTipoInstalacion() : void {
    if ( this.formNuevoTipoInstalacion.invalid ) {
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Crear Nueva Clasificación').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          let dataRegistro = {
            'datosTipoInstalacion' : this.formNuevoTipoInstalacion.value,
            'token'         : localStorage.getItem('token')
          };

          this.catalogoService.crearNuevoTipoInstalacion( dataRegistro ).subscribe(
            respuesta => {
              if ( respuesta.status != 409 ) {
                this.limpiarFormulario();
                this.datosTipoInstalacion = respuesta.tipoInstalacion;
                this.tipoInstalacionesFiltrados = this.datosTipoInstalacion;
                this.cerrarModal?.nativeElement.click();
                this.mensajes.mensajeGenerico(respuesta.message, 'success');
                return;
              }

              this.mensajes.mensajeGenerico(respuesta.message, 'warning');
              return;
            },

            error => {
              this.mensajes.mensajeGenerico('error', 'error');
            }
          );
        }
      }
    );
  }

  consultaDatosTipoInstalacionModificacion( PkCatClasificacionInstalacion : number ) : void {
    this.mensajes.mensajeEsperar();
    this.modificacionTipoInstalacion = true;

    this.catalogoService.consultaDatosTipoInstalacionModificacion(PkCatClasificacionInstalacion).subscribe(
      respuesta => {
        this.datosTipoInstalacionModificacion = respuesta.data[0];
        this.cargarFormulario();
        this.mensajes.mensajeGenericoToast(respuesta.message, 'success');
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  

  cargarFormulario () : void {
    this.formNuevoTipoInstalacion.get('pkCatClasificacionInstalacion')?.setValue(this.datosTipoInstalacionModificacion.PkCatClasificacionInstalacion);
    this.formNuevoTipoInstalacion.get('nombreClasificacion')?.setValue(this.datosTipoInstalacionModificacion.NombreClasificacion);
    this.formNuevoTipoInstalacion.get('descripcionClasificacion')?.setValue(this.datosTipoInstalacionModificacion.Descripcion);
    this.formNuevoTipoInstalacion.get('observacionesClasificacion')?.setValue(this.datosTipoInstalacionModificacion.Observaciones);
  }

  limpiarFormulario() : void {
    this.modificacionTipoInstalacion = false;
    this.formNuevoTipoInstalacion.reset();
  }

  modificarTipoInstalacion() : void {
    if ( this.formNuevoTipoInstalacion.invalid ) {
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Modificar Clasificación').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          let datosModificados = {
            'datosTipoInstalacion' : this.formNuevoTipoInstalacion.value
          };
          
          this.catalogoService.modificarTipoInstalacion( datosModificados ).subscribe(
            respuesta => {
              if ( respuesta.status != 409) {
                this.datosTipoInstalacion = respuesta.tipoInstalaciones;
                this.tipoInstalacionesFiltrados = this.datosTipoInstalacion;
                this.cerrarModal?.nativeElement.click();
                this.mensajes.mensajeGenerico(respuesta.message, 'success');
                return;
              }

              this.mensajes.mensajeGenerico(respuesta.message, 'warning');
              return;
            },

            error => {
              this.mensajes.mensajeGenerico('error', 'error');
            }
          );
        }
      }
    );
  }

  filtrarTipoInstalaciones() {
    if (!this.busqueda) {
      this.tipoInstalacionesFiltrados = this.datosTipoInstalacion;
    } else {
      const textoBusqueda = this.busqueda.toLowerCase();
      this.tipoInstalacionesFiltrados = this.datosTipoInstalacion.filter((tipoInstalacion : any) => {
        return tipoInstalacion.NombreClasificacion?.toLowerCase().includes(textoBusqueda) ||
               tipoInstalacion.Descripcion?.toLowerCase().includes(textoBusqueda);
      });
    }
  }

  activarFiltroBusqueda () : boolean {
    return this.datosTipoInstalacion.length == 0;
  }

  activarBotonLimpiar() : boolean {
    return this.datosTipoInstalacion.length == 0;
  }

  limpiarTabla() : void {
    this.busqueda = '';
    this.datosTipoInstalacion = [];
    this.tipoInstalacionesFiltrados = this.datosTipoInstalacion;
  }
}
