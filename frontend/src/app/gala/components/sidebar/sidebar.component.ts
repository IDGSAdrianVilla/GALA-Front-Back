import { Component, OnInit } from '@angular/core';
import { FuncionesGenericasService } from 'src/app/services/utileria/funciones-genericas.service';
import { MensajesService } from '../../../services/mensajes/mensajes.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public permisosObjeto : any;
  protected permisosClientes : any;
  protected permisosUsuarios : any;

  constructor (
    private funcionGenerica : FuncionesGenericasService,
    private mensajes : MensajesService
  ) {

  }

  ngOnInit(): void {
    this.obtenerPermisosModulos();
    this.inicializarSideBarPorObjeto();
  }

  inicializarSideBarPorObjeto () : void {
    const permisosCadena : any = localStorage.getItem('permisos');
    this.permisosObjeto = this.funcionGenerica.obtenerObjetoPermisosDesdeCadena(permisosCadena);
  }

  private async obtenerPermisosModulos () : Promise<any> {
    this.permisosClientes = this.funcionGenerica.obtenerPermisosPorModulo('clientes');
    this.permisosUsuarios = this.funcionGenerica.obtenerPermisosPorModulo('usuarios');
  }

  obtenerPermisoPorModulo ( nombreModulo : string ) : boolean {
    const objetoModulo = this.permisosObjeto[0].permisosRol.filter((item : any) => item.modulo == nombreModulo );

    if ( objetoModulo.length > 0 ) {
      return objetoModulo[0].status;
    }

    return false;
  }

  mandarMensajeProximamente () : void {
    this.mensajes.mensajeV2();
  }
}
