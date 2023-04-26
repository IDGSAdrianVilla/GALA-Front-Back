import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/gala/services/catalogos/catalogos.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import { FuncionesGenericasService } from 'src/app/services/utileria/funciones-genericas.service';

@Component({
  selector: 'app-problemas',
  templateUrl: './problemas.component.html',
  styleUrls: ['./problemas.component.css']
})
export class ProblemasComponent implements OnInit {
  @ViewChild('cerrarModal') cerrarModal?: ElementRef;

  public formNuevoProblema! : FormGroup;

  public busqueda: string = '';
  public datosProblemas: string[] = [];
  public problemasFiltrados: any[] = [];
  public datosProblemaModificacion : any = [];
  public modificacionProblema : boolean = false;
  protected permisos : any;

  constructor (
    private fb : FormBuilder,
    public funcionGenerica : FuncionesGenericasService,
    private mensajes : MensajesService,
    private catalogoService : CatalogosService
  ) {

  }

  ngOnInit () : void {
    this.crearFormularioProblemas();
    this.obtenerPermisosModulo();
    this.consultaProblemas();
  }

  crearFormularioProblemas () : void {
    this.formNuevoProblema = this.fb.group({
      pkCatProblema         : [],
      tituloProblema        : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      descripcionProblema   : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      observacionesProblema : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
    });
  }
  
  private async obtenerPermisosModulo () : Promise<any> {
    this.permisos = this.funcionGenerica.obtenerPermisosPorModulo('catalogos');
  }

  consultaProblemas () : void {
    this.mensajes.mensajeEsperar();
    this.catalogoService.obtenerProblemas().subscribe(
      respuesta => {
        this.datosProblemas = respuesta.data;
        this.problemasFiltrados = this.datosProblemas;
        this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  crearRegistroProblema () : void {
    if ( this.formNuevoProblema.invalid ) {
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Crear Nuevo Problema').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          let dataRegistro = {
            'datosProblema' : this.formNuevoProblema.value,
            'token'         : localStorage.getItem('token')
          };

          this.catalogoService.crearNuevoProblema( dataRegistro ).subscribe(
            respuesta => {
              if ( respuesta.status != 409 ) {
                this.limpiarFormulario();
                this.datosProblemas = respuesta.problemas;
                this.problemasFiltrados = this.datosProblemas;
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

  consultaDatosProblemaModificacion ( PkCatProblema : number ) : void {
    this.mensajes.mensajeEsperar();
    this.modificacionProblema = true;

    this.catalogoService.consultaDatosProblemaModificacion(PkCatProblema).subscribe(
      respuesta => {
        this.datosProblemaModificacion = respuesta.data[0];
        this.cargarFormulario();
        this.mensajes.mensajeGenericoToast(respuesta.message, 'success');
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  modificarProblema () : void {
    if ( this.formNuevoProblema.invalid ) {
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Modificar Problema').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          let datosModificados = {
            'datosProblema' : this.formNuevoProblema.value
          };

          this.catalogoService.modificarProblema( datosModificados ).subscribe(
            respuesta => {
              if ( respuesta.status != 409) {
                this.datosProblemas = respuesta.problemas;
                this.problemasFiltrados = this.datosProblemas;
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

  cargarFormulario () : void {
    this.formNuevoProblema.get('pkCatProblema')?.setValue(this.datosProblemaModificacion.PkCatProblema);
    this.formNuevoProblema.get('tituloProblema')?.setValue(this.datosProblemaModificacion.TituloProblema);
    this.formNuevoProblema.get('descripcionProblema')?.setValue(this.datosProblemaModificacion.DescripcionProblema);
    this.formNuevoProblema.get('observacionesProblema')?.setValue(this.datosProblemaModificacion.Observaciones);
  }

  limpiarFormulario () : void {
    this.modificacionProblema = false;
    this.formNuevoProblema.reset();
  }

  filtrarProblemas () : void {
    if (!this.busqueda) {
      this.problemasFiltrados = this.datosProblemas;
    } else {
      const textoBusqueda = this.funcionGenerica.formatearMinusculasSinAcentos(this.busqueda);
      this.problemasFiltrados = this.datosProblemas.filter((problema : any) => {
        return this.funcionGenerica.formatearMinusculasSinAcentos(problema.TituloProblema).includes(textoBusqueda) ||
               this.funcionGenerica.formatearMinusculasSinAcentos(problema.DescripcionProblema).includes(textoBusqueda);
      });
    }
  }

  activarFiltroBusqueda () : boolean {
    return this.datosProblemas.length == 0;
  }

  activarBotonLimpiar () : boolean {
    return this.datosProblemas.length == 0;
  }

  limpiarTabla () : void {
    this.busqueda = '';
    this.datosProblemas = [];
    this.problemasFiltrados = this.datosProblemas;
  }
}
