import { Component, OnInit } from '@angular/core';
import { NavigationExtras, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import {
  GlobalService, LocalStorageService,
  ClienteTarjetaService, ApplicationInsightsService
} from '../../../providers/';

@Component({
  selector: 'app-servicio-pago-detalle',
  templateUrl: './servicio-pago-detalle.page.html',
  styleUrls: ['./servicio-pago-detalle.page.scss'],
})
export class ServicioPagoDetallePage implements OnInit {

  ordenId: number;
  tarjeta: any;
  tareas: any[] = [];
  metodosPago: any;
  metodoPagoId: any;
  profesionalId: any;
  total: number;
  mostrar: any;

  constructor(private activatedRoute: ActivatedRoute,
    private globalService: GlobalService,
    private tarjetaApi: ClienteTarjetaService,
    private appInsights: ApplicationInsightsService,
    private ls: LocalStorageService,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.ls.getStoreData("datosOds").then((datosOds: any) => {
      this.ordenId = datosOds.ordenId;
      this.profesionalId = datosOds.profesionalId,
        this.tareas = datosOds.tareas;

      this.total = this.tareas.reduce((sum, value) => (typeof value.monto == "number" ? sum + value.monto : sum), 0);

      this.listarMetodosPago();
    });
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('servicio_pago_detalle');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('servicio_pago_detalle');
  }

  listarMetodosPago() {
    this.tarjetaApi.list().subscribe((resp: any) => {
      this.mostrar = 1;
      this.metodosPago = resp.data;
    });
  }

  cambiarMetodo(e: any) {
    this.metodoPagoId = e.target.value;
  }

  confirmarPago() {
    let datosOrden = {
      ordenId: this.ordenId,
      profesionalId: this.profesionalId,
      tareas: this.tareas,
    }

    this.ls.setStoreData("datosOds", datosOrden);

    this.globalService.pageTransition();
    this.navCtrl.navigateForward('servicio-pago-confirm');
  }
}
