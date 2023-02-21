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
    
  }

}
