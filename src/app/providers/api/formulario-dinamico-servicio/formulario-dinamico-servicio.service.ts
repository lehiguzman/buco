import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class FormularioDinamicoServicioService {

  private model: string = "formulariosdinamicos/servicios";

  constructor( private reqServ: RequestsService ) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  detail( id: any ) {
    return this.reqServ.get({ endpoint: `${this.model}?idServicio=${id}`, module: `formulariodinamico_servicio_list_all` });
  }
}
