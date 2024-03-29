import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as unorm from 'unorm';

@Injectable({
  providedIn: 'root'
})
export class FuncionesGenericasService {

  constructor(
    private router : Router
  ) {

  }

  public soloLetras(event: KeyboardEvent) {
    const pattern = /[a-zA-Zá-úÁ-Ú ]/;
    const inputChar = String.fromCharCode(event.charCode);
  
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  public soloTexto(event: KeyboardEvent) {
    const pattern = /[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]/;
    const inputChar = String.fromCharCode(event.charCode);
  
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  public soloNumeros(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
  
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  actualizoPadre (event: Event) {
    const id = (event?.target as HTMLInputElement)?.id;
    const checked = (event?.target as HTMLInputElement)?.checked;

    const modulo = id.split("-")[1];

    if ( checked ) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"].permiso-'+modulo);
      for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i] as HTMLInputElement;
        checkbox.checked = true;
      }
    } else {
      const checkboxes = document.querySelectorAll('input[type="checkbox"].permiso-'+modulo);
      for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i] as HTMLInputElement;
        checkbox.checked = false;
      }
    }
  }

  actualizoHijo (event: Event) {
    const clase = (event?.target as HTMLInputElement)?.classList.item(1)?.toString();
    const checked = (event?.target as HTMLInputElement)?.checked;

    const modulo = clase?.split("-")[1];

    if ( checked ) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"].permiso-'+modulo);
      let count = 0;
      
      for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i] as HTMLInputElement;
        count = checkbox.checked ? count + 1 : count ;
      }

      if ( count != 0 ) {
        const checkbox = document.getElementById('modulo-'+modulo) as HTMLInputElement;
        checkbox.checked = true;
        const checkboxHijo = document.getElementById('permiso-'+modulo+'-lectura') as HTMLInputElement;
        checkboxHijo.checked = true;
      }
    }
  }

  actualizarObjetoPermisosPadre( modulo : string, status : boolean, data : any) : any {
    data[0].permisosRol.forEach((padre : any) => {
      if ( padre.modulo == modulo ) {
        padre.status = status;
        padre.permisosModulo.forEach((hijo : any) => {
          hijo.status = status;
        });
      }
    });
    
    return data;
  }

  actualizarObjetoPermisosHijo( modulo : string, permiso : string, status: boolean, data : any ) : any {
    data[0].permisosRol.forEach((padre : any) => {
      if ( padre.modulo == modulo ) {
        padre.permisosModulo.forEach((hijo : any) => {
          if ( hijo.permiso == permiso ) {
            hijo.status = status;
          }
        });
      }
    });

    return data;
  }

  obtenerObjetoPermisosDesdeCadena ( cadenaObjeto : string ) : any {
    return JSON.parse( cadenaObjeto.replace(/'/g, '"') );
  }

  redireccionPorRuta ( ruta : string ) : void {
    this.router.navigate(['/gala/'+ruta]);
  }

  obtenerPermisosPorModulo ( nombreModulo : string ) : any {
    const cadenaPermisos : any = localStorage.getItem('permisos');
    const objetoPermisos = this.obtenerObjetoPermisosDesdeCadena(cadenaPermisos);
    const objetoModulo = objetoPermisos[0].permisosRol.filter((item : any) => item.modulo == nombreModulo );

    const objetoPermisosModulo = objetoModulo[0].permisosModulo;

    const permisosmodulo = objetoPermisosModulo.reduce((acc : any, permiso : any) => {
      acc[permiso.permiso] = permiso;
      return acc;
    }, {});

    return permisosmodulo;
  }

  formatearMinusculasSinAcentos ( cadena : any ) : any {
    return unorm.nfd(cadena ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  }
}
