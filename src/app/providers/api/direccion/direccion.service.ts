import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {

  private model: string = "direcciones";

  constructor(private reqServ: RequestsService) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list(id: any) {
    return this.reqServ.get({ endpoint: `usuarios/${this.model}/${id}`, module: `direccion_list_all` });
  }

  /**
   * Crear un metodo de pago de Cliente
   * 
   * @param data   Datos del registro
   */
  create(data: any) {
    return this.reqServ.post({ endpoint: `${this.model}`, body: data, module: `direccion_add` });
  }

  /**
   * Actualiza un registro
   * 
   * @param id     Identificador único del registro
   * @param data   Datos del registro
   */
  update(id: any, data: any) {
    return this.reqServ.put({ endpoint: `${this.model}/${id}`, body: data, module: `direccion_edit` });
  }

  /**
   * Consulta el detalle de un registro
   * 
   * @param id   Identificador único del registro
   */
  detail(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `direccion_list` });
  }

  /**
   * Elimina un registro
   * 
   * @param id   Identificador único del registro
   */
  remove(id: any) {
    return this.reqServ.delete({ endpoint: `${this.model}/${id}`, module: `direccion_remove` });
  }

  /**
   * Consulta las direcciones del Perfil Cliente
   */
  listCliente(clienteID: any) {
    return this.reqServ.get({ endpoint: `${this.model}/cliente/${clienteID}`, module: `direccion_cliente_list` });
  }

  /**
   * Consulta la dirección por Defecto del Cliente
   */
  getPorDefectoCliente(clienteID: any) {
    return this.reqServ.get({ endpoint: `${this.model}/cliente/${clienteID}?predeterminada=1`, module: `direccion_cliente_default` });
  }

  /**
   * Consulta las direcciones del Perfil Profesional/Afiliado
   */
  listProfesional() {
    return this.reqServ.get({ endpoint: `profesional/${this.model}`, module: `direccion_profesional_list` });
  }

  /**
   * Consulta la dirección por Defecto del Profesional/Afiliado
   */
  getPorDefectoProfesional() {
    return this.reqServ.get({ endpoint: `profesional/${this.model}?predeterminada=1`, module: `direccion_profesional_default` });
  }

}
