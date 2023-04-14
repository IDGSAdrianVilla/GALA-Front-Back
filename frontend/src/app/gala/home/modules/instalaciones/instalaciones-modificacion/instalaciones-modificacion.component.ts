import { Component, OnInit } from '@angular/core';
import { FuncionesGenericasService } from '../../../../../services/utileria/funciones-genericas.service';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CatalogosService } from '../../../../services/catalogos/catalogos.service';
import { UsuariosService } from '../../../../services/usuarios/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InstalacionesService } from '../../../../services/instalaciones/instalaciones.service';

@Component({
  selector: 'app-instalaciones-modificacion',
  templateUrl: './instalaciones-modificacion.component.html',
  styleUrls: ['./instalaciones-modificacion.component.css']
})
export class InstalacionesModificacionComponent implements OnInit{
  public formInformacionCliente! : FormGroup;
  public formDireccionRegistro! : FormGroup;
  public formInstalacion! : FormGroup;
  
  public prevModificacionReporte : any = {};
  public clientes : any = [];
  public problemas : any = [];
  public pkInstalacion : number = 0;
  protected dataInstalacion : any = {};
  protected usuarioCurso : any;
  public poblaciones : any = [];
  public clasificacionesInstalaciones : any = [];
  public paquetesInstalacion : any = [];
  public paquetesInstalacionSelect : any = [];
  public detallePlan : any = [];

  constructor (
    private fb : FormBuilder,
    public funcionGenerica : FuncionesGenericasService,
    private mensajes : MensajesService,
    private catalogosService : CatalogosService,
    private usuarioService : UsuariosService,
    private rutaActiva : ActivatedRoute,
    private instalacionService : InstalacionesService,
    private router : Router
  ) {

  }

  async ngOnInit () : Promise<void> {
    this.mensajes.mensajeEsperar();

    this.crearFormInformacionCliente();
    this.crearFormDireccionRegistro();
    this.crearFormInstalacion();
    
    await this.inicilizarComponente();

    this.mensajes.mensajeGenericoToast('Se consultarón los datos con éxito', 'success');
  }

