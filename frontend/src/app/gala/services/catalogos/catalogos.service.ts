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

  public modificarPoblacion( datosModificados : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/catalogos/poblaciones/modificarPoblacion', datosModificados);
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

  public crearNuevoTipoInstalacion( dataRegistro : any) : Observable<any> {
    return this.http.post<any>(this.urlHost+'/catalogos/tipoInstalaciones/crearNuevoTipoInstalacion', dataRegistro);
  }

  public consultaDatosTipoInstalacionModificacion( PkCatClasificacionInstalacion : number) :Observable<any>{
    return this.http.post<any>(this.urlHost+'/catalogos/tipoInstalaciones/consultaDatosTipoInstalacionModificacion',{PkCatClasificacionInstalacion});
  }

  public modificarTipoInstalacion(datosModificados : any) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/catalogos/tipoInstalaciones/modificarTipoInstalacion',datosModificados);
  }

  public consultaTiposDeInstalacion() : Observable<any> {
    return this.http.get<any>(this.urlHost+'/catalogos/obtenerTipoInstalaciones');
  }

  public crearRegistroRol( dataRegistro : any ) : Observable<any> {
    return this.http.post<any>(this.urlHost+'/catalogos/roles/crearRegistroRol', dataRegistro);
  }

  public consultaDatosRolModificacion( PkCatRol : number ) : Observable<any> {
    return this.http.post<any>(this.urlHost+'/catalogos/roles/consultaDatosRolModificacion', PkCatRol);
  }

  public validaRolExistente( dataModificacion : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/catalogos/roles/validaRolExistente', dataModificacion);
  }
  
  public modificarRol( dataModificacion : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/catalogos/roles/modificarRol', dataModificacion);
  }

  public obtenerPaquetes() : Observable<any> {
    return this.http.get<any>(this.urlHost+'/catalogos/obtenerPaquetes');
  }
}
