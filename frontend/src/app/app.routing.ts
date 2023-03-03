import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './gala/home/home.component';
import { ValidarAuthComponent } from './validar-auth/validar-auth.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: LoginComponent
  }, {
    path: 'gala',
    component: HomeComponent
  }, {
    path: '**',
    component: ValidarAuthComponent
  }
]
