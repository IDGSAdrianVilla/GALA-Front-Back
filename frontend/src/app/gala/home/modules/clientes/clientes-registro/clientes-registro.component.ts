import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuncionesGenericasService } from '../../../../../services/utileria/funciones-genericas.service';
import { CatalogosService } from '../../../../services/catalogos/catalogos.service';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';

@Component({
  selector: 'app-clientes-registro',
  templateUrl: './clientes-registro.component.html',
  styleUrls: ['./clientes-registro.component.css']
})
export class ClientesRegistroComponent implements OnInit {
  public formInformacionRegistro! : FormGroup;
  public formDireccionRegistro! : FormGroup;

  public prevClienteNuevo : any = {};
  public poblaciones : any = [];

  constructor(
    private fb : FormBuilder,
    public funcionGenerica : FuncionesGenericasService,
    private catalogosService : CatalogosService,
    private mensajes : MensajesService
  ){}

  async ngOnInit(): Promise<void> {
    this.mensajes.mensajeEsperar();
  
    this.crearFormInformacionRegistro();
    this.crearFormDireccionRegistro();
    await Promise.all([this.obtenerPoblaciones()]);
  
    this.mensajes.cerrarMensajes();
  }

  crearFormInformacionRegistro() : void {
    this.formInformacionRegistro = this.fb.group({
      nombreCliente          : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      apellidoPaternoCliente : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      apellidoMaternoCliente : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      telefonoCliente        : ['', [Validators.required, Validators.pattern('[0-9]*')]],
      sexoCliente            : ['', [Validators.required]],
      fechaNacimientoCliente : ['', [Validators.required]],
      observacionesCliente   : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
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

  crearNuevoCliente() : void {
    if(this.formInformacionRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Información Personal.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    if(this.formDireccionRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Dirección Personal.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }
    this.mensajes.mensajeGenerico('Se creó con éxito','success');
  }
  
}
