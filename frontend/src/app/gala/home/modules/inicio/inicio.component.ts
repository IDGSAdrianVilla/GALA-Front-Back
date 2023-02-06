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
    private inicioService : LoginService,
    private router : Router
  ){

  }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if(token != undefined){
      this.inicioService.auth(token).subscribe(
        respuesta => {
    
        },
    
        error => {
    
        }
      )
    } else {
      this.router.navigate(['/']);
      this.mensajes.mensajeGenerico('No deberías intentar esto', 'error');
    }
  }

}
