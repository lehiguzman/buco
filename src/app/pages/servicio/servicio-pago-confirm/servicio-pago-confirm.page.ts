import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';

import { LocalStorageService, OrdenServicioService, ApplicationInsightsService } from '../../../providers/';

@Component({
  selector: 'app-servicio-pago-confirm',
  templateUrl: './servicio-pago-confirm.page.html',
  styleUrls: ['./servicio-pago-confirm.page.scss'],
})

export class ServicioPagoConfirmPage implements OnInit {

  tareas: any[] = [];
  ordenId: number;
  metodoPagoId: any;
  profesionalId: any;
  total: number;

  constructor(    
    private ordenServicioService: OrdenServicioService,    
    private appInsights: ApplicationInsightsService,
    private navCtrl: NavController,
    private ls: LocalStorageService) { }

  ngOnInit() {
    this.ls.getStoreData("datosOds").then( ( datosOds: any ) => {
      this.ordenId = datosOds.ordenId;
      this.profesionalId = datosOds.profesionalId;
      this.tareas = datosOds.tareas;      

      this.total = this.tareas.reduce((sum, value) => (typeof value.monto == "number" ? sum + value.monto : sum), 0);
    });    
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('servicio_confirm');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('servicio_confirm');
  }

  confirmarPago() {

    let estatusOrden = {
      estatus: 7
    }

    /*this.ordenServicioService.update(this.ordenId, estatusOrden).subscribe((data: any) => {
      //let header = "";
      //let msg = "<h5>Orden pagada exitosamente<h5>";  
      console.log("Respuesta : ", data);
      //this.presentAlert(header, msg);
    }, (err: any) => {
      console.error('error de validacion', err.status);
    });*/

    var datosCambio = {
      ordenId: this.ordenId,
      tareas: this.tareas,
      profesionalId: this.profesionalId
    }

    this.ls.setStoreData("datosCambio", datosCambio);
    this.ls.setStoreData("cambiarMetodoPago", true);
    this.navCtrl.navigateForward("servicio-pago");
  }
}
