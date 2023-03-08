import { Component, OnInit } from '@angular/core';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';
import { ClientesService } from '../../../../services/clientes/clientes.service';

@Component({
  selector: 'app-clientes-consulta',
  templateUrl: './clientes-consulta.component.html',
  styleUrls: ['./clientes-consulta.component.css']
})
export class ClientesConsultaComponent implements OnInit{

    public busqueda : string = '';
    public clientesFiltrados : any[] = [];
    public datosClientes : any = [];

  constructor(
    private mensajes : MensajesService,
    private clientesService : ClientesService
  ){

  }

  ngOnInit(): void {
    this.consultaClientes();
  }

  consultaClientes() : void {
    this.mensajes.mensajeEsperar();
    this.clientesService.consultarClientes().subscribe(
      respuestaClientes =>{
        this.datosClientes = respuestaClientes.data;
        this.clientesFiltrados = this.datosClientes;
        this.mensajes.mensajeGenerico(respuestaClientes.message,'success');
      },

      error =>{
        this.mensajes.mensajeGenerico('error','error');
      }
    );
  }

  filtrarClientes() {
    if (!this.busqueda) {
      this.clientesFiltrados = this.datosClientes;
    } else {
      const textoBusqueda = this.busqueda.toLowerCase();
      this.clientesFiltrados = this.datosClientes.filter((cliente : any) => {
        return cliente.Nombre.toLowerCase().includes(textoBusqueda) ||
               cliente.ApellidoPaterno.toLowerCase().includes(textoBusqueda) ||
               cliente.Telefono.toLowerCase().includes(textoBusqueda) ||
               cliente.Calle.toLowerCase().includes(textoBusqueda) ||
               cliente.NombrePoblacion.toLowerCase().includes(textoBusqueda);
      });
    }
  }

  activarFiltroBusqueda () : boolean {
    return this.datosClientes.length == 0;
  }

  activarBotonLimpiar () : boolean {
    return this.datosClientes.length == 0;
  }

  limpiarTabla() : void {
    this.busqueda = '';
    this.datosClientes = [];
    this.clientesFiltrados = this.datosClientes;
  }
}
