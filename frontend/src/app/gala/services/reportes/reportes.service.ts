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
}
