import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';
import { ClientesService } from '../../../../services/clientes/clientes.service';
import { CatalogosService } from '../../../../services/catalogos/catalogos.service';
import { FuncionesGenericasService } from '../../../../../services/utileria/funciones-genericas.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-clientes-modificacion',
  templateUrl: './clientes-modificacion.component.html',
  styleUrls: ['./clientes-modificacion.component.css']
})
export class ClientesModificacionComponent implements OnInit{
  public formInformacionRegistro! : FormGroup;
  public formDireccionRegistro! : FormGroup;

  public prevClienteNuevo : any = {};
  public poblaciones : any = [];
  public pkcliente : number = 0;
  public datosClienteModificacion : any = [];

  constructor(
    private fb : FormBuilder,
    public funcionGenerica : FuncionesGenericasService,
    private catalogosService : CatalogosService,
    private clientesService : ClientesService,
    private mensajes : MensajesService,
    private rutaActiva : ActivatedRoute,
    private router : Router
  ){

  }

  async ngOnInit(): Promise<void> {
    this.mensajes.mensajeEsperar();
  
    this.crearFormInformacionRegistro();
    this.crearFormDireccionRegistro();
    await Promise.all([this.obtenerPoblaciones(), this.consultarDatosClienteModificacion()]);
  }

  crearFormInformacionRegistro() : void {
    this.formInformacionRegistro = this.fb.group({
      nombreCliente           : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      apellidoPaternoCliente  : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      apellidoMaternoCliente  : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      sexoCliente             : ['', [Validators.required]],
      telefonoCliente         : ['', [Validators.required, Validators.pattern('[0-9]*')]],
      telefonoOpcionalCliente : ['', [Validators.pattern('[0-9]*')]]
    });
  }

  crearFormDireccionRegistro() : void {
    this.formDireccionRegistro = this.fb.group({
      poblacionCliente                : ['', [Validators.required]],
      coordenadasCliente              : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      calleCliente                    : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      referenciasDomicilioCliente     : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      caracteristicasDomicilioCliente : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
    });
  }

  prevNuevoCliente () : void {
    this.prevClienteNuevo.nombreCliente          = this.formInformacionRegistro.get('nombreCliente')?.value;
    this.prevClienteNuevo.apellidoPaternoCliente = this.formInformacionRegistro.get('apellidoPaternoCliente')?.value;
    this.prevClienteNuevo.apellidoMaternoCliente = this.formInformacionRegistro.get('apellidoMaternoCliente')?.value;
    this.prevClienteNuevo.sexoCliente            = this.formInformacionRegistro.get('sexoCliente')?.value;
    this.prevClienteNuevo.telefonoCliente        = this.formInformacionRegistro.get('telefonoCliente')?.value;
    const poblacionSelect                         = (document.getElementById('poblacionCliente') as HTMLSelectElement).selectedOptions[0].text;
    this.prevClienteNuevo.poblacionCliente       = poblacionSelect != 'Seleccione una Población' ? poblacionSelect : '';
  }

  obtenerPoblaciones(): Promise<any> {
    return this.catalogosService.obtenerPoblaciones().toPromise().then(
      poblaciones => {
        this.poblaciones = poblaciones.data;
      },
      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  consultarDatosClienteModificacion() : Promise<any> {
    this.pkcliente = this.rutaActiva.snapshot.params['pkcliente'];

    return this.clientesService.consultarDatosClienteModificacion(this.pkcliente).toPromise().then(
      clienteModificacion =>{
        if(clienteModificacion.data[0] != undefined){
          this.datosClienteModificacion = clienteModificacion.data[0];
          this.cargarformulario();
          this.prevNuevoCliente();
          this.mensajes.mensajeGenericoToast(clienteModificacion.message,'success');
        } else {
          this.router.navigate(['/gala/clientes']);
        }
        
      },
      error =>{
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  cargarformulario() : void {
    this.formInformacionRegistro.get('nombreCliente')?.setValue(this.datosClienteModificacion.Nombre);
    this.formInformacionRegistro.get('apellidoPaternoCliente')?.setValue(this.datosClienteModificacion.ApellidoPaterno);
    this.formInformacionRegistro.get('apellidoMaternoCliente')?.setValue(this.datosClienteModificacion.ApellidoMaterno);
    this.formInformacionRegistro.get('sexoCliente')?.setValue(this.datosClienteModificacion.Sexo);
    this.formInformacionRegistro.get('telefonoCliente')?.setValue(this.datosClienteModificacion.Telefono);
    this.formInformacionRegistro.get('telefonoOpcionalCliente')?.setValue(this.datosClienteModificacion.TelefonoOpcional);

    this.formDireccionRegistro.get('poblacionCliente')?.setValue(this.datosClienteModificacion.PkCatPoblacion);
    this.formDireccionRegistro.get('coordenadasCliente')?.setValue(this.datosClienteModificacion.Coordenadas);
    this.formDireccionRegistro.get('calleCliente')?.setValue(this.datosClienteModificacion.Calle);
    this.formDireccionRegistro.get('referenciasDomicilioCliente')?.setValue(this.datosClienteModificacion.ReferenciasDomicilio);
    this.formDireccionRegistro.get('caracteristicasDomicilioCliente')?.setValue(this.datosClienteModificacion.CaracteristicasDomicilio);
  }

  actualizarDatosCliente() : void {
    if(this.formInformacionRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Información Personal.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    if(this.formDireccionRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Dirección Personal.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }
    this.mensajes.mensajeGenerico('Se creó con éxito','success');

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Modificar Cliente').then(
      confirm =>{
        if(confirm.isConfirmed){
          this.mensajes.mensajeEsperar();

          let datosClienteModificacion = {
            'informacionPersonal'   : this.formInformacionRegistro.value,
            'direccionPersonal'     : this.formDireccionRegistro.value,
            'pkClienteModificacion' : this.pkcliente
          };

          this.clientesService.modificarDatosCliente(datosClienteModificacion).subscribe(
            respuesta =>{
              if ( respuesta.status != 409 ) {
                this.mensajes.mensajeGenerico(respuesta.message, 'success');
                return;
              }

              this.mensajes.mensajeGenerico(respuesta.message, 'warning');
              return;
            },

            error =>{
              this.mensajes.mensajeGenerico('error', 'error');
            }
          );
        }
      }
    );
  }

  limpiarFormularios() : void {
    this.formInformacionRegistro.reset();
    this.formDireccionRegistro.reset();
    this.formDireccionRegistro.get('poblacionCliente')?.setValue('');
  }
  

}
