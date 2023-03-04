import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutes } from './home.routing';
import { RouterModule } from '@angular/router';
import { UsuariosRegistroComponent } from './modules/usuarios/usuarios-registro/usuarios-registro.component';
import { UsuariosModificacionComponent } from './modules/usuarios/usuarios-modificacion/usuarios-modificacion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosConsultaComponent } from './modules/usuarios/usuarios-consulta/usuarios-consulta.component';
import { ClientesRegistroComponent } from './modules/clientes/clientes-registro/clientes-registro.component';
import { ClientesConsultaComponent } from './modules/clientes/clientes-consulta/clientes-consulta.component';
import { ClientesModificacionComponent } from './modules/clientes/clientes-modificacion/clientes-modificacion.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(HomeRoutes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    UsuariosRegistroComponent,
    UsuariosModificacionComponent,
    UsuariosConsultaComponent,
    ClientesRegistroComponent,
    ClientesConsultaComponent,
    ClientesModificacionComponent
  ]
})
export class HomeModule { }
