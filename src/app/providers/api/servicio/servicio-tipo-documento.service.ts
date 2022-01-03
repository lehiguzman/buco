import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioTipoDocumentoService {

  private model: string = "servicios/tiposDocumento";

  constructor(private reqServ: RequestsService) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `servicio_tiposDocumento_list` });
  }

  /**
   * Consulta los registros del modelo activos y disponibles con tipo de documento asociado
   */
  listAll() {
    return this.reqServ.get({ endpoint: `${this.model}/all`, module: `servicio_tiposDocumento_list_all` });
  }
}
