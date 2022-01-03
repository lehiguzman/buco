import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalMetodoPagoService {

  private model: string = "profesionales/metodosPago";

  constructor(private reqServ: RequestsService) { }

  /**
   * Consulta los Métodos de Pagos
   */
  list() {
    return this.reqServ.get({ endpoint: `${this.model}/lista`, module: `profesional_metodoPago_list` });
  }
  
  /**
   * Consulta los Métodos de Pagos del Profesional
   */
  listProfesional(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/lista/${id}`, module: `profesional_metodoPago_listado` });
  }

  /**
   * Crear un Métodos de Pagos
   * 
   * @param data   Datos del registro
   */
  create(data: any) {
    return this.reqServ.post({ endpoint: `${this.model}`, body: data, module: `profesional_metodoPago_create` })
  }

  /**
   * Elimina un Métodos de Pagos
   * 
   * @param id   Identificador único del registro
   */
  remove(id: any) {
    return this.reqServ.delete({ endpoint: `${this.model}/${id}`, module: `profesional_metodoPago_delete` })
  }
}
