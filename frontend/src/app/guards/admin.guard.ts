import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../auth/services/login.service';
import { MensajesService } from '../services/mensajes/mensajes.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor (
    private router : Router,
    private mensajes : MensajesService,
    private loginService : LoginService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.validarToken(event.url);
      }
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url = state.url;
    return this.validarToken(url);
  }

  validarToken(url: string): any {
    if (url === '/') {
      return true;
    }

    let token = localStorage.getItem('token');
    if (token != undefined) {
      this.loginService.auth(token).subscribe(
        status => {
          if (status) {
            return true;
          } else {
            localStorage.removeItem('token');
            localStorage.clear();
            this.router.navigate(['/']);
            this.mensajes.mensajeGenerico('Para navegar dentro de GALA se necesita inicar sesión antes', 'info');
            return false;
          }
        },
        error => {
          localStorage.removeItem('token');
          localStorage.clear();
          this.router.navigate(['/']);
          this.mensajes.mensajeGenerico('Al parecer ocurrió un error interno, por favor contactarse con el DTIC de Emenet Sistemas', 'error');
          return false;
        }
      );
    } else {
      localStorage.removeItem('token');
      localStorage.clear();
      this.router.navigate(['/']);
      this.mensajes.mensajeGenerico('Para navegar dentro de GALA se necesita inicar sesión antes', 'info');
      return false;
    }
  }
}
