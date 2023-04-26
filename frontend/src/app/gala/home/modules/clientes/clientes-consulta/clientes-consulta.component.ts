import { Component, OnInit } from '@angular/core';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';
import { ClientesService } from '../../../../services/clientes/clientes.service';
import { FuncionesGenericasService } from '../../../../../services/utileria/funciones-genericas.service';

@Component({
  selector: 'app-clientes-consulta',
  templateUrl: './clientes-consulta.component.html',
  styleUrls: ['./clientes-consulta.component.css']
})
export class ClientesConsultaComponent implements OnInit{
  public busqueda : string = '';
  public clientesFiltrados : any[] = [];
  public datosClientes : any = [];
  protected permisos : any;

  constructor (
    private mensajes : MensajesService,
    public funcionGenerica : FuncionesGenericasService,
    private clientesService : ClientesService
  ) {

  }

  ngOnInit(): void {
    this.obtenerPermisosModulo();
    this.consultaClientes();
  }

  private async obtenerPermisosModulo () : Promise<any> {
    this.permisos = this.funcionGenerica.obtenerPermisosPorModulo('clientes');
  }

  consultaClientes() : void {
    this.mensajes.mensajeEsperar();
    this.clientesService.consultarClientes().subscribe(
      respuestaClientes =>{
        this.datosClientes = respuestaClientes.data;
        this.clientesFiltrados = this.datosClientes;
        this.mensajes.mensajeGenericoToast(respuestaClientes.message,'success');
      },

      error =>{
        this.mensajes.mensajeGenerico('error','error');
      }
    );
  }

  filtrarClientes () : void {
    if (!this.busqueda) {
      this.clientesFiltrados = this.datosClientes;
    } else {
      const textoBusqueda = this.funcionGenerica.formatearMinusculasSinAcentos(this.busqueda);
      this.clientesFiltrados = this.datosClientes.filter((cliente : any) => {
        return this.funcionGenerica.formatearMinusculasSinAcentos(cliente.Nombre).includes(textoBusqueda) ||
               this.funcionGenerica.formatearMinusculasSinAcentos(cliente.ApellidoPaterno).includes(textoBusqueda) ||
               this.funcionGenerica.formatearMinusculasSinAcentos(cliente.Telefono).includes(textoBusqueda) ||
               this.funcionGenerica.formatearMinusculasSinAcentos(cliente.Calle).includes(textoBusqueda) ||
               this.funcionGenerica.formatearMinusculasSinAcentos(cliente.NombrePoblacion).includes(textoBusqueda);
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
