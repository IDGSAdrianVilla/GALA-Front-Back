import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FuncionesGenericasService } from '../../../../../services/utileria/funciones-genericas.service';
import { UsuariosService } from '../../../../services/usuarios/usuarios.service';
import { CatalogosService } from '../../../../services/catalogos/catalogos.service';
import { MensajesService } from '../../../../../services/mensajes/mensajes.service';

@Component({
  selector: 'app-usuarios-perfil',
  templateUrl: './usuarios-perfil.component.html',
  styleUrls: ['./usuarios-perfil.component.css']
})
export class UsuariosPerfilComponent implements OnInit{
  public formInformacionRegistro! : FormGroup;
  public formDireccionRegistro! : FormGroup;
  public formCredencialesRegistro! : FormGroup;
  
  public poblaciones : any = [];
  public roles : any = [];
  public prevUsuarioNuevo : any = {};
  public datosUsuarioModificacionPerfil : any = [];
  public pkperfil : number = 0;

  constructor(
    private fb : FormBuilder,
    private mensajes : MensajesService,
    private catalogosService : CatalogosService,
    private usuariosService : UsuariosService,
    public funcionGenerica : FuncionesGenericasService,
    private router : Router
  ){

  }

  async ngOnInit(): Promise<void> {
    this.mensajes.mensajeEsperar();
  
    this.crearFormInformacionRegistro();
    this.crearFormDireccionRegistro();
    this.crearFormCredencialesRegistro();
  
    await Promise.all([
      this.obtenerPoblaciones(), 
      this.obtenerRoles(), 
      this.consultarDatosUsuarioModificacionPerfil()
    ]);

    this.mensajes.mensajeGenericoToast('Se consultarón los datos con éxito', 'success');
  }
  

  crearFormInformacionRegistro() : void {
    this.formInformacionRegistro = this.fb.group({
      nombrePerfil          : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      apellidoPaternoPerfil : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      apellidoMaternoPerfil : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      telefonoPerfil        : ['', [Validators.required, Validators.pattern('[0-9]*')]],
      sexoPerfil            : ['', [Validators.required]],
      fechaNacimientoPerfil : ['', [Validators.required]],
      observacionesPerfil   : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
    });
  }
  
  crearFormDireccionRegistro() : void {
    this.formDireccionRegistro = this.fb.group({
      poblacionPerfil                : ['', [Validators.required]],
      coordenadasPerfil              : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      callePerfil                    : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      referenciasDomicilioPerfil     : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      caracteristicasDomicilioPerfil : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
    });
  }

  crearFormCredencialesRegistro() : void {
    this.formCredencialesRegistro = this.fb.group({
      correoPerfil      : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*'), Validators.email]],
      passwordPerfil    : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
      valPasswordPerfil : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
    });
  }
  
