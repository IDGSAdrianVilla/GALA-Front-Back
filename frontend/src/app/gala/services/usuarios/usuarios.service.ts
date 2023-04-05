import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private urlHost = environment.api;
  
  constructor(
    private http : HttpClient
  ) { }

  public obtenerInformacion( token : any ) : Observable<any> {
    return this.http.post<any>(this.urlHost+'/usuarios/obtenerInformacion',{token});
  }

  public crearNuevoUsuario( datosNuevoUsuario : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/usuarios/crearUsuarioNuevo', datosNuevoUsuario);
  }

  public consultaUsuariosPorRoles( roles : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/usuarios/consultaUsuariosPorRoles', roles);
  }

  public consultarDatosUsuarioModificacion( pkusuario : number) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/usuarios/consultarDatosUsuarioModificacion', {pkusuario});
  }

  public modificarDatosUsuario(datosModificacion : any) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/usuarios/modificarDatosUsuario', datosModificacion);
  }

  public modificarInformacionPerfil(datosModificacionPerfil : any) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/usuarios/modificarInformacionPerfil', datosModificacionPerfil);
  }
}
