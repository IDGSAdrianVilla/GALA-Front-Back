import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MensajesService } from '../../../services/mensajes/mensajes.service';
import { LoginService } from '../../../auth/services/login.service';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  informacionUsuario : any = [];

  constructor (
    public dataService : DataService,
    private mensajes : MensajesService,
    private loginService : LoginService,
    private router : Router,
    private usuariosService : UsuariosService
  ){

  }

  ngOnInit(): void {  
    this.obtenerDatosUsuarios();
  }

  obtenerDatosUsuarios() : void {
    let token = localStorage.getItem('token');
    if(token != undefined){
      this.usuariosService.obtenerInformacion(token).subscribe(
        datosUsuario =>{
          this.informacionUsuario = datosUsuario;
        },

        error =>{
          localStorage.removeItem('token');
          localStorage.clear();
          this.router.navigate(['/']);
          this.mensajes.mensajeGenerico('Al parecer su sesión expiró, necesita volver a iniciar sesión', 'error');
        }
      )
      console.log(this.informacionUsuario[0].NombreEmpleado);
    }
  }

  logout() : void {
    this.mensajes.mensajeEsperar();
    let token = localStorage.getItem('token');
    this.loginService.logoutBack(token).subscribe(
      logout =>{
        localStorage.removeItem('token');
        localStorage.clear();
        this.router.navigate(['/']);
        this.mensajes.mensajeGenerico('Vuelva pronto', 'info');
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
