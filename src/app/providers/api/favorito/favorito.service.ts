import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritoService {

  private model: string = "favoritos";

  constructor( private reqServ: RequestsService ) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list( id: any ) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `favorito_list_all` });
  }

  /**
   * Crear un registro en el sistema
   * 
   * @param data   Datos del registro
   */
  create(data: any) {
    return this.reqServ.post({ endpoint: `${this.model}`, body: data, module: `clientes_direcciones_create` })
  }

  /**
   * Elimina un registro
   * 
   * @param id   Identificador único del registro
   */
  remove(id: any) {
    return this.reqServ.delete({ endpoint: `${this.model}/${id}`, module: `favorito_remove` })
  }
}
