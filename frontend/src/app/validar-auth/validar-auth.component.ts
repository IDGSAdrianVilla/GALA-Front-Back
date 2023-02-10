import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Route, Router } from '@angular/router';
import { MensajesService } from '../services/mensajes/mensajes.service';
import { LoginService } from '../auth/services/login.service';

@Component({
  selector: 'app-validar-auth',
  templateUrl: './validar-auth.component.html',
  styleUrls: ['./validar-auth.component.css']
})
export class ValidarAuthComponent implements OnInit{
  constructor(
    private mensajes : MensajesService,
    private router : Router,
    private loginService : LoginService
  ){

  }

  ngOnInit(): void {
    this.mensajes.mensajeEsperar();
    let token = localStorage.getItem('token');
    if(token != undefined){
      this.loginService.auth(token).subscribe(
        status =>{
          if(status){
            this.router.navigate(['/gala/inicio']);
            this.mensajes.mensajeGenerico('No deberías intentar esto', 'error');
          } else {
            localStorage.removeItem('token');
            localStorage.clear();
            this.router.navigate(['/']);
            this.mensajes.mensajeGenerico('No deberías intentar esto', 'error');
          }
        },

        error =>{
          this.router.navigate(['/']);    
          this.mensajes.mensajeGenerico('No deberías intentar esto', 'error');
        }
      );
      
    } else {
      this.router.navigate(['/']);    
      this.mensajes.mensajeGenerico('No deberías intentar esto', 'error');
    }
  }
}
