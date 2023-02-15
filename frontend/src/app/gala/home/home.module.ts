import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutes } from './home.routing';
import { RouterModule } from '@angular/router';
import { UsuariosRegistroComponent } from './modules/usuarios/usuarios-registro/usuarios-registro.component';
import { UsuariosModificacionComponent } from './modules/usuarios/usuarios-modificacion/usuarios-modificacion.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(HomeRoutes)
  ],
  declarations: [
    UsuariosRegistroComponent,
    UsuariosModificacionComponent
  ]
})
export class HomeModule { }
