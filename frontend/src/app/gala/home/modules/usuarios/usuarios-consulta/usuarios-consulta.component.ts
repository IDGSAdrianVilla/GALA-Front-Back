import { Component } from '@angular/core';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';

@Component({
  selector: 'app-usuarios-consulta',
  templateUrl: './usuarios-consulta.component.html',
  styleUrls: ['./usuarios-consulta.component.css']
})
export class UsuariosConsultaComponent {
  opcionesMultiselect : any = [];
  
  opcionesSeleccionadas: string[] = [];
  tituloSelect = '';
  mostrarOpciones = false;

  constructor (
    private mensajes : MensajesService
  ) {

  }

  activaLista() {
    this.mostrarOpciones = !this.mostrarOpciones;
  }

  seleccionarOpcion(option: string) {
    const index = this.opcionesSeleccionadas.indexOf(option);
    if (index === -1) {
      this.opcionesSeleccionadas.push(option);
    } else {
      this.opcionesSeleccionadas.splice(index, 1);
    }

    this.tituloSelect = this.opcionesMultiselect.filter((opcion : any) => this.opcionesSeleccionadas.includes(opcion.pk)).map((opcion : any) => opcion.nombrePob).join(', ');
  }

  consultarPorRoles() : void {
    if ( this.opcionesSeleccionadas.length > 0 ) {
      // codigo de consulta back-end
    } else {
      this.mensajes.mensajeGenerico('Para consultar antes debes seleccionar algún Rol', 'info');
    }
  }
}
