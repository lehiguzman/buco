import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalTareaService {

  private model: string = "profesionalesTareas";

  constructor(private reqServ: RequestsService) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `profesional_tareas_list` });
  }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  listXServicio(id: any, idServicio: any) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}/${idServicio}`, module: `profesional_servicio_tareas_list` });
  }

  /**
   * ACtualizar Tarea
   */
  updateTarea(data: any) {
    return this.reqServ.put({ endpoint: `${this.model}`, body: data, module: `profesional_tarea_update` });
  }
}
