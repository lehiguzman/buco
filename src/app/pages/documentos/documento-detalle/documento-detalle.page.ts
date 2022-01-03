import { Component, OnInit } from '@angular/core';

import { GlobalService, DocumentoService, LocalStorageService, ApplicationInsightsService } from '../../../providers/';

@Component({
  selector: 'app-documento-detalle',
  templateUrl: './documento-detalle.page.html',
  styleUrls: ['./documento-detalle.page.scss'],
})
export class DocumentoDetallePage implements OnInit {

  public documento = {
    nombre: '',
    tipo: '',
  };

  constructor(
    private lsServ: LocalStorageService,
    private documentoService: DocumentoService,
    public globalServ: GlobalService,
    private appInsights: ApplicationInsightsService,
  ) { }

  ngOnInit() {

    this.lsServ.getStoreData("documento").then((documento: any) => {
      this.documento = documento;

      this.documentoService.detailTipo(documento.tipo_documento).subscribe((data: any) => {
        console.log("Dato de tipo de documento : ", data);
        this.documento.tipo = data.data.nombre;
      });
    });
  }

  irAtras() {
    this.globalServ.pageTransition();
  }

}
