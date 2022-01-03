import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenServicioService {

  private model: string = "ordenesServicio";

  constructor( private reqServ: RequestsService ) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list( id: any ) {
    return this.reqServ.get({ endpoint: `${this.model}/profesionales/${id}`, module: `ordenServicio_profesional_list` });
  }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  listUser( id: any ) {
    return this.reqServ.get({ endpoint: `${this.model}/usuarios/${id}`, module: `ordenServicio_user_list` });
  }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  listFotos( id: any ) {
    return this.reqServ.get({ endpoint: `${this.model}/fotos/${id}`, module: `ordenServicio_fotos_list` });
  }  

  /**
   * Crear un metodo de pago de Cliente
   * 
   * @param data   Datos del registro
   */
  create( data: any) {
    return this.reqServ.post({ endpoint: `${this.model}`, body: data, module: `ordenServicio_add` });
  }

  /**
   * Actualiza un registro
   * 
   * @param id     Identificador único del registro
   * @param data   Datos del registro
   */
  update(id: any, data: any) {
    return this.reqServ.put({ endpoint: `${this.model}/${id}`, body: data, module: `ordenServicio_estatus` });
  }

  /**
   * Actualiza un registro
   * 
   * @param id     Identificador único del registro
   * @param data   Datos del registro
   */
  updateMetodoPago(id: any, data: any) {
    return this.reqServ.put({ endpoint: `${this.model}/metodoPago/${id}`, body: data, module: `ordenServicio_edit` });
  }  

  /**
   * Consulta el detalle de un registro
   * 
   * @param id   Identificador único del registro
   */
  detail(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `ordenServicio_list` });
  }

  /**
   * Consulta telefonos
   * 
   * @param id   Identificador ODS
   */
  telefonos(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}/telefonos`, module: `ordenServicio_telefonos` });
  }
}
