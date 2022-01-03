import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';

import { GlobalService, LocalStorageService, DepartamentoService, ApplicationInsightsService } from '../../../providers/';

@Component({
  selector: 'app-servicio-list',
  templateUrl: './servicio-list.page.html',
  styleUrls: ['./servicio-list.page.scss'],
})
export class ServicioListPage implements OnInit {

  id: any;
  servicios: any[] = [];
  textoBuscar: any = '';
  nombre_departamento: string;
  nroServicios: any;
  nroServiciosActivos: any;
  todo: boolean = false;
  cantidad: number;

  mostrar: any;

  constructor(private globalService: GlobalService,
    private appInsights: ApplicationInsightsService,
    private departamentoService: DepartamentoService,
    private ls: LocalStorageService,
    private route: ActivatedRoute,
    private navCtrl: NavController) { }

  ngOnInit() {

    this.listarServicios(false);

  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('servicio_list');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('servicio_list');
  }

  listarServicios(todo: boolean) {

    this.todo = todo;
    this.id = this.route.snapshot.paramMap.get('id');
    this.servicios = [];
    this.globalService.loadingCustom();

    let totalDepartamentos: any = 0;

    this.departamentoService.detail(this.id).subscribe((departamento: any) => {
      this.nombre_departamento = departamento.data.nombre;
    });

    this.departamentoService.listServicio(this.id).subscribe((data: any) => {
      console.log("Servicios de departamento : ", this.id);
      this.nroServicios = data.data.length;

      if (this.nroServicios > 6 && !todo) {
        this.cantidad = 6;
        this.mostrar = "si";
      }
      else {
        this.cantidad = this.nroServicios;
      }

      for (let i = 0; i < this.cantidad; i++) {

        this.servicios[i] = data.data[i].servicio;

      }
      this.globalService.dismissLoader();
    });
  }

  buscarServicio(event) {

    this.textoBuscar = event.detail.value;

  }

  profesional(id) {

    this.globalService.pageTransition();
    console.log("Servicio seleccionado : ", id);
    this.ls.setStoreData("servicio", id);
    this.navCtrl.navigateForward(`profesional-list/${id}`);

  }

}
