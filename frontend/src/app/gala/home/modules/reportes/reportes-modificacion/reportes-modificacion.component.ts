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

  public mostrarOpciones : boolean = false;
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

    await Promise.all([
      this.obtenerDatosUsuario(),
      this.obtenerProblemas(),
      this.cargaComponenteModificacionReporte()
    ]);

    this.mensajes.mensajeGenericoToast('Se consultarón los datos con éxito', 'success');
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

  cargaComponenteModificacionReporte () : Promise<any> {
    this.pkReporte = this.rutaActiva.snapshot.params['pkreporte'];

    return this.reporteService.cargaComponenteModificacionReporte(this.pkReporte).toPromise().then(
      respuesta => {
        if (respuesta.status == 204) {
          this.router.navigate(['/gala/clientes']);
          return;
        }

        this.dataReporte = respuesta.data;
        this.cargarFormulario();
        this.cargaTarjetaPresentacionUsuario();
        return;
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  cargarFormulario () : void {
    const datosCliente = this.dataReporte.datosCliente[0];
    const nombreCliente = datosCliente.Nombre+' '+datosCliente.ApellidoPaterno+' '+datosCliente.ApellidoMaterno ?? '';
    const detalleReporte = this.dataReporte.datosDetalleReporte[0];
    this.formModificacionReporte.get('clienteReporte')?.setValue(nombreCliente.trim());
    this.formModificacionReporte.get('problemaReporte')?.setValue(detalleReporte.PkCatProblema);
    this.formModificacionReporte.get('descripcionProblema')?.setValue(detalleReporte.DescripcionProblema);
    this.formModificacionReporte.get('observacionesReporte')?.setValue(detalleReporte.Observaciones);
    this.formModificacionReporte.get('diagnosticoReporte')?.setValue(detalleReporte.Diagnostico);
    this.formModificacionReporte.get('solucionReporte')?.setValue(detalleReporte.Solucion);
  }

  cargaTarjetaPresentacionUsuario () : void {
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
}