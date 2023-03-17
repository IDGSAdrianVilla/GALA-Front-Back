import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/gala/services/catalogos/catalogos.service';
import { DataService } from 'src/app/gala/services/data.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import { FuncionesGenericasService } from 'src/app/services/utileria/funciones-genericas.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  @ViewChild('cerrarModal') cerrarModal? : ElementRef;

  public formNuevoRol! : FormGroup;

  public objetoPermisos : any = [
    {
      'tituloRol' : null,
      'rol' : null,
      'permisosRol' : []
    }
  ];

  public busqueda: string = '';
  public rolesFiltrados : any[] = [];
  public modificacionRol : boolean = false;

  constructor (
    private fb : FormBuilder,
    public funcionGenerica : FuncionesGenericasService,
    private mensajes : MensajesService,
    private catalogoService : CatalogosService,
    public dataService : DataService
  ) {

  }

  ngOnInit (): void {
    this.crearFormularioRoles();
  }

  crearFormularioRoles () : void {
    this.formNuevoRol = this.fb.group({
      pkCatRol         : [],
      nombreRol        : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
      descripcionRol   : ['', Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')],
      observacionesRol : ['', Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]
    });
  }

  consultaRoles () : void {

  }

  actualizarObjetoPermisosPadre( modulo : string, event: Event ) : void {
    const checked = (event?.target as HTMLInputElement)?.checked;
    this.objetoPermisos = this.funcionGenerica.actualizarObjetoPermisosPadre(modulo, checked, this.objetoPermisos);
  }

  actualizarObjetoPermisosHijo( modulo : string, permiso : string, event: Event ) : void {
    const checked = (event?.target as HTMLInputElement)?.checked;
    this.objetoPermisos = this.funcionGenerica.actualizarObjetoPermisosHijo(modulo, permiso, checked, this.objetoPermisos);
  }

  cambioObjetoPermisos ( modulo : string, event: Event ) : void {
    const checked = (event?.target as HTMLInputElement)?.checked;

    if ( checked ) {
      switch ( modulo ) {
        case 'clientes':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioClientes);
        break;
        case 'usuarios':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioUsuarios);
        break;
        case 'reportes':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioReportes);
        break;
        case 'instalaciones':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioInstalaciones);
        break;
        case 'catalogos':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioCatalogos);
        break;
        case 'sesiones':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioSesiones);
        break;
        case 'reportesSistema':
          this.objetoPermisos[0].permisosRol.push(this.dataService.objComplementarioReportesSistema);
        break;
      }
    } else {
      const indexAEliminar = this.objetoPermisos[0].permisosRol.findIndex((permiso : any) => permiso.modulo === modulo);

      indexAEliminar !== -1 ? this.objetoPermisos[0].permisosRol.splice(indexAEliminar, 1) : false;
    }
  }

  crearRegistroRol () : void {

  }

  consultaDatosRolModificacion ( PkCatRol : number ) : void {

  }

  modificarRol () : void {

  }

  cargarFormulario () : void {
    
  }

  limpiarFormulario () : void {
    this.formNuevoRol.reset();
  }

  filtrarProblemas () : void {

  }

  activarFiltroBusqueda () : boolean {
    return true;
  }
}
