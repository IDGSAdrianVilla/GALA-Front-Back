import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuncionesGenericasService } from '../../../../../services/utileria/funciones-genericas.service';
import { CatalogosService } from '../../../../services/catalogos/catalogos.service';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';
import { ClientesService } from '../../../../services/clientes/clientes.service';

@Component({
  selector: 'app-clientes-registro',
  templateUrl: './clientes-registro.component.html',
  styleUrls: ['./clientes-registro.component.css']
})
export class ClientesRegistroComponent implements OnInit {
  public formInformacionCliente! : FormGroup;
  public formDireccionRegistro! : FormGroup;

  public prevClienteNuevo : any = {};
  public poblaciones : any = [];

  constructor(
    private fb : FormBuilder,
    public funcionGenerica : FuncionesGenericasService,
    private catalogosService : CatalogosService,
    private clientesService : ClientesService,
    private mensajes : MensajesService
  ){}

  async ngOnInit(): Promise<void> {
    this.mensajes.mensajeEsperar();
  
    this.crearFormInformacionCliente();
    this.crearFormDireccionRegistro();

    await Promise.all([
      this.obtenerPoblaciones()
    ]);
  
    this.mensajes.cerrarMensajes();
  }

  crearFormInformacionCliente() : void {
    this.formInformacionCliente = this.fb.group({
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
    this.prevClienteNuevo.nombreCliente          = this.formInformacionCliente.get('nombreCliente')?.value;
    this.prevClienteNuevo.apellidoPaternoCliente = this.formInformacionCliente.get('apellidoPaternoCliente')?.value;
    this.prevClienteNuevo.apellidoMaternoCliente = this.formInformacionCliente.get('apellidoMaternoCliente')?.value;
    this.prevClienteNuevo.sexoCliente            = this.formInformacionCliente.get('sexoCliente')?.value;
    this.prevClienteNuevo.telefonoCliente        = this.formInformacionCliente.get('telefonoCliente')?.value;
    this.prevClienteNuevo.Coordenadas            = this.formDireccionRegistro.get('coordenadasCliente')?.value;
    const poblacionSelect                        = (document.getElementById('poblacionCliente') as HTMLSelectElement).selectedOptions[0].text;
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

  crearNuevoCliente() : void {
    if(this.formInformacionCliente.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Información Personal.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    if(this.formDireccionRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Dirección Personal.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Crear Nuevo Usuario').then(
      confirm =>{
        if(confirm.isConfirmed){
          this.mensajes.mensajeEsperar();

          let datosNuevoCliente = {
            'informacionPersonal' : this.formInformacionCliente.value,
            'direccion'           : this.formDireccionRegistro.value,
            'token'               : localStorage.getItem('token')
          };

          this.clientesService.crearNuevoCliente(datosNuevoCliente).subscribe(
            respuesta =>{
              if ( respuesta.status == 409 ) {
                this.mensajes.mensajeGenerico(respuesta.message, 'warning');
                return;
              }

              this.limpiarFormularios();
              this.mensajes.mensajeGenerico(respuesta.message, 'success');
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
    this.formInformacionCliente.reset();
    this.formDireccionRegistro.reset();
    this.formDireccionRegistro.get('poblacionCliente')?.setValue('');
    this.prevClienteNuevo = {};
  }
}