import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';
import { CatalogosService } from '../../../../services/catalogos/catalogos.service';

@Component({
  selector: 'app-usuarios-registro',
  templateUrl: './usuarios-registro.component.html',
  styleUrls: ['./usuarios-registro.component.css']
})
export class UsuariosRegistroComponent implements OnInit {

  public formInformacionRegistro! : FormGroup;
  public formDireccionRegistro! : FormGroup;
  public poblaciones : any = [];

  constructor(
    private fb : FormBuilder,
    private mensajes : MensajesService,
    private catalogosService : CatalogosService
  ){

  }

  ngOnInit(): void {
    this.mensajes.mensajeEsperar();
    this.crearFormInformacionRegistro();
    this.crearFormDireccionRegistro();
    this.obtenerPoblaciones();
  }

  crearFormInformacionRegistro() : void {
    this.formInformacionRegistro = this.fb.group({
      nombreEmpleado : ['',[Validators.required]],
      apellidoPaternoEmpleado : ['',[Validators.required]],
      apellidoMaterno : ['',[]],
      sexoEmpleado : ['',[Validators.required]],
      fechaNacimientoEmpleado : ['',[Validators.required]],
      observaciones : ['',[]]
    });
  }

  funcionPrueba() : void {
    this.mensajes.mensajeEsperar();
    if(this.formDireccionRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta. \n Los campos requeridos están marcados con un *', 'info');
      return ;
    }    
  }

  crearFormDireccionRegistro() : void {
    this.formDireccionRegistro = this.fb.group({
      poblacionEmpleado : ['',[Validators.required]],
      coordenadasEmpleado : ['',[Validators.required]],
      calleEmpleado : ['',[Validators.required]]
    })
  }
  
  obtenerPoblaciones() : void {
    this.catalogosService.obtenerPoblaciones().subscribe(
      poblaciones => {
        this.poblaciones = poblaciones.data;
        this.mensajes.cerrarMensajes();
      },
      error => {
        this.mensajes.mensajeGenerico('Al parecer ocurrió un error interno, por favor contactarse con el DTIC de Emenet Sistemas', 'error');
      }
    );
  }
}
