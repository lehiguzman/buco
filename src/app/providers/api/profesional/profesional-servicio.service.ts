import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalServicioService {

  private model: string = "profesionalServicios";

  constructor(private reqServ: RequestsService) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list( id: any ) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `profesional_servicios_list` });
  }
}
