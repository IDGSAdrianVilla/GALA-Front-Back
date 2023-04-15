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

  constructor (
    private funcionGenerica : FuncionesGenericasService,
    private mensajes : MensajesService
  ) {

  }

  ngOnInit(): void {
    this.inicializarSideBarPorObjeto();
  }

  inicializarSideBarPorObjeto () : void {
    const permisosCadena : any = localStorage.getItem('permisos');
    this.permisosObjeto = this.funcionGenerica.obtenerObjetoPermisosDesdeCadena(permisosCadena);
  }

  obtenerPermisoPorModulo ( nombreModulo : string ) : boolean {
    const objetoModulo = this.permisosObjeto[0].permisosRol.filter((item : any) => item.modulo == nombreModulo );

    console.log(objetoModulo);
    if ( objetoModulo.length > 0 ) {
      return objetoModulo[0].status;
    }

    return false;
  }

  mandarMensajeProximamente () : void {
    this.mensajes.mensajeV2();
  }
}
