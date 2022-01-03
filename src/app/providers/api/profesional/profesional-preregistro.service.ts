import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalPreRegistroService {

  private model: string = "profesionales/preregistro";

  constructor(private reqServ: RequestsService) { }

  /**
   * Registro del pre-registro del Profesional
   * 
   * @param data   Datos del registro
   */
  create(data: any) {
    return this.reqServ.post({ endpoint: `${this.model}/actualizacion`, body: data, module: `profesional_preregistro_actualizacion` });
  }

  /**
   * Consulta el pre-registro del Profesional
   */
  detail() {
    return this.reqServ.get({ endpoint: `${this.model}/datos`, module: `profesional_preregistro_detalles` });
  }

}
