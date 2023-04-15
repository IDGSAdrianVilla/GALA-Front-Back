import { Component, OnInit } from '@angular/core';
import { FuncionesGenericasService } from 'src/app/services/utileria/funciones-genericas.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public permisosObjeto : any;

  constructor (
    private funcionGenerica : FuncionesGenericasService
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
    console.log(nombreModulo);
    console.log(this.permisosObjeto);
    const objetoModulo = this.permisosObjeto[0].permisosRol.filter((item : any) => item.modulo == nombreModulo );

    console.log(objetoModulo);
    if ( objetoModulo.length > 0 ) {
      return objetoModulo[0].status;
    }

    return false;
  }

}
