import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuncionesGenericasService } from 'src/app/services/utileria/funciones-genericas.service';

@Component({
  selector: 'app-poblaciones',
  templateUrl: './poblaciones.component.html',
  styleUrls: ['./poblaciones.component.css']
})
export class PoblacionesComponent implements OnInit{
  public formNuevaPoblacion! : FormGroup;

  busqueda: string = '';
  datosPoblaciones: string[] = [];
  poblacionesFiltradas: any[] = [];

  constructor (
    public fb : FormBuilder,
    public funcionGenerica : FuncionesGenericasService
  ) {

  }

  ngOnInit(): void {
    
  }

  filtrarUsuarios() {
    if (!this.busqueda) {
      this.poblacionesFiltradas = this.datosPoblaciones;
    } else {
      const textoBusqueda = this.busqueda.toLowerCase();
      this.poblacionesFiltradas = this.datosPoblaciones.filter((usuario : any) => {
        return usuario.Nombre.toLowerCase().includes(textoBusqueda) ||
               usuario.ApellidoPaterno.toLowerCase().includes(textoBusqueda) ||
               usuario.Telefono.toLowerCase().includes(textoBusqueda) ||
               usuario.Calle.toLowerCase().includes(textoBusqueda) ||
               usuario.NombrePoblacion.toLowerCase().includes(textoBusqueda);
      });
    }
  }

  activarBotonLimpiar () : boolean {
    return this.datosPoblaciones.length == 0;
  }

  activarFiltroBusqueda () : boolean {
    return this.datosPoblaciones.length == 0;
  }

  limpiarTabla() : void {
    this.busqueda = '';
    this.datosPoblaciones = [];
    this.poblacionesFiltradas = this.datosPoblaciones;
  }
}
