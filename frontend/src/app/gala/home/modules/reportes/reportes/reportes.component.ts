import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/gala/services/catalogos/catalogos.service';
import { ClientesService } from 'src/app/gala/services/clientes/clientes.service';
import { ReportesService } from 'src/app/gala/services/reportes/reportes.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import { FuncionesGenericasService } from 'src/app/services/utileria/funciones-genericas.service';
import { UsuariosService } from '../../../../services/usuarios/usuarios.service';
import * as unorm from 'unorm';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit{
  @ViewChild('cerrarModal') cerrarModal? : ElementRef;

  public formNuevoReporte! : FormGroup;
  public formConsultaReportes! : FormGroup;

  public busqueda : string = '';
  private datosReportes : any = [];
  public reportesFiltrados : any[] = [];
  public mostrarOpciones : boolean = false;
  public clientes : any = [];
  public prevClienteReporte : any = {};
  public problemas : any = [];
  protected usuarioCurso : any;
  protected permisos : any;

  constructor (
    private mensajes : MensajesService,
    public funcionGenerica : FuncionesGenericasService,
    private fb : FormBuilder,
    private clienteService : ClientesService,
    private catalogoService : CatalogosService,
    private reporteService : ReportesService,
    private usuarioService : UsuariosService
  ) {

  }

  async ngOnInit () : Promise<void> {
    this.mensajes.mensajeEsperar();

    this.crearFormularioConsultaReportes();
    this.crearFormularioReporte();

    await Promise.all([
      this.obtenerPermisosModulo(),
      this.obtenerClientes(),
      this.obtenerProblemas(),
      this.obtenerDatosUsuario(),
      this.obtenerReportes()
    ]);

    this.mensajes.cerrarMensajes();
  }

  private crearFormularioConsultaReportes () : void {
    this.formConsultaReportes = this.fb.group({
      statusReportes  : ['1', [Validators.required]]
    });
  }

  private crearFormularioReporte () : void {
    this.formNuevoReporte = this.fb.group({
      clienteReporte        : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      problemaReporte       : ['', [Validators.required]],
      descripcionProblema   : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      observacionesReporte  : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      diagnosticoReporte    : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      solucionReporte       : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
    });
  }

  private async obtenerPermisosModulo () : Promise<any> {
    this.permisos = this.funcionGenerica.obtenerPermisosPorModulo('reportes');
  }

  private obtenerClientes () : Promise<any> {
    return this.clienteService.consultarClientes().toPromise().then(
      respuesta => {
        this.clientes = respuesta.data;
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  private obtenerProblemas () : Promise<void> {
    return this.catalogoService.obtenerProblemas().toPromise().then(
      respuesta => {
        this.problemas = respuesta.data;
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  private obtenerDatosUsuario () : Promise<void> {
    const token = localStorage.getItem('token');
    return this.usuarioService.obtenerInformacion(token).toPromise().then(
      respuesta => {
        this.usuarioCurso = respuesta[0];
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  consultarReportes () : void {
    if ( this.formConsultaReportes.invalid ) {
      this.mensajes.mensajeGenerico('Para continuar antes debes seleccionar un status.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeEsperar();
    this.obtenerReportes().then(() => {
      this.mensajes.mensajeGenericoToast('Se consultaron los reportes con éxito', 'success');
      return;
    });
  }

  private async obtenerReportes () : Promise<void> {
    const statusConsulta = this.formConsultaReportes.get('statusReportes')?.value;

    return this.reporteService.consultarReportesPorStatus( statusConsulta ).toPromise().then(
      respuesta => {
        this.datosReportes = respuesta.reportes;
        this.reportesFiltrados = this.datosReportes;
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  crearRegistroReporte () : void {
    if ( !this.validaClienteExistente() ) {
      this.mensajes.mensajeGenerico('Para continuar debe colocar un cliente existente y valido.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    if ( this.formNuevoReporte.invalid ) {
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Crear Nuevo Reporte').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          this.formNuevoReporte.value.pkCliente = this.obtenerClientePorNombre( this.formNuevoReporte.value.clienteReporte ).PkTblCliente;
          
          const datosNuevoReporte = {
            'informacionReporte' : this.formNuevoReporte.value,
            'token' : localStorage.getItem('token')
          };

          this.reporteService.validarReportePendienteExistente(datosNuevoReporte).subscribe(
            respuesta => {
              if ( respuesta.status == 300 ) {
                this.mensajes.mensajeConfirmacionCustom(respuesta.message, 'warning', respuesta.pregunta).then(
                  respuestaMensajeConsulta => {
                    if ( respuestaMensajeConsulta.isConfirmed ) {
                      this.mensajes.mensajeEsperar();
                      this.crearNuevoReporte( datosNuevoReporte );
                    } else {
                      this.mensajes.cerrarMensajes();
                      return;
                    }
                  }
                );
                return;
              }

              this.crearNuevoReporte( datosNuevoReporte );
            },

            error => {
              this.mensajes.mensajeGenerico('error', 'error');
            }
          );
          
        }
      }
    );
  }

  private crearNuevoReporte ( datosNuevoReporte : any ) : void {
    this.reporteService.crearNuevoReporte( datosNuevoReporte ).subscribe(
      respuesta => {
        this.actualizarGridDespuesAccion().then(() => {
          this.limpiarFormulario();
          this.cerrarModal?.nativeElement.click();
          this.mensajes.mensajeGenerico(respuesta.message, 'success');
          return;
        });
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  private validaClienteExistente () : boolean {
    const campoNombre = this.formNuevoReporte.get('clienteReporte')?.value;
    const registros = this.obtenerClientePorNombre( campoNombre );
    
    return Object.keys(registros).length != 0 ? true : false;
  }

  mostrarOpcionesCliente () : void {
    const campoNombre : any = this.formNuevoReporte.get('clienteReporte')?.value;
    this.mostrarOpciones = campoNombre.length > 0;
    this.prevClienteReporte = this.obtenerClientePorNombre( campoNombre );
    this.formNuevoReporte.get('clienteReporte')?.setValue( campoNombre.trim() );
  }

  obtenerClientePorNombre ( nombreCliente : any ) : any {
    const resultado = this.clientes.filter( (cliente : any) =>{
      const nombreCompleto : string = cliente.Nombre+' '+cliente.ApellidoPaterno+' '+(cliente.ApellidoMaterno ?? '');
      return nombreCompleto.trim() == nombreCliente.trim();
    });

    return resultado.length > 0 ? resultado[0] : {};
  }

  limpiarFormulario () : void {
    this.formNuevoReporte.reset();
    this.prevClienteReporte = {};
    this.mostrarOpciones = false;
    this.formNuevoReporte.get('problemaReporte')?.setValue('');
  }

  filtrarReportes () : void {
    if (!this.busqueda) {
      this.reportesFiltrados = this.datosReportes;
    } else {
      const textoBusquedaNormalizado = this.funcionGenerica.formatearMinusculasSinAcentos(this.busqueda);
      this.reportesFiltrados = this.datosReportes.filter((reporte : any) => {
        return reporte.PkTblReporte == this.busqueda ||
          this.funcionGenerica.formatearMinusculasSinAcentos(reporte.Nombre).includes(textoBusquedaNormalizado) ||
          this.funcionGenerica.formatearMinusculasSinAcentos(reporte.ApellidoPaterno).includes(textoBusquedaNormalizado) ||
          this.funcionGenerica.formatearMinusculasSinAcentos(reporte.NombrePoblacion).includes(textoBusquedaNormalizado) ||
          this.funcionGenerica.formatearMinusculasSinAcentos(reporte.TituloProblema).includes(textoBusquedaNormalizado) ||
          this.funcionGenerica.formatearMinusculasSinAcentos(reporte.FechaAlta).includes(textoBusquedaNormalizado);
      });
    }
  }

  activarFiltroBusqueda () : boolean {
    return this.datosReportes.length == 0;
  }

  activarBotonLimpiar () : boolean {
    return this.datosReportes.length == 0;
  }

  limpiarTabla () : void {
    this.busqueda = '';
    this.datosReportes = [];
    this.reportesFiltrados = this.datosReportes;
  }

  funcionalidadComenzarReporteCliente ( pkReporte : number ) : void {
    this.mensajes.mensajeConfirmacionCustom('¿Está seguro de comenzar atender el reporte?', 'question', 'Comenzar atender reporte').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();
          this.reporteService.validarComenzarReporteCliente( pkReporte ).subscribe(
            respuesta => {
              if ( respuesta.status == 304 ) {
                this.actualizarGridDespuesAccion().then(() => {
                  this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                  return;
                });
                return;
              }

              const datosComenzarReporte = {
                'pkReporte' : pkReporte,
                'token'     : localStorage.getItem('token')
              };

              this.comenzarReporteCliente( datosComenzarReporte );
            },

            error => {
              this.mensajes.mensajeGenerico('error', 'error');
            }
          );
          return;
        }
        return;
      }
    );
  }

  private comenzarReporteCliente ( datosComenzarReporte : any ) : void {
    this.reporteService.comenzarReporteCliente( datosComenzarReporte ).subscribe(
      respuesta => {
        this.actualizarGridDespuesAccion().then(() => {
          this.mensajes.mensajeGenericoToast(respuesta.message, 'success');
          return;
        });
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  funcionalidadDejarReporteCliente ( pkReporte : number ) : void {
    this.mensajes.mensajeConfirmacionCustom('¿Está seguro dejar de atender el reporte?', 'question', 'Dejar de atender reporte').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          const datosDejarReporte = {
            'pkReporte' : pkReporte,
            'token'     : localStorage.getItem('token')
          };
      
          this.reporteService.validarDejarReporteCliente( datosDejarReporte ).subscribe(
            respuesta => {
              if ( respuesta.status == 304 ) {
                this.actualizarGridDespuesAccion().then(() => {
                  this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                  return;
                });
                return;
              }

              this.dejarReporteCliente( datosDejarReporte );
            },

            error => {
              this.mensajes.mensajeGenerico('error', 'error');
            }
          );
          return;
        }
        return;
      }
    );
  }

  private dejarReporteCliente ( datosDejarReporte : any ) : void {
    this.reporteService.dejarReporteCliente( datosDejarReporte ).subscribe(
      respuesta => {
        this.actualizarGridDespuesAccion().then(() => {
          this.mensajes.mensajeGenericoToast(respuesta.message, 'success');
          return;
        });
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  funcionalidadAtenderReporte ( reporte : any ) : void {
    if (
      this.validaTextoVacio(reporte.Diagnostico) &&
      this.validaTextoVacio(reporte.Solucion)
    ) {
      this.mensajes.mensajeGenerico('Para poder atender el reporte se necesita registrar un diagnóstico o una solución.', 'info', 'Se necesita diagnóstico o solución');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('¿Está seguro de atender el reporte?', 'question', 'Atender Reporte').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          const datosAtenderReporte = {
            'pkReporte'                    : reporte.PkTblReporte,
            'token'                        : localStorage.getItem('token')
          };
      
          this.reporteService.validarAtenderReporteCliente( datosAtenderReporte ).subscribe(
            respuesta => {
              if ( respuesta.status == 304 ) {
                this.actualizarGridDespuesAccion().then(() => {
                  this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                  return;
                });
                return;
              }

              this.atenderReporteCliente( datosAtenderReporte );
            },

            error => {
              this.mensajes.mensajeGenerico('error', 'error');
            }
          );
          return;
        }
        return;
      }
    );
  }

  private async atenderReporteCliente ( datosAtenderReporte : any ) : Promise<any> {
    this.reporteService.atenderReporteCliente( datosAtenderReporte ).subscribe(
      respuesta => {
        this.actualizarGridDespuesAccion().then(() => {
          this.mensajes.mensajeGenericoToast(respuesta.message, 'success');
          return;
        });
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  funcionalidadRetomarReporte ( pkReporte : number ) : void {
    this.mensajes.mensajeConfirmacionCustom('¿Está seguro de retomar el reporte?', 'question', 'Retomar reporte').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          const datosRetomarReporte = {
            'pkReporte' : pkReporte,
            'token'     : localStorage.getItem('token')
          };
      
          this.reporteService.validarRetomarReporteCliente( datosRetomarReporte ).subscribe(
            respuesta => {
              if ( respuesta.status == 304 ) {
                this.actualizarGridDespuesAccion().then(() => {
                  this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                  return;
                });
                return;
              }

              this.retomarReporteCliente( datosRetomarReporte );
            },

            error => {
              this.mensajes.mensajeGenerico('error', 'error');
            }
          );
          return;
        }
        return;
      }
    );
  }

  private async retomarReporteCliente ( datosRetomarReporte : any ) : Promise<any> {
    this.reporteService.retomarReporteCliente( datosRetomarReporte ).subscribe(
      respuesta => {
        this.actualizarGridDespuesAccion().then(() => {
          this.mensajes.mensajeGenericoToast(respuesta.message, 'success');
          return;
        });
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  funcionalidadEliminarReporte ( pkReporte : number ) : void {
    this.mensajes.mensajeConfirmacionCustom('¿Está seguro de eliminar el reporte?, toma en cuenta que no hay como revertir esta acción', 'question', 'Eliminar Reporte').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          const datosEliminarReporte = {
            'pkReporte' : pkReporte,
            'token'     : localStorage.getItem('token')
          };
      
          this.reporteService.validarEliminarReporteCliente( datosEliminarReporte ).subscribe(
            respuesta => {
              if ( respuesta.status == 304 ) {
                this.actualizarGridDespuesAccion().then(() => {
                  this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                  return;
                });
                return;
              }

              this.eliminarReporteCliente( datosEliminarReporte );
            },

            error => {
              this.mensajes.mensajeGenerico('error', 'error');
            }
          );
          return;
        }
        return;
      }
    );
  }

  private async eliminarReporteCliente ( datosEliminarReporte : any ) : Promise<any> {
    this.reporteService.eliminarReporteCliente( datosEliminarReporte ).subscribe(
      respuesta => {
        this.actualizarGridDespuesAccion().then(() => {
          this.mensajes.mensajeGenericoToast(respuesta.message, 'success');
          return;
        });
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  private async actualizarGridDespuesAccion ( defaultStatus : number = 1 ) : Promise<void> {
    const statusConsulta = (typeof this.formConsultaReportes.get('statusReportes')?.value !== 'undefined' && isNaN(this.formConsultaReportes.get('statusReportes')?.value)) ? defaultStatus : this.formConsultaReportes.get('statusReportes')?.value;

    return this.reporteService.consultarReportesPorStatus( statusConsulta ).toPromise().then(
      respuesta => {
        this.datosReportes = respuesta.reportes;
        this.reportesFiltrados= this.datosReportes;
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  private validaTextoVacio ( valor : any ) : boolean {
    return valor == null || ( typeof valor === 'string' && valor.trim() == '');
  }
}