import { HomeComponent } from './home.component';
import { InicioComponent } from './modules/inicio/inicio.component';
import { Routes } from '@angular/router';
import { UsuariosRegistroComponent } from './modules/usuarios/usuarios-registro/usuarios-registro.component';
import { UsuariosModificacionComponent } from './modules/usuarios/usuarios-modificacion/usuarios-modificacion.component';
import { AdminGuard } from '../../guards/admin.guard';

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
        path : 'usuarios/modificacion',
        component: UsuariosModificacionComponent
      }
    ]
  }
]
