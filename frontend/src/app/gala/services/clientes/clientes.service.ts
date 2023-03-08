import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private urlHost = environment.api;

  constructor(
    private http : HttpClient
  ) { }

  public crearNuevoCliente( datosNuevoCliente : any ) : Observable<any> {
    return this.http.post<any>(this.urlHost+'/clientes/crearNuevoCliente', datosNuevoCliente);
  }

  public consultarClientes() : Observable<any> {
    return this.http.get<any>(this.urlHost+'/clientes/consultarClientes');
  }
  
}
