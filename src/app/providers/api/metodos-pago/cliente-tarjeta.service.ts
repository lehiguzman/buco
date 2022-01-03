import { Injectable, ɵɵresolveBody } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteTarjetaService {

  private model: string = "clientes/tarjetas";

  constructor(private reqServ: RequestsService) { }

  /**
   * Consulta las tarjetas del cliente
   */
  list() {
    return this.reqServ.get({ endpoint: `${this.model}`, module: `cliente_tarjeta_list` });
  }

  /**
   * Registra una nueva tarjeta
   * 
   * @param data   Datos del registro
   */
  create(data: any) {
    return this.reqServ.post({ endpoint: `${this.model}`, body: data, module: `cliente_tarjeta_add` });
  }

  /**
   * Actualiza el nombre de la tarjeta
   * 
   * @param id     Identificador único del registro
   * @param data   Datos del registro
   */
  update(id: any, data: any) {
    return this.reqServ.put({ endpoint: `${this.model}/${id}`, body: data, module: `cliente_tarjeta_edit` });
  }

  /**
   * Consulta el detalle de la tarjeta
   * 
   * @param id   Identificador único del registro
   */
  detail(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `cliente_tarjeta_detail` });
  }

  /**
   * Elimina una tarjeta
   * 
   * @param id   Identificador único del registro
   */
  remove(id: any) {
    return this.reqServ.delete({ endpoint: `${this.model}/${id}`, module: `cliente_tarjeta_delete` });
  }
}