  private async inicilizarComponente(): Promise<any> {
    return await Promise.all([
      this.obtenerDatosUsuario(),
      this.obtenerPoblaciones(),
      this.obtenerClasificacionesInstalaciones(),
      this.obtenerPaquetes(),
      this.cargaComponenteModificacionInstalacion()
    ]);
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

  private cargaComponenteModificacionInstalacion () : Promise<any> {
    this.pkInstalacion = this.rutaActiva.snapshot.params['pkinstalacion'];

    return this.instalacionService.cargaComponenteModificacionInstalacion(this.pkInstalacion).toPromise().then(
      respuesta => {
        if (respuesta.status == 204) {
          this.router.navigate(['/gala/instalaciones']);
          return;
        }

        this.dataInstalacion = respuesta.data;
        console.log(this.dataInstalacion);
        this.cargarFormularios();
        this.cargaTarjetaPresentacionCliente();
        return;
      },

      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  private cargarFormularios () : void {
    this.cargarFormularioInformacionCliente();
    this.cargarFormularioDireccionCliente();
    this.cargarFormularioInstalacion();
  }

  private cargarFormularioInformacionCliente() : void {
    const datosCliente = this.dataInstalacion.datosCliente[0];
    this.formInformacionCliente.get('nombreCliente')?.setValue(datosCliente.Nombre);
    this.formInformacionCliente.get('apellidoPaternoCliente')?.setValue(datosCliente.ApellidoPaterno);
    this.formInformacionCliente.get('apellidoMaternoCliente')?.setValue(datosCliente.ApellidoMaterno);
    this.formInformacionCliente.get('sexoCliente')?.setValue(datosCliente.Sexo);
    this.formInformacionCliente.get('telefonoCliente')?.setValue(datosCliente.Telefono);
    this.formInformacionCliente.get('telefonoOpcionalCliente')?.setValue(datosCliente.TelefonoOpcional);
  }

  private cargarFormularioDireccionCliente() : void {
    const datosCliente = this.dataInstalacion.datosCliente[0];
    this.formDireccionRegistro.get('poblacionCliente')?.setValue(datosCliente.PkCatPoblacion);
    this.formDireccionRegistro.get('coordenadasCliente')?.setValue(datosCliente.Coordenadas);
    this.formDireccionRegistro.get('calleCliente')?.setValue(datosCliente.Calle);
    this.formDireccionRegistro.get('referenciasDomicilioCliente')?.setValue(datosCliente.ReferenciasDomicilio);
    this.formDireccionRegistro.get('caracteristicasDomicilioCliente')?.setValue(datosCliente.CaracteristicasDomicilio);
  }

  private cargarFormularioInstalacion () : void {
    const datosInstalacion = this.dataInstalacion.datosDetalleInstalacion[0];
    this.formInstalacion.get('clasificacionInstalacion')?.setValue(datosInstalacion.FkCatClasificacionInstalacion);
    this.formInstalacion.get('paqueteInstalacion')?.setValue(datosInstalacion.FkCatPlanInternet);
    this.formInstalacion.get('disponibilidadInstalacion')?.setValue(datosInstalacion.Disponibilidad);
    this.formInstalacion.get('observacionesInstalacion')?.setValue(datosInstalacion.Observaciones);
    this.obtenerPlanes( 'special' );
    this.obtenerDetallePlan();
  }

  private cargaTarjetaPresentacionCliente () : void {
    this.prevModificacionReporte = this.dataInstalacion.datosCliente[0];
  }

  obtenerPlanes ( tipo : string = 'normal' ) : void {
    if ( tipo != 'special' ) {
      this.formInstalacion.get('paqueteInstalacion')?.setValue('');
    }

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
    this.prevModificacionReporte.Nombre          = this.formInformacionCliente.get('nombreCliente')?.value;
    this.prevModificacionReporte.ApellidoPaterno = this.formInformacionCliente.get('apellidoPaternoCliente')?.value;
    this.prevModificacionReporte.ApellidoMaterno = this.formInformacionCliente.get('apellidoMaternoCliente')?.value;
    this.prevModificacionReporte.Sexo            = this.formInformacionCliente.get('sexoCliente')?.value;
    this.prevModificacionReporte.Telefono        = this.formInformacionCliente.get('telefonoCliente')?.value;
    const poblacionSelect                        = (document.getElementById('poblacionCliente') as HTMLSelectElement).selectedOptions[0].text;
    this.prevModificacionReporte.NombrePoblacion = poblacionSelect != 'Seleccione una Población' ? poblacionSelect : '';
  }

  validarModificarInstalacion () : void {
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

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Modificar Instalación').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          this.formInformacionCliente.value.pkCliente = this.dataInstalacion.datosCliente[0].PkTblCliente;
          this.formInstalacion.value.pkInstalacion = this.pkInstalacion;
          
          let datosModificacionInstalacion = {
            'informacionPersonal' : this.formInformacionCliente.value,
            'direccionPersonal'   : this.formDireccionRegistro.value,
            'datosInstalacion'    : this.formInstalacion.value,
            'token'               : localStorage.getItem('token')
          };

          this.instalacionService.validarModificarInstalacion( datosModificacionInstalacion ).subscribe(
            respuesta => {
              if ( respuesta.status == 409 ) {
                this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                return;
              }

              this.mensajes.mensajeGenerico(respuesta.message, 'success');
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

  funcionalidadComenzarInstalacion ( pkInstalacion : number ) : void {
    this.mensajes.mensajeConfirmacionCustom('¿Está seguro de comenzar atender la instalación?', 'question', 'Comenzar atender instalación').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();
          this.instalacionService.validarComenzarInstalacion( pkInstalacion ).subscribe(
            respuesta => {
              if ( respuesta.status == 304 ) {
                this.inicilizarComponente().then(() => {
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

  funcionalidadDejarInstalacion ( pkInstalacion : number ) : void {
    this.mensajes.mensajeConfirmacionCustom('¿Está seguro dejar de atender la instalación?', 'question', 'Dejar de atender instalación').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          const datosDejarInstalacion = {
            'pkInstalacion' : pkInstalacion,
            'token'     : localStorage.getItem('token')
          };
      
          this.instalacionService.validarDejarInstalacion( datosDejarInstalacion ).subscribe(
            respuesta => {
              if ( respuesta.status == 304 ) {
                this.inicilizarComponente().then(() => {
                  this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                  return;
                });
                return;
              }

              this.dejarInstalacion( datosDejarInstalacion );
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

  private async dejarInstalacion ( datosDejarInstalacion : any ) : Promise<any> {
    this.instalacionService.dejarInstalacion( datosDejarInstalacion ).subscribe(
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

  funcionalidadConcluirInstalacion ( pkInstalacion : number ) : void {
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

    this.mensajes.mensajeConfirmacionCustom('¿Está seguro de concluir la instalación?', 'question', 'Concluir Instalación').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          this.formInformacionCliente.value.pkCliente = this.dataInstalacion.datosCliente[0].PkTblCliente;
          this.formInstalacion.value.pkInstalacion = pkInstalacion;
          
          let datosConcluirInstalacion = {
            'informacionPersonal' : this.formInformacionCliente.value,
            'direccionPersonal'   : this.formDireccionRegistro.value,
            'datosInstalacion'    : this.formInstalacion.value,
            'token'               : localStorage.getItem('token')
          };
      
          this.instalacionService.validarConcluirInstalacion( datosConcluirInstalacion ).subscribe(
            respuesta => {
              if ( respuesta.status == 304 ) {
                this.inicilizarComponente().then(() => {
                  this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                  return;
                });
                return;
              }

              this.concluirInstalacion( datosConcluirInstalacion );
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

  private async concluirInstalacion ( datosConcluirInstalacion : any ) : Promise<any> {
    this.instalacionService.concluirInstalacion( datosConcluirInstalacion ).subscribe(
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

  funcionalidadRetomarInstalacion ( pkInstalacion : number ) : void {
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

    this.mensajes.mensajeConfirmacionCustom('¿Está seguro de retomar la instalación?', 'question', 'Retomar Instalación').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          this.formInformacionCliente.value.pkCliente = this.dataInstalacion.datosCliente[0].PkTblCliente;
          this.formInstalacion.value.pkInstalacion = pkInstalacion;
          
          let datosRetomarInstalacion = {
            'informacionPersonal' : this.formInformacionCliente.value,
            'direccionPersonal'   : this.formDireccionRegistro.value,
            'datosInstalacion'    : this.formInstalacion.value,
            'token'               : localStorage.getItem('token')
          };
      
          this.instalacionService.validarRetomarInstalacion( datosRetomarInstalacion ).subscribe(
            respuesta => {
              if ( respuesta.status == 304 ) {
                this.inicilizarComponente().then(() => {
                  this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                  return;
                });
                return;
              }

              this.retomarInstalacion( datosRetomarInstalacion );
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

  private async retomarInstalacion ( datosRetomarInstalacion : any ) : Promise<any> {
    this.instalacionService.retomarInstalacion( datosRetomarInstalacion ).subscribe(
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

  funcionalidadInstalacionNoExitosa ( pkInstalacion : number ) : void {
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

    this.mensajes.mensajeConfirmacionCustom('¿Está seguro de concluir la instalación como no exitosa?', 'question', 'Instalación no exitosa').then(
      respuestaMensaje => {
        if ( respuestaMensaje.isConfirmed ) {
          this.mensajes.mensajeEsperar();

          this.formInformacionCliente.value.pkCliente = this.dataInstalacion.datosCliente[0].PkTblCliente;
          this.formInstalacion.value.pkInstalacion = pkInstalacion;
          
          let datosInstalacionNoExitosa = {
            'informacionPersonal' : this.formInformacionCliente.value,
            'direccionPersonal'   : this.formDireccionRegistro.value,
            'datosInstalacion'    : this.formInstalacion.value,
            'token'               : localStorage.getItem('token')
          };
      
          this.instalacionService.validarInstalacionNoExitosa( datosInstalacionNoExitosa ).subscribe(
            respuesta => {
              if ( respuesta.status == 304 ) {
                this.inicilizarComponente().then(() => {
                  this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                  return;
                });
                return;
              }

              this.instalacionNoExitosa( datosInstalacionNoExitosa );
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

  private async instalacionNoExitosa ( datosInstalacionNoExitosa : any ) : Promise<any> {
    this.instalacionService.instalacionNoExitosa( datosInstalacionNoExitosa ).subscribe(
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

  esNumero(valor: any): boolean {
    return !isNaN(valor);
  }
}