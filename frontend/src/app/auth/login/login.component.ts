import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    private router : Router
  ){

  }

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      correo : ['',[Validators.required]],
      password : ['',[Validators.required]]
    });
  }

  login() : any {
    console.log(this.formLogin.value);

    if(this.formLogin.invalid){
      
      return ;
    }

    const data = this.formLogin.value 
    
    
    this.loginService.login(data).subscribe(

      respuesta => {

        const status = respuesta.status
        if(status == 200){
          this.router.navigate(['/gala/inicio']);
        }        
      },
      error => {
        console.log('error');
        console.log(error);
      }
    )
  }
}
