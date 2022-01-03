import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenServicioProfesionalService {

  private model: string = "ordenServicioProfesionales";

  constructor( private reqServ: RequestsService ) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list( id: any ) {
    console.log("Model : ", this.model);
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `orden_servicio_profesional_list` });
  }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  listOrdenes( id: any ) {
    console.log("Model : ", this.model);
    return this.reqServ.get({ endpoint: `${this.model}/user/${id}`, module: `orden_servicio_profesional_list` });
  }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  listOrdenesRangoFecha( id: any, fechaDesde: any, fechaHasta: any ) {    
    //return this.reqServ.get({ endpoint: `${this.model}/rangoFecha/${id}/${fechaDesde}/${fechaHasta}`, module: `orden_servicio_profesional_rangofecha` });
    return this.reqServ.get({ endpoint: `${this.model}/rangoFecha/${id}?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`, module: `orden_servicio_profesional_rangofecha` });
  }

  /**
   * Consulta orden de servicio de profesional especifico
   */
  detail( id: any ) {
    return this.reqServ.get({ endpoint: `ordenServicio/profesional/${id}`, module: `ordenServicio_profesional_detail` });
  }

  /**
   * Actualiza un registro
   * 
   * @param id     Identificador único del registro
   * @param data   Datos del registro
   */
  update(id: any, data: any) {
    return this.reqServ.put({ endpoint: `${this.model}/${id}`, body: data, module: `orden_servicio_profesional_status` });
  }
}
