import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstalacionesService {
  private urlHost = environment.api;
  
  constructor(
    private http : HttpClient
  ) { }

  public registrarNuevaInstalacion( datosNuevaInstalacion : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/instalaciones/registrarNuevaInstalacion', datosNuevaInstalacion);
  }

  public consultarInstalacionesPorStatus( status : any ) : Observable<any>{
    return this.http.get<any>(this.urlHost+`/instalaciones/consultarInstalacionesPorStatus/${status}`);
  }

  public cargaComponenteModificacionInstalacion( pkInstalacion : any ) : Observable<any>{
    return this.http.get<any>(this.urlHost+`/instalaciones/cargaComponenteModificacionInstalacion/${pkInstalacion}`);
  }

  public validarInstalacionExistente ( datosInstalacionModificada : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/instalaciones/validarInstalacionExistente', datosInstalacionModificada);
  }

  public validarComenzarInstalacion ( pkInstalacion : number ) : Observable<any>{
    return this.http.get<any>(this.urlHost+`/instalaciones/validarComenzarInstalacion/${pkInstalacion}`);
  }

  public comenzarInstalacion ( datosComenzarInstalacion : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/instalaciones/comenzarInstalacion', datosComenzarInstalacion);
  }

  public validarDejarInstalacion ( datosDejarInstalacion : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/instalaciones/validarDejarInstalacion', datosDejarInstalacion);
  }

  public dejarInstalacion ( datosDejarInstalacion : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/instalaciones/dejarInstalacion', datosDejarInstalacion);
  }
}