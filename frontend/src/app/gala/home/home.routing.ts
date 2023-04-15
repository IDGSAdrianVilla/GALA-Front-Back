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
import { ProblemasComponent } from './modules/catalogos/problemas/problemas.component';
import { TipoInstalacionesComponent } from './modules/catalogos/tipo-instalaciones/tipo-instalaciones.component';
import { RolesComponent } from './modules/catalogos/roles/roles.component';
import { ReportesComponent } from './modules/reportes/reportes/reportes.component';
import { ReportesModificacionComponent } from './modules/reportes/reportes-modificacion/reportes-modificacion.component';
import { UsuariosPerfilComponent } from './modules/usuarios/usuarios-perfil/usuarios-perfil.component';
import { InstalacionesComponent } from './modules/instalaciones/instalaciones/instalaciones.component';
import { InstalacionesModificacionComponent } from './modules/instalaciones/instalaciones-modificacion/instalaciones-modificacion.component';

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
        path: 'usuarios/perfil',
        component: UsuariosPerfilComponent
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
      },{
        path : 'catalogos/problemas',
        component: ProblemasComponent
      },
      {
        path : 'catalogos/clasificacionInstalaciones',
        component: TipoInstalacionesComponent
      },
      {
        path: 'catalogos/roles',
        component: RolesComponent
      },{
        path: 'reportes',
        component: ReportesComponent
      },{
        path: 'reportes/modificacion/:pkreporte',
        component: ReportesModificacionComponent
      },{
        path: 'instalaciones',
        component: InstalacionesComponent
      },{
        path: 'instalaciones/modificacion/:pkinstalacion',
        component: InstalacionesModificacionComponent
      }
    ]
  }
]
