import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';
import { FuncionesGenericasService } from '../../../../../services/utileria/funciones-genericas.service';
import { CatalogosService } from '../../../../services/catalogos/catalogos.service';
import { InstalacionesService } from '../../../../services/instalaciones/instalaciones.service';
import { UsuariosService } from '../../../../services/usuarios/usuarios.service';

@Component({
  selector: 'app-instalaciones',
  templateUrl: './instalaciones.component.html',
  styleUrls: ['./instalaciones.component.css']
})
export class InstalacionesComponent implements OnInit{
  @ViewChild('cerrarModal') cerrarModal? : ElementRef;

  public formConsultaInstalaciones! : FormGroup;
  public formInformacionCliente! : FormGroup;
  public formDireccionRegistro! : FormGroup;
  public formInstalacion! : FormGroup;

  public busqueda : string = '';
  private datosInstalaciones : any = [];
  public instalacionesFiltras : any[] = [];
  public prevClienteNuevo : any = {};
  public poblaciones : any = [];
  public clasificacionesInstalaciones : any = [];
  public paquetesInstalacion : any = [];
  public paquetesInstalacionSelect : any = [];
  public detallePlan : any = [];
  protected usuarioCurso : any;

  constructor (
    private fb : FormBuilder,
    private mensajes : MensajesService,
    public funcionGenerica : FuncionesGenericasService,
    private catalogosService : CatalogosService,
    private instalacionesService : InstalacionesService,
    private usuarioService : UsuariosService,
    private instalacionService : InstalacionesService
  ) {

  }

  async ngOnInit () : Promise<void> {
    this.mensajes.mensajeEsperar();

    this.crearFormConsultaInstalaciones();
    this.crearFormInformacionCliente();
    this.crearFormDireccionRegistro();
    this.crearFormInstalacion();
    
    await Promise.all([
      this.obtenerPoblaciones(),
      this.obtenerClasificacionesInstalaciones(),
      this.obtenerPaquetes(),
      this.obtenerDatosUsuario()
    ]);

    this.mensajes.mensajeGenericoToast('Se consultarón los datos con éxito', 'success');
  }

  private crearFormConsultaInstalaciones () : void {
    this.formConsultaInstalaciones = this.fb.group({
      statusInstalaciones  : ['', [Validators.required]]
    });
  }

  private crearFormInformacionCliente() : void {
    this.formInformacionCliente = this.fb.group({
      nombreCliente           : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      apellidoPaternoCliente  : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      apellidoMaternoCliente  : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      sexoCliente             : ['', [Validators.required]],
      telefonoCliente         : ['', [Validators.required, Validators.pattern('[0-9]*')]],
      telefonoOpcionalCliente : ['', [Validators.pattern('[0-9]*')]]
    });
  }

  private crearFormDireccionRegistro() : void {
    this.formDireccionRegistro = this.fb.group({
      poblacionCliente                : ['', [Validators.required]],
      coordenadasCliente              : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      calleCliente                    : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      referenciasDomicilioCliente     : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      caracteristicasDomicilioCliente : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
    });
  }

  private crearFormInstalacion() : void {
    this.formInstalacion = this.fb.group({
      clasificacionInstalacion  : ['', [Validators.required]],
      paqueteInstalacion        : [''],
      disponibilidadInstalacion : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      observacionesInstalacion  : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
    });
  }

