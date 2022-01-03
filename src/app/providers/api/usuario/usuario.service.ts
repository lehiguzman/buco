import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private model: string = "usuarios";

  constructor(private reqServ: RequestsService) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list() {
    return this.reqServ.get({ endpoint: `${this.model}`, module: `user_list_all` });
  }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  listDirecciones(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/direcciones/${id}`, module: `user_list_direccion` });
  }

  /**
   * Crear un registro en el sistema
   * 
   * @param data   Datos del registro
   */
  create(data: any) {
    return this.reqServ.post({ endpoint: `${this.model}`, body: data, module: `user_add` });
  }

  /**
   * Actualiza un registro
   * 
   * @param id     Identificador único del registro
   * @param data   Datos del registro
   */
  update(id: any, data: any) {
    return this.reqServ.put({ endpoint: `${this.model}/${id}`, body: data, module: `user_edit` });
  }

  /**
   * Consulta el detalle de un registro
   * 
   * @param id   Identificador único del registro
   */
  detail(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `user_list` });
  }

}
