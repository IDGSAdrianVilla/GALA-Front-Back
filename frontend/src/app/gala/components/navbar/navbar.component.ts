import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MensajesService } from '../../../services/mensajes/mensajes.service';
import { LoginService } from '../../../auth/services/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor (
    public dataService : DataService,
    private mensajes : MensajesService,
    private loginService : LoginService,
    private router : Router
  ){

  }

  ngOnInit(): void {  

  }

  obtenerDatosUsuarios() : void {
    let token = localStorage.getItem('token');

  }

  logout(){
    this.mensajes.mensajeEsperar();
    let token = localStorage.getItem('token');
    this.loginService.logoutBack(token).subscribe(
      logout =>{
        localStorage.removeItem('token');
        localStorage.clear();
        this.router.navigate(['/']);
        this.mensajes.mensajeGenerico('Vuelve pronto', 'info');
      },
    
      error =>{
        this.mensajes.mensajeGenerico('Al parecer ocurrió un error interno, por favor contactarse con el DTIC de Emenet Sistemas', 'error');
      }
    );
  }

  
  prueba() : void {
    this.dataService.claseSidebar = this.dataService.claseSidebar == '' ? 'toggle-sidebar' : '';
  }

    
}
