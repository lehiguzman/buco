import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class ArchivoPortafolioService {

  private model: string = "archivoportafolio";

  constructor( private reqServ: RequestsService ) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list() {
    return this.reqServ.get({ endpoint: `${this.model}`, module: `archivoportafolio_list_all` })
  }

  /**
   * Consulta el detalle de un registro
   * 
   * @param id   Identificador único del registro
   */
  detail(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `direccion_list` });
  }

  /**
   * Crear un archivo de portafolio
   * 
   * @param data   Datos del registro
   */
  create(data: any) {
    return this.reqServ.post({ endpoint: `${this.model}`, body: data, module: `archivoportafolio_add` });
  }

  /**
   * Actualiza un registro
   * 
   * @param id     Identificador único del registro
   * @param data   Datos del registro
   */
  update(id: any, data: any) {
    console.log("Id de datos : ", id);
    return this.reqServ.put({ endpoint: `${this.model}/${id}`, body: data, module: `archivoportafolio_edit` });
  }

  /**
   * Elimina un registro
   * 
   * @param id   Identificador único del registro
   */
  remove(id: any) {
    return this.reqServ.delete({ endpoint: `${this.model}/${id}`, module: `archivoportafolio_remove` });
  }
}
