import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private urlHost = environment.api;

  constructor(
    private http : HttpClient
  ) { }

  public login(data : any) : Observable<any> {
    return this.http.post<any>(this.urlHost+'/login', data); 
  }
}
