import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  private urlHost = environment.api;
  
  constructor(
    private http : HttpClient
  ) { }

  public obtenerPoblaciones() : Observable<any> {
    return this.http.get<any>(this.urlHost+'/catalogos/obtenerPoblaciones');
  }

  public obtenerRoles() : Observable<any>{
    return this.http.get<any>(this.urlHost+'/catalogos/obtenerRoles');
  }

  public crearNuevaPoblacion( dataRegistro : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/catalogos/poblaciones/crearNuevaPoblacion', dataRegistro);
  }

  public consultaDatosPoblacionModificacion( PkCatPoblacion : number ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/catalogos/poblaciones/consultaDatosPoblacionModificacion', {PkCatPoblacion});
  }

  public modificarPoblacion( dataRegistro : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/catalogos/poblaciones/modificarPoblacion', dataRegistro);
  }

  public crearNuevoProblema( dataRegistro : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/catalogos/problemas/crearNuevoProblema', dataRegistro);
  }

  public obtenerProblemas() : Observable<any> {
    return this.http.get<any>(this.urlHost+'/catalogos/obtenerProblemas');
  }

  public consultaDatosProblemaModificacion( PkCatProblema : number ) : Observable<any> {
    return this.http.post<any>(this.urlHost+'/catalogos/problemas/consultaDatosProblemaModificacion', {PkCatProblema});
  }

  public modificarProblema( datosModificados : any ) : Observable<any> {
    return this.http.post<any>(this.urlHost+'/catalogos/problemas/modificarProblema', datosModificados);
  }
}
