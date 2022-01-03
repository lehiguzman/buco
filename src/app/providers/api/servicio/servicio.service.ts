import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private model: string = "servicios";

  constructor(private reqServ: RequestsService) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list() {
    return this.reqServ.get({ endpoint: `${this.model}`, module: `servicio_list_all` });
  }

  /**
   * Consulta los campos especiales del servicio
   */
  getCamposEspeciales(idServicio: any) {
    return this.reqServ.get({ endpoint: `formulariosdinamicos/${this.model}?idServicio=${idServicio}`, module: `servicio_camposespeciales` });
  }

  /**
   * Consulta las tareas del servicio
   */
  getTareas(idServicio: any) {
    return this.reqServ.get({ endpoint: `tareas?idServicio=${idServicio}`, module: `servicio_tareas` });
  }
}
