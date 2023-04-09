import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private urlHost = environment.api;
  
  constructor(
    private http : HttpClient
  ) { }

  public validarReportePendienteExistente( datosNuevoReporte : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/reportes/validarReportePendienteExistente', datosNuevoReporte);
  }

  public crearNuevoReporte( datosNuevoReporte : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/reportes/crearNuevoReporte', datosNuevoReporte);
  }

  public consultarReportesPorStatus( status : any ) : Observable<any>{
    return this.http.get<any>(this.urlHost+`/reportes/consultarReportesPorStatus/${status}`);
  }

  public cargaComponenteModificacionReporte( pkReporte : any ) : Observable<any>{
    return this.http.get<any>(this.urlHost+`/reportes/cargaComponenteModificacionReporte/${pkReporte}`);
  }

  public validarReporteProblemaPendienteExistente ( datosReporteModificado : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/reportes/validarReporteProblemaPendienteExistente', datosReporteModificado);
  }

  public modificarReporteCliente ( datosReporteModificado : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/reportes/modificarReporteCliente', datosReporteModificado);
  }

  public validarComenzarReporteCliente ( pkReporte : number ) : Observable<any>{
    return this.http.get<any>(this.urlHost+`/reportes/validarComenzarReporteCliente/${pkReporte}`);
  }

  public comenzarReporteCliente ( datosComenzarReporte : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/reportes/comenzarReporteCliente', datosComenzarReporte);
  }

  public validarDejarReporteCliente ( datosDejarReporte : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/reportes/validarDejarReporteCliente', datosDejarReporte);
  }

  public dejarReporteCliente ( datosDejarReporte : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/reportes/dejarReporteCliente', datosDejarReporte);
  }

  public validarAtenderReporteCliente ( datosAtenderReporte : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/reportes/validarAtenderReporteCliente', datosAtenderReporte);
  }

  public atenderReporteCliente ( datosAtenderReporte : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/reportes/atenderReporteCliente', datosAtenderReporte);
  }

  public validarRetomarReporteCliente ( datosRetomarReporte : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/reportes/validarRetomarReporteCliente', datosRetomarReporte);
  }

  public retomarReporteCliente ( datosRetomarReporte : any ) : Observable<any>{
    return this.http.post<any>(this.urlHost+'/reportes/retomarReporteCliente', datosRetomarReporte);
  }
}