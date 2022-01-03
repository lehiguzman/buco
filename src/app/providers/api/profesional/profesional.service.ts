import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalService {

  private model: string = "profesionales";

  constructor(private reqServ: RequestsService) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list() {
    return this.reqServ.get({ endpoint: `${this.model}`, module: `metodosPagoClienteUser_list` });
  }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  listPorServicio(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/servicio/${id}`, module: `profesional_list_all_servicio` });
  }

  /**
   * Consulta la distancia del profesional
   */
  getDistancia(id: any, data: any) {
    return this.reqServ.post({ endpoint: `${this.model}/${id}/cobertura`, body: data, module: `profesional_list_by_rango` });
  }

  /**
   * Consulta los profesionales en la cobertura
   */
  getCoberura(data: any) {
    return this.reqServ.post({ endpoint: `${this.model}/cobertura`, body: data, module: `profesional_list_all_by_rango` });
  }

  /**
   * Consulta un profesional por cobertura
   */
  getProfesionalCoberura(id: any, data: any) {
    return this.reqServ.post({ endpoint: `${this.model}/${id}/cobertura`, body: data, module: `profesional_list_all_by_rango` });
  }

  /**
   * Consulta la popularidad del profesional
   */
  getPopularidad(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}/populares`, module: `profesional_list_all_populares` });
  }

  /**
   * Consulta el detalle de un registro
   * 
   * @param id   Identificador único del registro
   */
  userDetail(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/usuarios/${id}`, module: `user_list` });
  }

  /**
   * Consulta el detalle de un registro
   * 
   * @param id   Identificador único del registro
   */
  getMetodosPago(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/metodosPago/${id}`, module: `profesional_metodoPago_list` });
  }

  /**
   * Consulta el detalle de un registro
   * 
   * @param id   Identificador único del registro
   */
  detail(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `profesional_list` });
  }
}
