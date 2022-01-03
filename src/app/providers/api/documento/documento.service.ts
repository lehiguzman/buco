import { Injectable } from '@angular/core';
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  private model: string = "documentos";

  constructor(private reqServ: RequestsService) { }

  /**
   * Consulta los registros del modelo activos y disponibles
   */
  list(id: any) {
    return this.reqServ.get({ endpoint: `profesionales/${id}/${this.model}`, module: `profesional_documentos_list` });
  }

  /**
   * Crear un metodo de pago de Cliente
   * 
   * @param data   Datos del registro
   */
  create(data: any) {
    return this.reqServ.post({ endpoint: `${this.model}`, body: data, module: `documento_add` });
  }

  /**
   * Actualiza un registro
   * 
   * @param id     Identificador único del registro
   * @param data   Datos del registro
   */
  update(id: any, data: any) {
    return this.reqServ.put({ endpoint: `${this.model}/${id}`, body: data, module: `documento_edit` });
  }

  /**
   * Consulta los documentos del profesional
   */
  detail(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `documento_list_all` });
  }

  /**
   * Elimina un registro
   * 
   * @param id   Identificador único del registro
   */
  remove(id: any) {
    return this.reqServ.delete({ endpoint: `documentos/${id}`, module: `documento_remove` });
  }

  detailTipo(id: any) {
    return this.reqServ.get({ endpoint: `tiposDocumento/${id}`, module: `tipoDocumento_list` });
  }

  /**
   * Consulta por documento individual
   */
  detailDocumento(id: any) {
    return this.reqServ.get({ endpoint: `${this.model}/${id}`, module: `documento_list` });
  }
}
