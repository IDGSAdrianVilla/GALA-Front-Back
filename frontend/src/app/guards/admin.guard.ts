import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../auth/services/login.service';
import { MensajesService } from '../services/mensajes/mensajes.service';
import { FuncionesGenericasService } from '../services/utileria/funciones-genericas.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private previousUrl: string = '/gala/inicio';

  private exepcionesRutas : string[] = [
    'inicio'
  ];

  constructor (
    private router : Router,
    private mensajes : MensajesService,
    private loginService : LoginService,
    private funcionGenerica : FuncionesGenericasService
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

    const token = localStorage.getItem('token');
    const cadenaPermisos = localStorage.getItem('permisos');

    if (
      ( token == undefined || token == null ) &&
      ( cadenaPermisos == undefined || cadenaPermisos == null )
    ) {
      localStorage.removeItem('token');
      localStorage.clear();
      this.router.navigate(['/']);
      this.mensajes.mensajeGenerico('Para navegar dentro de GALA se necesita inicar sesión antes', 'info');
      return false;
    }

    if ( !this.validarAccesoRuta(url) ) {
      this.router.navigate([this.previousUrl]);
      this.mensajes.mensajeGenerico('Al parecer no tienes permitida esta acción', 'error');
      return false;
    }

    this.loginService.auth(token).subscribe(
      status => {
        if (status) {
          return true;
        } else {
          localStorage.removeItem('token');
          localStorage.clear();
          this.router.navigate(['/']);
          this.mensajes.mensajeGenerico('Al parecer su sesión expiró, necesita volver a iniciar sesión', 'error');
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
  }

  validarAccesoRuta ( ruta : string ) : boolean {
    const nombreModulo = ruta.replace('/gala/', '').split('/')[0];

    if ( !this.exepcionesRutas.includes(nombreModulo) ) {
      const cadenaPermisos : any = localStorage.getItem('permisos');
      const permisos = this.funcionGenerica.obtenerObjetoPermisosDesdeCadena(cadenaPermisos);

      const objetoModulo = permisos[0].permisosRol.filter((item : any) => item.modulo == nombreModulo );

      console.log(objetoModulo);

      if ( objetoModulo.length > 0 ) {
        return objetoModulo[0].status;
      }

      return false;
    }

    this.previousUrl = ruta;
    return true;
  }
}
