import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MensajesService } from '../../services/mensajes/mensajes.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  
  public formLogin! : FormGroup;

  constructor (
    private loginService : LoginService,
    private fb : FormBuilder,
    private router : Router,
    private mensajes : MensajesService
  ){

  }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if(token != undefined){
      this.mensajes.mensajeEsperar();
      this.loginService.auth(token).subscribe(
        status => {
          if(status){
            this.router.navigate(['/gala/inicio']);
            this.mensajes.mensajeGenerico('Al parecer ya tienes una sesión activa, si deseas ingresar con otra cuenta, tienes que cerrar sesión', 'info');
          } else {
            this.mensajes.cerrarMensajes();
          }
        },
  
        error => {
          this.mensajes.mensajeGenerico('Al parecer ocurrió un error interno, por favor contactarse con el DTIC de Emenet Sistemas', 'error');
        }
      )
    }
    
    this.formLogin = this.fb.group({
      correo : ['',[Validators.required]],
      password : ['',[Validators.required]]
    });
  }

  login() : any {
    this.mensajes.mensajeEsperar();

    if(this.formLogin.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta', 'info');
      return ;
    }    
    
    this.loginService.login(this.formLogin.value).subscribe(
      respuesta => {
        if(respuesta.status == 200){
          console.log(respuesta.data);
          localStorage.setItem('token', respuesta.data);
          this.mensajes.mensajeGenericoToast('Bienvenido', 'success');
          this.router.navigate(['/gala/inicio']);
        } else {
          this.mensajes.mensajeGenerico('Upss! Al parecer las credenciales no son correctas para poder ingresar', 'info');
        }       
      },
      error => {
        this.mensajes.mensajeGenerico('Al parecer ocurrió un error interno, por favor contactarse con el DTIC de Emenet Sistemas', 'error')
      }
    )
  }
}
