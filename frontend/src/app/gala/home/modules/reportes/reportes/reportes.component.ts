import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/gala/services/catalogos/catalogos.service';
import { ClientesService } from 'src/app/gala/services/clientes/clientes.service';
import { ReportesService } from 'src/app/gala/services/reportes/reportes.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import { FuncionesGenericasService } from 'src/app/services/utileria/funciones-genericas.service';
import { UsuariosService } from '../../../../services/usuarios/usuarios.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit{
  @ViewChild('cerrarModal') cerrarModal? : ElementRef;

  public formNuevoReporte! : FormGroup;
  public formConsultaReportes! : FormGroup;

  public busqueda: string = '';
  public datosReportes: string[] = [];
  public reportesFiltrados: any[] = [];
  public mostrarOpciones : boolean = false;
  public clientes : any = [];
  public prevClienteReporte : any = {};
  public problemas : any = [];
  protected usuarioCurso : any;

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

    this.crearFormularioReporte();
    this.crearFormularioConsultaReportes();

    await Promise.all([
      this.obtenerClientes(),
      this.obtenerProblemas(),
      this.obtenerDatosUsuario()
    ]);

    this.mensajes.cerrarMensajes();
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

  private crearFormularioConsultaReportes () : void {
    this.formConsultaReportes = this.fb.group({
      statusReportes  : ['', [Validators.required]]
    });
  }

  obtenerClientes () : Promise<any> {
    return this.clienteService.consultarClientes().toPromise().then(
      respuesta => {
        this.clientes = respuesta.data;
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  obtenerProblemas () : Promise<void> {
    return this.catalogoService.obtenerProblemas().toPromise().then(
      respuesta => {
        this.problemas = respuesta.data;
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  obtenerDatosUsuario () : Promise<void> {
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
    const statusConsulta = this.formConsultaReportes.get('statusReportes')?.value;

    this.reporteService.consultarReportesPorStatus( statusConsulta ).subscribe(
      respuesta => {
        this.datosReportes = respuesta.reportes;
        this.reportesFiltrados= this.datosReportes;
        this.mensajes.mensajeGenericoToast(respuesta.message, 'success');
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
        this.limpiarFormulario();
        this.cerrarModal?.nativeElement.click();
        this.mensajes.mensajeGenerico(respuesta.message, 'success');
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
      const textoBusqueda = this.busqueda.toLowerCase();
      this.reportesFiltrados = this.datosReportes.filter((reporte : any) => {
        return reporte.PkTblReporte == textoBusqueda ||
                reporte.Nombre?.toLowerCase().includes(textoBusqueda) ||
                reporte.ApellidoPaterno?.toLowerCase().includes(textoBusqueda) ||
                reporte.NombrePoblacion?.toLowerCase().includes(textoBusqueda) ||
                reporte.TituloProblema?.toLowerCase().includes(textoBusqueda) ||
                reporte.FechaAlta?.toLowerCase().includes(textoBusqueda);
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
}