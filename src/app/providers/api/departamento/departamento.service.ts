import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})

export class DepartamentoService {

  private model: string = "departamentos";

  constructor( private reqServ: RequestsService ) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list() {
    return this.reqServ.get({ endpoint: `${this.model}`, module: `departamento_list_all` })
  }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  listSistema( idSistema:any ) {
    return this.reqServ.get({ endpoint: `${this.model}/sistema/${idSistema}`, module: `departamento_sistema_list_all` })
  }

  /**
   * Consulta los servicios del modelo activos y disponibles
   */
  listServicio( id: any ) {
    return this.reqServ.get({ endpoint: `${this.model}/servicios/${id}`, module: `departamento_list_all` })
  }

  /**
   * Consulta el detalle de un registro
   * 
   * @param id   Identificador único del registro
   */
  detail(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `departamento_list` });
  }
}
