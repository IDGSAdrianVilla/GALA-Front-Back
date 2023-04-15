import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public claseSidebar : string = '';

  public objModulos : any[] = [
    {
      nombreModulo : 'Clientes',
      nombreFormulario : 'moduloClientes',
      etiquetaModulo : 'clientes',
      status : false
    },{
      nombreModulo : 'Usuarios',
      nombreFormulario : 'moduloUsuarios',
      etiquetaModulo : 'usuarios',
      status : false
    },{
      nombreModulo : 'Reportes',
      nombreFormulario : 'moduloReportes',
      etiquetaModulo : 'reportes',
      status : false
    },{
      nombreModulo : 'Instalaciones',
      nombreFormulario : 'moduloInstalaciones',
      etiquetaModulo : 'instalaciones',
      status : false
    },{
      nombreModulo : 'Catálogos',
      nombreFormulario : 'moduloCatalogos',
      etiquetaModulo : 'catalogos',
      status : false
    },{
      nombreModulo : 'Asignación Tareas',
      nombreFormulario : 'moduloAsignacionTareas',
      etiquetaModulo : 'asignacionTareas',
      status : false
    },{
      nombreModulo : 'Acciones',
      nombreFormulario : 'moduloAcciones',
      etiquetaModulo : 'acciones',
      status : false
    },{
      nombreModulo : 'Sesiones',
      nombreFormulario : 'moduloSesiones',
      etiquetaModulo : 'sesiones',
      status : false
    },{
      nombreModulo : 'Reportes del sistema',
      nombreFormulario : 'moduloReportesSistema',
      etiquetaModulo : 'reportesSistema',
      status : false
    }
  ];

  public objComplementarioUsuarios = {
    'nombreModulo':'Usuarios',
    'modulo':'usuarios',
    'status':false,
    'permisosModulo':[
      {
        'nombre':'Lectura',
        'permiso':'lectura',
        'status':false,
        'disabled':true
      },{
        'nombre':'Escritura',
        'permiso':'escritura',
        'status':false,
        'disabled':false
      },{
        'nombre':'Modificación',
        'permiso':'modificacion',
        'status':false,
        'disabled':false
      },{
        'nombre':'Permisos',
        'permiso':'permisos',
        'status':false,
        'disabled':false
      }
    ]
  };

  public objComplementarioReportes = {
    'nombreModulo':'Reportes',
    'modulo':'reportes',
    'status':false,
    'permisosModulo':[
      {
        'nombre':'Lectura',
        'permiso':'lectura',
        'status':false,
        'disabled':true
      },{
        'nombre':'Escritura',
        'permiso':'escritura',
        'status':false,
        'disabled':false
      },{
        'nombre':'Modificación',
        'permiso':'modificacion',
        'status':false,
        'disabled':false
      },{
        'nombre':'Eliminación',
        'permiso':'eliminacion',
        'status':false,
        'disabled':false
      }
    ]
  };

  public objComplementarioInstalaciones = {
    'nombreModulo':'Instalaciones',
    'modulo':'instalaciones',
    'status':false,
    'permisosModulo':[
      {
        'nombre':'Lectura',
        'permiso':'lectura',
        'status':false,
        'disabled':true
      },{
        'nombre':'Escritura',
        'permiso':'escritura',
        'status':false,
        'disabled':false
      },{
        'nombre':'Modificación',
        'permiso':'modificacion',
        'status':false,
        'disabled':false
      },{
        'nombre':'Eliminación',
        'permiso':'eliminacion',
        'status':false,
        'disabled':false
      }
    ]
  };

  public objComplementarioClientes = {
    'nombreModulo':'Clientes',
    'modulo':'clientes',
    'status':false,
    'permisosModulo':[
      {
        'nombre':'Lectura',
        'permiso':'lectura',
        'status':false,
        'disabled':true
      },{
        'nombre':'Escritura',
        'permiso':'escritura',
        'status':false,
        'disabled':false
      },{
        'nombre':'Modificación',
        'permiso':'modificacion',
        'status':false,
        'disabled':false
      }
    ]
  };

  public objComplementarioSesiones = {
    'nombreModulo':'Sesiones',
    'modulo':'sesiones',
    'status':false,
    'permisosModulo':[
      {
        'nombre':'Lectura',
        'permiso':'lectura',
        'status':false,
        'disabled':true
      },{
        'nombre':'Suspensión',
        'permiso':'suspencion',
        'status':false,
        'disabled':false
      }
    ]
  };

  public objComplementarioAsignacionTareas = {
    'nombreModulo':'Asignación Tareas',
    'modulo':'asignacionTareas',
    'status':false,
    'permisosModulo':[
      {
        'nombre':'Lectura',
        'permiso':'lectura',
        'status':false,
        'disabled':true
      },{
        'nombre':'Escritura',
        'permiso':'escritura',
        'status':false,
        'disabled':false
      },{
        'nombre':'Modificación',
        'permiso':'modificacion',
        'status':false,
        'disabled':false
      }
    ]
  };

  public objComplementarioAcciones = {
    'nombreModulo':'Acciones',
    'modulo':'acciones',
    'status':false,
    'permisosModulo':[
      {
        'nombre':'Lectura',
        'permiso':'lectura',
        'status':false,
        'disabled':true
      }
    ]
  };

  public objComplementarioCatalogos = {
    'nombreModulo':'Catálogos',
    'modulo':'catalogos',
    'status':false,
    'permisosModulo':[
      {
        'nombre':'Lectura',
        'permiso':'lectura',
        'status':false,
        'disabled':true
      },{
        'nombre':'Escritura',
        'permiso':'escritura',
        'status':false,
        'disabled':false
      },{
        'nombre':'Modificación',
        'permiso':'modificacion',
        'status':false,
        'disabled':false
      }
    ]
  };

  public objComplementarioReportesSistema = {
    'nombreModulo':'Reportes del sistema',
    'modulo':'reportesSistema',
    'status':false,
    'permisosModulo':[
      {
        'nombre':'Lectura',
        'permiso':'lectura',
        'status':false,
        'disabled':true
      }
    ]
  };
}