  private obtenerPoblaciones(): Promise<any> {
    return this.catalogosService.obtenerPoblaciones().toPromise().then(
      respuesta => {
        this.poblaciones = respuesta.data;
      },
      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  private obtenerClasificacionesInstalaciones() : Promise<any> {
    return this.catalogosService.consultaTiposDeInstalacion().toPromise().then(
      respuesta => {
        this.clasificacionesInstalaciones = respuesta.data;
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  private obtenerPaquetes() : Promise<any> {
    return this.catalogosService.obtenerPaquetes().toPromise().then(
      respuesta => {
        this.paquetesInstalacion = respuesta.data;
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  private obtenerDatosUsuario () : Promise<any> {
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

  obtenerPlanes () : void {
    this.formInstalacion.get('paqueteInstalacion')?.setValue('');
    this.detallePlan = [];

    const pkClasificacion = this.formInstalacion.get('clasificacionInstalacion')?.value;
    this.paquetesInstalacionSelect = this.paquetesInstalacion.filter( (item : any) => item.FkCatClasificacionInstalacion == pkClasificacion );

    if ( this.paquetesInstalacionSelect.length > 0 ) {
      this.formInstalacion.get('paqueteInstalacion')?.setValidators(Validators.required);
    } else {
      this.formInstalacion.get('paqueteInstalacion')?.clearValidators;
    }

    this.formInstalacion.get('paqueteInstalacion')?.updateValueAndValidity();
  }

  obtenerDetallePlan () : void {
    const pkPlan = this.formInstalacion.get('paqueteInstalacion')?.value;
    this.detallePlan = this.paquetesInstalacion.filter( (item : any) => item.PkCatPaquete == pkPlan );
  }

  prevNuevoCliente () : void {
    this.prevClienteNuevo.nombreCliente          = this.formInformacionCliente.get('nombreCliente')?.value;
    this.prevClienteNuevo.apellidoPaternoCliente = this.formInformacionCliente.get('apellidoPaternoCliente')?.value;
    this.prevClienteNuevo.apellidoMaternoCliente = this.formInformacionCliente.get('apellidoMaternoCliente')?.value;
    this.prevClienteNuevo.sexoCliente            = this.formInformacionCliente.get('sexoCliente')?.value;
    this.prevClienteNuevo.telefonoCliente        = this.formInformacionCliente.get('telefonoCliente')?.value;
    const poblacionSelect                        = (document.getElementById('poblacionCliente') as HTMLSelectElement).selectedOptions[0].text;
    this.prevClienteNuevo.poblacionCliente       = poblacionSelect != 'Seleccione una Población' ? poblacionSelect : '';
  }

  registrarNuevaInstalacion () : void {
    if(this.formInformacionCliente.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Información Personal.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    if(this.formDireccionRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Dirección Personal.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    if(this.formInstalacion.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Instalación.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Registrar Nueva Instalación').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          let datosNuevaInstalacion = {
            'informacionPersonal' : this.formInformacionCliente.value,
            'direccionPersonal'   : this.formDireccionRegistro.value,
            'instalacion'         : this.formInstalacion.value,
            'token'               : localStorage.getItem('token')
          };

          this.instalacionesService.registrarNuevaInstalacion( datosNuevaInstalacion ).subscribe(
            respuesta => {
              if ( respuesta.status == 409 ) {
                this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                return;
              }

              this.actualizarGridDespuesAccion().then(() => {
                this.limpiarFormularios();
                this.cerrarModal?.nativeElement.click();
                this.mensajes.mensajeGenerico(respuesta.message, 'success');
                return;
              });

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

  consultarInstalaciones () : void {
    if ( this.formConsultaInstalaciones.invalid ) {
      this.mensajes.mensajeGenerico('Para continuar antes debes seleccionar un status.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeEsperar();
    const statusConsulta = this.formConsultaInstalaciones.get('statusInstalaciones')?.value;

    this.instalacionesService.consultarInstalacionesPorStatus( statusConsulta ).subscribe(
      respuesta => {
        this.datosInstalaciones = respuesta.instalaciones;
        this.instalacionesFiltras = this.datosInstalaciones;
        this.mensajes.mensajeGenericoToast(respuesta.message, 'success');
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  limpiarFormularios () : void {
    this.formInformacionCliente.reset();
    this.formDireccionRegistro.reset();
    this.formInstalacion.reset();
    this.formDireccionRegistro.get('poblacionCliente')?.setValue('');
    this.formInstalacion.get('clasificacionInstalacion')?.setValue('');
    this.formInstalacion.get('paqueteInstalacion')?.setValue('');
    this.detallePlan = [];
    this.prevClienteNuevo = {};
  }

  filtrarReportes () : void {
    if (!this.busqueda) {
      this.instalacionesFiltras = this.datosInstalaciones;
    } else {
      const textoBusqueda = this.busqueda.toLowerCase();
      this.instalacionesFiltras = this.datosInstalaciones.filter((reporte : any) => {
        return reporte.PkTblReporte == textoBusqueda ||
                reporte.Nombre?.toLowerCase().includes(textoBusqueda) ||
                reporte.ApellidoPaterno?.toLowerCase().includes(textoBusqueda) ||
                reporte.NombrePoblacion?.toLowerCase().includes(textoBusqueda) ||
                reporte.FechaAlta?.toLowerCase().includes(textoBusqueda);
      });
    }
  }

  activarFiltroBusqueda () : boolean {
    return this.datosInstalaciones.length == 0;
  }

  activarBotonLimpiar () : boolean {
    return this.datosInstalaciones.length == 0;
  }

  limpiarTabla () : void {
    this.busqueda = '';
    this.datosInstalaciones = [];
    this.instalacionesFiltras = this.datosInstalaciones;
    
  }

  funcionalidadComenzarInstalacion ( pkInstalacion : number ) : void {
    this.mensajes.mensajeConfirmacionCustom('¿Está seguro de comenzar atender la instalación?', 'question', 'Comenzar atender instalación').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();
          this.instalacionService.validarComenzarInstalacion( pkInstalacion ).subscribe(
            respuesta => {
              if ( respuesta.status == 304 ) {
                this.actualizarGridDespuesAccion().then(() => {
                  this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                  return;
                });
                return;
              }

              this.comenzarInstalacion( pkInstalacion );
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

  private async comenzarInstalacion( pkInstalacion : number ): Promise<any> {
    const datosComenzarInstalacion = {
      'pkInstalacion': pkInstalacion,
      'token': localStorage.getItem('token')
    };
  
    this.instalacionService.comenzarInstalacion(datosComenzarInstalacion).subscribe(
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
    const statusConsulta = (typeof this.formConsultaInstalaciones.get('statusInstalaciones')?.value !== 'undefined' && isNaN(Number(this.formConsultaInstalaciones.get('statusInstalaciones')?.value))) ? defaultStatus : this.formConsultaInstalaciones.get('statusInstalaciones')?.value;

    return this.instalacionesService.consultarInstalacionesPorStatus( statusConsulta ).toPromise().then(
      respuesta => {
        this.datosInstalaciones = respuesta.instalaciones;
        this.instalacionesFiltras = this.datosInstalaciones;
        this.mensajes.mensajeGenericoToast(respuesta.message, 'success');
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }
}
