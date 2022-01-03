import { Component } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { NavigationExtras } from "@angular/router";
//Services
import {
  GlobalService, LocalStorageService,
  ApplicationInsightsService,
  OrdenServicioService
} from 'src/app/providers';
import * as moment from 'moment';

@Component({
  selector: 'app-push-notifications',
  templateUrl: './push-notifications.page.html',
  styleUrls: ['./push-notifications.page.scss'],
})
export class PushNotificationsPage {

  anio: any = moment().year();
  btnNombre: string = "VER DETALLE";
  datos: any = {};
  datosID: any = 0;
  showIrDetalle: boolean = false;

  constructor(
    private appInsights: ApplicationInsightsService,
    private modalCtrl: ModalController,
    private odsApiServ: OrdenServicioService,
    public globalServ: GlobalService,
    public lsServ: LocalStorageService,
    public navCtrl: NavController,
  ) { }

  ngOnInit() { }
  ionViewWillEnter() {
    this.globalServ.loadingCustom();
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('pushnotifications');

    this.lsServ.getStoreData("pushNotifications").then((data: any) => {
      if (data) {
        this.datos = { ...this.datos, ...data };
        if (data['id']) this.datosID = data['id'];
        if (data['tipo'] === 'ods') this.cargarDatosODS();
      }
    });
  }
  ionViewWillLeave() { }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('pushnotifications');
  }

  private cargarDatosODS() {
    if (!this.datosID) this.dismiss();

    this.odsApiServ.detail(this.datosID).subscribe((res: any) => {
      if (res.data) {
        this.showIrDetalle = true;
        this.datos = { ...this.datos, ...res.data };
        if (this.datos.estado === 7) {
          this.btnNombre = "CALIFICAR";
        }
      }
    });
  }

  irDetalle() {
    this.dismiss();
    if (this.datos.estado === 7) {
      const datosParams = {
        // profesional_id: profesional,
        ordenServicio_id: this.datosID
      }
      this.lsServ.setStoreData("datosCalificacion", datosParams).then(() => {
        this.navCtrl.navigateForward('calificacion');
      });
    } else {
      const datosParams: NavigationExtras = { queryParams: { id: this.datosID, tipoListado: this.globalServ.UsuarioTipo } };
      this.navCtrl.navigateForward('orden-servicio-detail', datosParams);
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
