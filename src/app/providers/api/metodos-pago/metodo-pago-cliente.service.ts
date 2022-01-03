import { Injectable, ɵɵresolveBody } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoClienteService {

  private modelUser: string = "metodosPagoClienteUser";
  private model: string = "metodosPagoCliente";

  constructor( private reqServ: RequestsService ) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  listUser( id: any ) {
    return this.reqServ.get({ endpoint: `${this.modelUser}/${id}`, module: `metodosPagoClienteUser_list` });
  }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list( id: any ) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `metodosPagoCliente_list` });
  }

  /**
   * Crear un metodo de pago de Cliente
   * 
   * @param data   Datos del registro
   */
  create( data: any ) {
    return this.reqServ.post({ endpoint: `${this.model}`, body: data,  module: `metodosPagoCliente_add` });
  }

  /**
   * Actualiza un registro
   * 
   * @param id     Identificador único del registro
   * @param data   Datos del registro
   */
  update(id: any, data: any) {
    return this.reqServ.put({ endpoint: `${this.model}/${id}`, body: data, module: `metodosPagoCliente_edit` });
  }

  /**
   * Consulta el detalle de un registro
   * 
   * @param id   Identificador único del registro
   */
  detail(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `metodosPagoCliente_list` });
  }

  /**
   * Elimina un registro
   * 
   * @param id   Identificador único del registro
   */
  remove(id: any) {
    return this.reqServ.delete({ endpoint: `${this.model}/${id}`, module: `metodosPagoCliente_remove` });
  }
}
