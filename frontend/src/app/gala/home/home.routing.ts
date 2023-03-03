import { HomeComponent } from './home.component';
import { InicioComponent } from './modules/inicio/inicio.component';
import { Routes } from '@angular/router';
import { AdminGuard } from '../../guards/admin.guard';
import { UsuariosRegistroComponent } from './modules/usuarios/usuarios-registro/usuarios-registro.component';
import { UsuariosConsultaComponent } from './modules/usuarios/usuarios-consulta/usuarios-consulta.component';
import { UsuariosModificacionComponent } from './modules/usuarios/usuarios-modificacion/usuarios-modificacion.component';

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
      }
    ]
  }
]
