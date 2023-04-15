import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuncionesGenericasService } from '../../../../../services/utileria/funciones-genericas.service';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';
import { CatalogosService } from '../../../../services/catalogos/catalogos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportesService } from '../../../../services/reportes/reportes.service';
import { UsuariosService } from '../../../../services/usuarios/usuarios.service';

@Component({
  selector: 'app-reportes-modificacion',
  templateUrl: './reportes-modificacion.component.html',
  styleUrls: ['./reportes-modificacion.component.css']
})
export class ReportesModificacionComponent implements OnInit {
  public formModificacionReporte! : FormGroup;

  public prevModificacionReporte : any = {};
  public clientes : any = [];
  public problemas : any = [];
  public pkReporte : number = 0;
  protected dataReporte : any;
  protected usuarioCurso : any;

  constructor (
    private fb : FormBuilder,
    public funcionGenerica : FuncionesGenericasService,
    private mensajes : MensajesService,
    private catalogoService : CatalogosService,
    private rutaActiva : ActivatedRoute,
    private reporteService : ReportesService,
    private router : Router,
    private usuarioService : UsuariosService
  ) {

  }

  async ngOnInit () : Promise<void> {
    this.mensajes.mensajeEsperar();

    this.crearFromModifiacionReporte();
    await this.inicilizarComponente();

    this.mensajes.mensajeGenericoToast('Se consultarón los datos con éxito', 'success');
  }

  private async inicilizarComponente(): Promise<any> {
    return await Promise.all([
      this.obtenerDatosUsuario(),
      this.obtenerProblemas(),
      this.cargaComponenteModificacionReporte()
    ]);
  }

  crearFromModifiacionReporte () : void {
    this.formModificacionReporte = this.fb.group({
      clienteReporte        : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      problemaReporte       : ['', [Validators.required]],
      descripcionProblema   : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      observacionesReporte  : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      diagnosticoReporte    : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      solucionReporte       : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
    });
  }

