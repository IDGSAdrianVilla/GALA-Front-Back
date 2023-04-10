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
import { PoblacionesComponent } from './modules/catalogos/poblaciones/poblaciones.component';
import { ProblemasComponent } from './modules/catalogos/problemas/problemas.component';
import { TipoInstalacionesComponent } from './modules/catalogos/tipo-instalaciones/tipo-instalaciones.component';
import { RolesComponent } from './modules/catalogos/roles/roles.component';
import { ReportesComponent } from './modules/reportes/reportes/reportes.component';
import { ReportesModificacionComponent } from './modules/reportes/reportes-modificacion/reportes-modificacion.component';
import { UsuariosPerfilComponent } from './modules/usuarios/usuarios-perfil/usuarios-perfil.component';

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
    ClientesModificacionComponent,
    PoblacionesComponent,
    ProblemasComponent,
    TipoInstalacionesComponent,
    RolesComponent,
    ReportesComponent,
    ReportesModificacionComponent,
    UsuariosPerfilComponent
  ]
})
export class HomeModule { }
