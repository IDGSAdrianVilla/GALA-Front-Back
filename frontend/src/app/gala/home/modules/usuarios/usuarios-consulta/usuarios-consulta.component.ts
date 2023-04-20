import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/gala/services/usuarios/usuarios.service';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';
import { CatalogosService } from '../../../../services/catalogos/catalogos.service';
import { FuncionesGenericasService } from '../../../../../services/utileria/funciones-genericas.service';

@Component({
  selector: 'app-usuarios-consulta',
  templateUrl: './usuarios-consulta.component.html',
  styleUrls: ['./usuarios-consulta.component.css']
})
export class UsuariosConsultaComponent implements OnInit{
  public datosUsuarios : any = [];

  public busqueda: string = '';
  public usuariosFiltrados: any[] = [];
  protected permisos : any;

  constructor (
    private mensajes : MensajesService,
    private usuariosService : UsuariosService,
    public funcionGenerica : FuncionesGenericasService
  ) {

  }

  async ngOnInit () : Promise<void> {
    this.mensajes.mensajeEsperar();
    
    await Promise.all([
      this.obtenerPermisosModulo(),
      this.consultaUsuarios()
    ]);
  }

  private async obtenerPermisosModulo () : Promise<any> {
    this.permisos = this.funcionGenerica.obtenerPermisosPorModulo('usuarios');
  }

  consultaUsuarios() : Promise<any> {
    this.mensajes.mensajeEsperar();
    const token = localStorage.getItem('token');

    return this.usuariosService.consultaUsuarios(token).toPromise().then(
      respuesta =>{
        this.datosUsuarios = respuesta.data;
        this.usuariosFiltrados = this.datosUsuarios;
        this.mensajes.mensajeGenericoToast(respuesta.message, 'success');
      },

      error =>{
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  filtrarUsuarios() {
    if (!this.busqueda) {
      this.usuariosFiltrados = this.datosUsuarios;
    } else {
      const textoBusqueda = this.busqueda.toLowerCase();
      this.usuariosFiltrados = this.datosUsuarios.filter((usuario : any) => {
        return usuario.Nombre?.toLowerCase().includes(textoBusqueda) ||
               usuario.ApellidoPaterno?.toLowerCase().includes(textoBusqueda) ||
               usuario.Telefono?.toLowerCase().includes(textoBusqueda) ||
               usuario.Calle?.toLowerCase().includes(textoBusqueda) ||
               usuario.NombrePoblacion?.toLowerCase().includes(textoBusqueda);
      });
    }
  }

  activarBotonLimpiar () : boolean {
    return this.datosUsuarios.length == 0;
  }

  activarFiltroBusqueda () : boolean {
    return this.datosUsuarios.length == 0;
  }

  limpiarTabla() : void {
    this.busqueda = '';
    this.datosUsuarios = [];
    this.usuariosFiltrados = this.datosUsuarios;
  }
}
