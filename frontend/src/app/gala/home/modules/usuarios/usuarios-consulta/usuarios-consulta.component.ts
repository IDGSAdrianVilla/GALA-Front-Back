import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/gala/services/usuarios/usuarios.service';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';
import { CatalogosService } from '../../../../services/catalogos/catalogos.service';

@Component({
  selector: 'app-usuarios-consulta',
  templateUrl: './usuarios-consulta.component.html',
  styleUrls: ['./usuarios-consulta.component.css']
})
export class UsuariosConsultaComponent implements OnInit{
  opcionesMultiselect : any = [];
  usuariosPorRoles : any = [];
  rolesSeleccionados: string[] = [];
  tituloSelect = '';
  mostrarOpciones = false;

  busqueda: string = '';
  usuariosFiltrados: any[] = [];

  constructor (
    private mensajes : MensajesService,
    private catalogosService : CatalogosService,
    private usuariosService : UsuariosService
  ) {

  }

  ngOnInit(): void {
    this.mensajes.mensajeEsperar();
    this.obternerRoles();
  }

  filtrarUsuarios() {
    if (!this.busqueda) {
      this.usuariosFiltrados = this.usuariosPorRoles;
    } else {
      const textoBusqueda = this.busqueda.toLowerCase();
      this.usuariosFiltrados = this.usuariosPorRoles.filter((usuario : any) => {
        return usuario.Nombre.toLowerCase().includes(textoBusqueda) ||
               usuario.ApellidoPaterno.toLowerCase().includes(textoBusqueda) ||
               usuario.Telefono.toLowerCase().includes(textoBusqueda) ||
               usuario.Calle.toLowerCase().includes(textoBusqueda) ||
               usuario.NombrePoblacion.toLowerCase().includes(textoBusqueda);
      });
    }
  }

  activaLista() {
    this.mostrarOpciones = !this.mostrarOpciones;
  }

  seleccionarOpcion(option: string) {
    const index = this.rolesSeleccionados.indexOf(option);
    if (index === -1) {
      this.rolesSeleccionados.push(option);
    } else {
      this.rolesSeleccionados.splice(index, 1);
    }

    this.tituloSelect = this.opcionesMultiselect.filter((opcion : any) => this.rolesSeleccionados.includes(opcion.PkCatRol)).map((opcion : any) => opcion.NombreRol).join(', ');
  }

  consultaUsuariosPorRoles() : void {
    this.mensajes.mensajeEsperar();
    if(this.rolesSeleccionados.length == 0){
      this.mensajes.mensajeGenerico('Para consultar antes debes seleccionar algún Rol', 'info');
      return;
    }
    
    this.usuariosService.consultaUsuariosPorRoles(this.rolesSeleccionados).subscribe(
      usuariosPorRoles =>{
        this.usuariosPorRoles = usuariosPorRoles.data;
        this.usuariosFiltrados = this.usuariosPorRoles;
        this.mensajes.mensajeGenerico(usuariosPorRoles.message, usuariosPorRoles.status == 200 ? 'success' : 'info');
      },

      error =>{
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  obternerRoles() : void {
    this.catalogosService.obtenerRoles().subscribe(
      roles =>{
        this.opcionesMultiselect = roles.data;
        this.mensajes.cerrarMensajes();
      },

      error =>{
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  activarBotonLimpiar () : boolean {
    return this.usuariosPorRoles.length == 0 && this.rolesSeleccionados.length == 0;
  }

  activarFiltroBusqueda () : boolean {
    return this.usuariosPorRoles.length == 0;
  }

  limpiarTabla() : void {
    this.busqueda = '';
    this.rolesSeleccionados = [];
    this.tituloSelect = '';
    this.usuariosPorRoles = [];
    this.usuariosFiltrados = this.usuariosPorRoles;
  }
}
