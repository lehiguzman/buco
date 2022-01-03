import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenServicioTareaService {

  private model: string = "ordenesServicio/tareas";
  constructor( private reqServ: RequestsService ) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list( id: any ) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `ordenServicio_tarea_list` });
  }

  /**
   * Crear un metodo de pago de Cliente
   * 
   * @param data   Datos del registro
   */
  create( data: any) {
    return this.reqServ.post({ endpoint: `${this.model}`, body: data, module: `ordenServicio_tarea_add` });
  }

  /**
   * Actualiza un registro
   * 
   * @param id     Identificador único del registro
   * @param data   Datos del registro
   */
  update(id: any, data: any) {
    return this.reqServ.put({ endpoint: `${this.model}/${id}`, body: data, module: `ordenServicio_tarea_status` });
  }
}
