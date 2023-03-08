import { HomeComponent } from './home.component';
import { InicioComponent } from './modules/inicio/inicio.component';
import { Routes } from '@angular/router';
import { AdminGuard } from '../../guards/admin.guard';
import { UsuariosRegistroComponent } from './modules/usuarios/usuarios-registro/usuarios-registro.component';
import { UsuariosConsultaComponent } from './modules/usuarios/usuarios-consulta/usuarios-consulta.component';
import { UsuariosModificacionComponent } from './modules/usuarios/usuarios-modificacion/usuarios-modificacion.component';
import { ClientesRegistroComponent } from './modules/clientes/clientes-registro/clientes-registro.component';
import { ClientesConsultaComponent } from './modules/clientes/clientes-consulta/clientes-consulta.component';
import { ClientesModificacionComponent } from './modules/clientes/clientes-modificacion/clientes-modificacion.component';
import { PoblacionesComponent } from './modules/catalogos/poblaciones/poblaciones.component';

export const HomeRoutes: Routes = [
  {
    path : 'gala',
    canActivate : [AdminGuard],
    component: HomeComponent,
    children: [
      {
        path : 'inicio',
        component: InicioComponent
      },
      {
        path : 'usuarios/registro',
        component: UsuariosRegistroComponent
      },
      {
        path : 'usuarios',
        component : UsuariosConsultaComponent
      },
      {
        path : 'usuarios/modificacion/:pkusuario',
        component: UsuariosModificacionComponent
      },
      {
        path : 'clientes/registro',
        component: ClientesRegistroComponent
      },
      {
        path : 'clientes',
        component: ClientesConsultaComponent
      },
      {
        path : 'clientes/modificacion/:pkcliente',
        component: ClientesModificacionComponent
      },
      {
        path : 'catalogos/poblaciones',
        component: PoblacionesComponent
      },
    ]
  }
]
