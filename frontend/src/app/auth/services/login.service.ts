import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'; 
import { Observable } from 'rxjs';
import { MensajesService } from '../../services/mensajes/mensajes.service';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private urlHost = environment.api;

  constructor(
    private http : HttpClient,
    private mensajes : MensajesService
  ) { }

  public login(data : any) : Observable<any> {
    return this.http.post<any>(this.urlHost+'/login', data); 
  }

  public auth(token : any) : Observable<any> {
    return this.http.post<any>(this.urlHost+'/auth', {token});
  }

  public logout(){
    let token = localStorage.getItem('token');
    if(token != undefined){
      this.logoutBack(token).subscribe(
        logout =>{
          this.mensajes.cerrarMensajes();
        },
        
        error =>{
          this.mensajes.mensajeGenerico('Al parecer ocurrió un error interno, por favor contactarse con el DTIC de Emenet Sistemas', 'error');
        }
      )
    }
    localStorage.removeItem('token');
    localStorage.clear();
  }

  public logoutBack(token : any) : Observable<any> {
    return this.http.post<any>(this.urlHost+'/logout',{token});
  }
}
