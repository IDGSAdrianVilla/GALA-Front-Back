import { HomeComponent } from './home.component';
import { InicioComponent } from './modules/inicio/inicio.component';
import { Routes } from '@angular/router';

export const HomeRoutes: Routes = [
  {
    path : 'gala', component: HomeComponent, 
    children: [
      {
        path : 'inicio', component: InicioComponent
      }
    ]
  }
]