  obtenerDatosUsuario () : Promise<any> {
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

  obtenerProblemas () : Promise<any> {
    return this.catalogoService.obtenerProblemas().toPromise().then(
      respuesta => {
        this.problemas = respuesta.data;
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  cargaComponenteModificacionReporte () : Promise<any> {
    this.pkReporte = this.rutaActiva.snapshot.params['pkreporte'];

    return this.reporteService.cargaComponenteModificacionReporte(this.pkReporte).toPromise().then(
      respuesta => {
        if (respuesta.status == 204) {
          this.router.navigate(['/gala/reportes']);
          return;
        }

        this.dataReporte = respuesta.data;
        this.cargarFormulario();
        this.cargaTarjetaPresentacionCliente();
        return;
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  private cargarFormulario () : void {
    const datosCliente = this.dataReporte.datosCliente[0];
    const nombreCliente = datosCliente.Nombre+' '+datosCliente.ApellidoPaterno+' '+(datosCliente.ApellidoMaterno ?? '');
    const detalleReporte = this.dataReporte.datosDetalleReporte[0];
    this.formModificacionReporte.get('clienteReporte')?.setValue(nombreCliente.trim());
    this.formModificacionReporte.get('problemaReporte')?.setValue(detalleReporte.FkCatProblemaGenerico);
    this.formModificacionReporte.get('descripcionProblema')?.setValue(detalleReporte.DescripcionProblema);
    this.formModificacionReporte.get('observacionesReporte')?.setValue(detalleReporte.Observaciones);
    this.formModificacionReporte.get('diagnosticoReporte')?.setValue(detalleReporte.Diagnostico);
    this.formModificacionReporte.get('solucionReporte')?.setValue(detalleReporte.Solucion);
  }

  private cargaTarjetaPresentacionCliente () : void {
    this.prevModificacionReporte = this.dataReporte.datosCliente[0];
  }

  validarModificarReporteCliente () : void {
    if ( this.formModificacionReporte.invalid ) {
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Modificar Reporte').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          this.formModificacionReporte.value.pkCliente = this.dataReporte.datosCliente[0].PkTblCliente;
          this.formModificacionReporte.value.pkReporte = this.pkReporte;
          
          const datosReporteModificado = {
            'informacionReporteModificado' : this.formModificacionReporte.value,
            'token' : localStorage.getItem('token')
          };

          this.reporteService.validarReporteProblemaPendienteExistente( datosReporteModificado ).subscribe(
            respuesta => {
              if ( respuesta.status == 300 ) {
                this.mensajes.mensajeConfirmacionCustom(respuesta.message, 'warning', respuesta.pregunta).then(
                  respuestaMensajeConsulta => {
                    if ( respuestaMensajeConsulta.isConfirmed ) {
                      this.mensajes.mensajeEsperar();
                      this.modificarReporteCliente( datosReporteModificado );
                    } else {
                      this.mensajes.cerrarMensajes();
                      return;
                    }
                  }
                );
                return;
              }

              this.modificarReporteCliente( datosReporteModificado );
            },

            error => {
              this.mensajes.mensajeGenerico('error', 'error');
            }
          );
        }
      }
    );
  }

  private modificarReporteCliente ( datosReporteModificado : any ) : void {
    this.reporteService.modificarReporteCliente( datosReporteModificado ).subscribe(
      respuesta => {
        this.mensajes.mensajeGenerico(respuesta.message, 'success');
      },
      
      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  funcionalidadComenzarReporteCliente ( pkReporte : number ) : void {
    this.mensajes.mensajeConfirmacionCustom('¿Está seguro de comenzar atender el reporte?', 'question', 'Comenzar atender reporte').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();
          this.reporteService.validarComenzarReporteCliente( pkReporte ).subscribe(
            respuesta => {
              if ( respuesta.status == 304 ) {
                this.inicilizarComponente().then(() => {
                  this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                  return;
                });
                return;
              }

              this.comenzarReporteCliente( pkReporte );
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

  private async comenzarReporteCliente(pkReporte: number): Promise<any> {
    const datosComenzarReporte = {
      'pkReporte': pkReporte,
      'token': localStorage.getItem('token')
    };
  
    this.reporteService.comenzarReporteCliente(datosComenzarReporte).subscribe(
      respuesta => {
        this.inicilizarComponente().then(() => {
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
                this.inicilizarComponente().then(() => {
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

  private async dejarReporteCliente ( datosDejarReporte : any ) : Promise<any> {
    this.reporteService.dejarReporteCliente( datosDejarReporte ).subscribe(
      respuesta => {
        this.inicilizarComponente().then(() => {
          this.mensajes.mensajeGenericoToast(respuesta.message, 'success');
          return;
        });
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  funcionalidadAtenderReporte ( pkReporte : number ) : void {
    if ( this.formModificacionReporte.invalid ) {
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    if (
      this.validaTextoVacio(this.formModificacionReporte.get('diagnosticoReporte')?.value) &&
      this.validaTextoVacio(this.formModificacionReporte.get('solucionReporte')?.value)
    ) {
      this.mensajes.mensajeGenerico('Para poder atender el reporte se necesita registrar un diagnóstico o una solución.', 'info', 'Se necesita diagnóstico o solución');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('¿Está seguro de atender el reporte?', 'question', 'Atender Reporte').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          this.formModificacionReporte.value.pkCliente = this.dataReporte.datosCliente[0].PkTblCliente;
          this.formModificacionReporte.value.pkReporte = this.pkReporte;

          const datosAtenderReporte = {
            'informacionReporteModificado' : this.formModificacionReporte.value,
            'pkReporte'                    : pkReporte,
            'token'                        : localStorage.getItem('token')
          };
      
          this.reporteService.validarAtenderReporteCliente( datosAtenderReporte ).subscribe(
            respuesta => {
              if ( respuesta.status == 304 ) {
                this.inicilizarComponente().then(() => {
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
        this.inicilizarComponente().then(() => {
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
                this.inicilizarComponente().then(() => {
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

  private async retomarReporteCliente ( datosAtenderReporte : any ) : Promise<any> {
    this.reporteService.retomarReporteCliente( datosAtenderReporte ).subscribe(
      respuesta => {
        this.inicilizarComponente().then(() => {
          this.mensajes.mensajeGenericoToast(respuesta.message, 'success');
          return;
        });
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  async recargarDatosGrid () : Promise<void> {
    this.mensajes.mensajeEsperar();
    await this.cargaComponenteModificacionReporte();
    this.mensajes.mensajeGenericoToast('Se actualizó la información con éxito', 'success');
  }

  private validaTextoVacio ( valor : any ) : boolean {
    return valor == null || ( typeof valor === 'string' && valor.trim() == '');
  }

  esNumero(valor: any): boolean {
    return !isNaN(valor);
  }
}