import { Component, OnInit } from '@angular/core';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import { LoginService } from '../../../../auth/services/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(
    private mensajes : MensajesService,
    private loginService : LoginService,
    private router : Router
  ){

  }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if(token != undefined){
      this.mensajes.mensajeEsperar();
      this.loginService.auth(token).subscribe(
        status => {
          if(status){
            this.mensajes.cerrarMensajes();            
          } else {
            localStorage.removeItem('token');
            localStorage.clear();
            this.router.navigate(['/']);
            this.mensajes.mensajeGenerico('Para navegar dentro de GALA se necesita inicar sesión antes', 'info');
          }
        },
  
        error => {
          this.mensajes.mensajeGenerico('Al parecer ocurrió un error interno, por favor contactarse con el DTIC de Emenet Sistemas', 'error');
        }
      )
    } else {
      this.router.navigate(['/']);
      this.mensajes.mensajeGenerico('Para navegar dentro de GALA se necesita inicar sesión antes', 'info');
    }
  }

}