  obtenerPoblaciones(): Promise<any> {
    return this.catalogosService.obtenerPoblaciones().toPromise().then(
      poblaciones => {
        this.poblaciones = poblaciones.data;
      },
      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }
  
  obtenerRoles(): Promise<any> {
    return this.catalogosService.obtenerRoles().toPromise().then(
      roles => {
        this.roles = roles.data;
      },
      error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  

  consultarDatosUsuarioModificacionPerfil() : Promise<any> {
    const token = localStorage.getItem('token');
    
    return this.usuariosService.obtenerInformacion(token).toPromise().then(
      usuarioModificacionPerfil =>{
        this.datosUsuarioModificacionPerfil = usuarioModificacionPerfil[0];
        this.cargarFormulario();
        this.prevNuevoUsuario();
        this.mensajes.mensajeGenericoToast(usuarioModificacionPerfil.message, 'success');
      },

      error =>{
        this.mensajes.mensajeGenerico('error', 'error');
      }
    )
  }

  cargarFormulario() : void {
    this.formInformacionRegistro.get('nombrePerfil')?.setValue(this.datosUsuarioModificacionPerfil.Nombre);
    this.formInformacionRegistro.get('apellidoPaternoPerfil')?.setValue(this.datosUsuarioModificacionPerfil.ApellidoPaterno);
    this.formInformacionRegistro.get('apellidoMaternoPerfil')?.setValue(this.datosUsuarioModificacionPerfil.ApellidoMaterno);
    this.formInformacionRegistro.get('telefonoPerfil')?.setValue(this.datosUsuarioModificacionPerfil.Telefono);
    this.formInformacionRegistro.get('sexoPerfil')?.setValue(this.datosUsuarioModificacionPerfil.Sexo);
    this.formInformacionRegistro.get('fechaNacimientoPerfil')?.setValue(this.datosUsuarioModificacionPerfil.FechaNacimiento);
    this.formInformacionRegistro.get('observacionesPerfil')?.setValue(this.datosUsuarioModificacionPerfil.Observaciones);
    
    this.formDireccionRegistro.get('poblacionPerfil')?.setValue(this.datosUsuarioModificacionPerfil.PkCatPoblacion);
    this.formDireccionRegistro.get('coordenadasPerfil')?.setValue(this.datosUsuarioModificacionPerfil.Coordenadas);
    this.formDireccionRegistro.get('callePerfil')?.setValue(this.datosUsuarioModificacionPerfil.Calle);
    this.formDireccionRegistro.get('referenciasDomicilioPerfil')?.setValue(this.datosUsuarioModificacionPerfil.ReferenciasDomicilio);
    this.formDireccionRegistro.get('caracteristicasDomicilioPerfil')?.setValue(this.datosUsuarioModificacionPerfil.CaracteristicasDomicilio);

    this.formCredencialesRegistro.get('correoPerfil')?.setValue(this.datosUsuarioModificacionPerfil.Correo);
  }

  prevNuevoUsuario () {
    this.prevUsuarioNuevo.nombrePerfil          = this.formInformacionRegistro.get('nombrePerfil')?.value;
    this.prevUsuarioNuevo.apellidoPaternoPerfil = this.formInformacionRegistro.get('apellidoPaternoPerfil')?.value;
    this.prevUsuarioNuevo.apellidoMaternoPerfil = this.formInformacionRegistro.get('apellidoMaternoPerfil')?.value;
    this.prevUsuarioNuevo.sexoPerfil            = this.formInformacionRegistro.get('sexoPerfil')?.value;
    this.prevUsuarioNuevo.telefonoPerfil        = this.formInformacionRegistro.get('telefonoPerfil')?.value;
    const poblacionSelect                       = (document.getElementById('poblacionPerfil') as HTMLSelectElement).selectedOptions[0].text;
    this.prevUsuarioNuevo.poblacionPerfil       = poblacionSelect != 'Seleccione una Población' ? poblacionSelect : '';
  }

  modificarInformacionPerfil() : void {
    if(this.formInformacionRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Información Personal.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    if(this.formDireccionRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Dirección Personal.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    if(this.formCredencialesRegistro.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de las Credenciales.', 'info', 'Los campos requeridos están marcados con un *');
      return;
    }

    this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos','question','Modificar mi perfil').then(
      respuestaMensaje =>{
        if(respuestaMensaje.isConfirmed){
          this.mensajes.mensajeEsperar();

          const datosModificacionPerfil : any = {
            informacionPerfil: this.formInformacionRegistro.value,
            informacionDireccion: this.formDireccionRegistro.value,
            informacionCredenciales: this.formCredencialesRegistro.value,
            sesionActiva: localStorage.getItem('token')
          };
          
          this.usuariosService.modificarInformacionPerfil(datosModificacionPerfil).subscribe(
            respuesta =>{
              this.mensajes.mensajeGenerico(respuesta.message, 'success');
            },

            error =>{
              this.mensajes.mensajeGenerico('error', 'error');
            }
          );
        }
      }
    )
  }  
}
