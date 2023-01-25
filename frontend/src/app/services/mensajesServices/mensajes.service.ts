import { Injectable, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor() { }
  mensajeEsperar():void{
    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere un momento...',
      icon: 'info',
      confirmButtonText: 'Cool'
    });
    Swal.showLoading();
  }

  cerrarMensajes():void{
    Swal.close()
  }

  mensajeGenerico( mensaje: string, tipo: string, title: string = '', html = null ) : void {
    let data: any = {
      title,
      allowOutsideClick: false,
      icon: tipo,
      text: mensaje,
      confirmButtonText: 'Continuar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-primary',
      }
    };
    if (html){
      data['html'] = html;
    }
    Swal.fire(data);
  }

  mensajeGenericoToast(mensaje : string, tipo: string, tiempo: number = 3000){
    let Toast: any = Swal.mixin({
      toast : true,
      position : 'top-end',
      showConfirmButton : false,
      timer : tiempo,
      timerProgressBar : true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    Toast.fire({
      icon: tipo,
      title: mensaje
    });
  }
}
