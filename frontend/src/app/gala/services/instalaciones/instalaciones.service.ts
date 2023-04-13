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
}