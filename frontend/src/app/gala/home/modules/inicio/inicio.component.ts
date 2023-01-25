import { Component, OnInit } from '@angular/core';
import { MensajesService } from 'src/app/services/mensajesServices/mensajes.service';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(
    private mensajes : MensajesService
  ){

  }

  ngOnInit(): void {
    
  }

}
