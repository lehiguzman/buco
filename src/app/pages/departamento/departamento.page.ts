import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { GlobalService, LocalStorageService, DepartamentoService, ApplicationInsightsService } from '../../providers/';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.page.html',
  styleUrls: ['./departamento.page.scss'],
})
export class DepartamentoPage implements OnInit {

  departamentos: any[] = [];
  textoBuscar: string = '';
  idSistema: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private appInsights: ApplicationInsightsService,
    private departamentoService: DepartamentoService,
    private ls: LocalStorageService,
    private navCtrl: NavController,
    public globalServ: GlobalService,
  ) { }

  ngOnInit() {
    //this.idSistema = this.activatedRoute.snapshot.paramMap.get('id');

    this.ls.getStoreData("idSistema").then((idSistema: any) => {
      console.log("Id sistema : ", idSistema);
      this.idSistema = idSistema;
      this.listarDepartamentos();
    });
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('departamento');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('departamento');
  }

  listarDepartamentos() {
    this.globalServ.loadingCustom();
    this.departamentoService.listSistema(this.idSistema).subscribe((data: any) => {

      for (const departamento in data.data) {
        if (data.data.hasOwnProperty(departamento)) {
          const element = data.data[departamento];

          if (element.estatus == 1) {

            this.departamentos.push({
              id: element.id,
              icono: element.icono,
              nombre: element.nombre
            });
          }
        }
      }
      this.globalServ.dismissLoader();
    });
  }

  buscarDepartamento(event) {
    //console.log( "Valor de stribng : ", event.detail.value );
    this.textoBuscar = event.detail.value;

  }

  servicio(id) {

    this.globalServ.pageTransition();
    this.navCtrl.navigateForward(`servicio-list/${id}`);

  }

}
