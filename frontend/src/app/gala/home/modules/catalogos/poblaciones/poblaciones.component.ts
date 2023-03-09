import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/gala/services/catalogos/catalogos.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import { FuncionesGenericasService } from 'src/app/services/utileria/funciones-genericas.service';

@Component({
  selector: 'app-poblaciones',
  templateUrl: './poblaciones.component.html',
  styleUrls: ['./poblaciones.component.css']
})
export class PoblacionesComponent implements OnInit{
  @ViewChild('cerrarModal') cerrarModal?: ElementRef;

  public formNuevaPoblacion! : FormGroup;

  public busqueda: string = '';
  public datosPoblaciones: string[] = [];
  public poblacionesFiltradas: any[] = [];
  public datosPoblacionModificacion : any = [];
  public modificacionPoblacion : boolean = false;

  constructor (
    private fb : FormBuilder,
    public funcionGenerica : FuncionesGenericasService,
    private mensajes : MensajesService,
    private catalogoService : CatalogosService
  ) {

  }

  ngOnInit() : void {
    this.crearFormularioPoblaciones();
    this.consultaPoblaciones();
  }

  consultaPoblaciones () : void {
    this.mensajes.mensajeEsperar();
    this.catalogoService.obtenerPoblaciones().subscribe(
      poblaciones => {
        this.datosPoblaciones = poblaciones.data;
        this.poblacionesFiltradas = this.datosPoblaciones;
        this.mensajes.mensajeGenericoToast(poblaciones.mensaje, 'success');
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  crearFormularioPoblaciones() : void {
    this.formNuevaPoblacion = this.fb.group({
      pkCatPoblacion         : [],
      nombrePoblacion        : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      cpPoblacion            : ['', [Validators.required, Validators.pattern('[0-9]*')]],
      observacionesPoblacion : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
    });
  }

  crearRegistroPoblacion () : void {
    if ( this.formNuevaPoblacion.invalid ) {
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Crear Nueva Población').then(
      confirm =>{
        if(confirm.isConfirmed){
          this.mensajes.mensajeEsperar();

          let dataRegistro = {
            datosPoblacion : this.formNuevaPoblacion.value,
            token : localStorage.getItem('token')
          }

          this.catalogoService.crearNuevaPoblacion(dataRegistro).subscribe(
            respuesta => {
              if ( respuesta.status != 409 ) {
                this.limpiarFormulario();
                this.datosPoblaciones = respuesta.poblaciones;
                this.poblacionesFiltradas = this.datosPoblaciones;
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

  modificarPoblacion () : void {
    if ( this.formNuevaPoblacion.invalid ) {
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Modificar Población').then(
      confirm =>{
        if(confirm.isConfirmed){
          this.mensajes.mensajeEsperar();

          let dataRegistro = {
            datosPoblacion : this.formNuevaPoblacion.value
          }

          this.catalogoService.modificarPoblacion(dataRegistro).subscribe(
            respuesta => {
              if ( respuesta.status != 409 ) {
                this.datosPoblaciones = respuesta.poblaciones;
                this.poblacionesFiltradas = this.datosPoblaciones;
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

  limpiarFormulario() : void {
    this.modificacionPoblacion = false;
    this.formNuevaPoblacion.reset();
  }

  consultaDatosPoblacionModificacion ( PkCatPoblacion : number ) : void {
    this.mensajes.mensajeEsperar();
    this.modificacionPoblacion = true;
    
    this.catalogoService.consultaDatosPoblacionModificacion( PkCatPoblacion ).subscribe(
      poblacionModificacion =>{
        this.datosPoblacionModificacion = poblacionModificacion.data[0];
        this.cargarFormulario();
        this.mensajes.mensajeGenericoToast(poblacionModificacion.message, 'success');
      },
      
      error =>{
        this.mensajes.mensajeGenerico('error', 'error');
      }
    )
  }

  cargarFormulario () : void {
    this.formNuevaPoblacion.get('pkCatPoblacion')?.setValue(this.datosPoblacionModificacion.PkCatPoblacion);
    this.formNuevaPoblacion.get('nombrePoblacion')?.setValue(this.datosPoblacionModificacion.NombrePoblacion);
    this.formNuevaPoblacion.get('cpPoblacion')?.setValue(this.datosPoblacionModificacion.CodigoPostal);
    this.formNuevaPoblacion.get('observacionesPoblacion')?.setValue(this.datosPoblacionModificacion.Observaciones);
  }

  filtrarPoblaciones() {
    if (!this.busqueda) {
      this.poblacionesFiltradas = this.datosPoblaciones;
    } else {
      const textoBusqueda = this.busqueda.toLowerCase();
      this.poblacionesFiltradas = this.datosPoblaciones.filter((poblacion : any) => {
        return poblacion.NombrePoblacion.toLowerCase().includes(textoBusqueda) ||
               poblacion.CodigoPostal.toLowerCase().includes(textoBusqueda);
      });
    }
  }

  activarBotonLimpiar () : boolean {
    return this.datosPoblaciones.length == 0;
  }

  activarFiltroBusqueda () : boolean {
    return this.datosPoblaciones.length == 0;
  }

  limpiarTabla() : void {
    this.busqueda = '';
    this.datosPoblaciones = [];
    this.poblacionesFiltradas = this.datosPoblaciones;
  }
}
