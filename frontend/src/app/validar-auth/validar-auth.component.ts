import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Route, Router } from '@angular/router';
import { MensajesService } from '../services/mensajes/mensajes.service';

@Component({
  selector: 'app-validar-auth',
  templateUrl: './validar-auth.component.html',
  styleUrls: ['./validar-auth.component.css']
})
export class ValidarAuthComponent implements OnInit{
  constructor(
    private mensajes : MensajesService,
    private router : Router
  ){

  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        console.log(this.router.url);
      }
    });
  
    //window.history.back();
    this.mensajes.mensajeEsperar();
  }
}
