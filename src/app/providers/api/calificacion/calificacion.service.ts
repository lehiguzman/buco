import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {

  private model: string = "calificaciones";

  constructor( private reqServ: RequestsService ) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list( id: any ) {
    return this.reqServ.get({ endpoint: `profesionales/${id}/${this.model}`, module: `profesional_calificaciones_list` })
  }

  /**
   * Crear una claificacion de ODS
   * 
   * @param data   Datos del registro
   */
  create(data: any) {
    return this.reqServ.post({ endpoint: `${this.model}`, body: data, module: `calificacion_add` });
  }

}
