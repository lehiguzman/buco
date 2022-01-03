import { Component, OnInit } from '@angular/core';

import { GlobalService, LocalStorageService, CalificacionService, OrdenServicioService, ApplicationInsightsService } from '../../providers/';
import { AlertController, NavController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.page.html',
  styleUrls: ['./calificacion.page.scss'],
})
export class CalificacionPage implements OnInit {

  profesional_id: any;
  ordenServicio_id: any;
  estatusOrden: any;
  comentario: any;
  calificacion = {
    puntualidad: 0,
    servicio: 0,
    presencia: 0,
    conocimiento: 0,
    recomendado: '',
    comentarios: '',
    orden_servicio_id: 0
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private appInsights: ApplicationInsightsService,
    private calificacionService: CalificacionService,
    private lsServ: LocalStorageService,
    private navCtrl: NavController,
    private ordenServicioService: OrdenServicioService,
    public globalServ: GlobalService,
  ) { }

  ngOnInit() {

    this.lsServ.getStoreData("datosCalificacion").then((datosCalificacion: any) => {
      //this.profesional_id = datosCalificacion.profesional_id;
      this.calificacion.orden_servicio_id = datosCalificacion.ordenServicio_id;
    });
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('metodopago_add');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('metodopago_add');
    this.lsServ.deleteStoreData("datosCalificacion");

  }

  calificaPuntualidad(valor: any) {

    this.calificacion.puntualidad = valor;

  }

  calificaServicio(valor: any) {

    this.calificacion.servicio = valor;

  }

  calificaPresencia(valor: any) {

    this.calificacion.presencia = valor;

  }

  calificaConocimiento(valor: any) {

    this.calificacion.conocimiento = valor;

  }

  recomendacion(valor: any) {

    this.calificacion.recomendado = valor.detail.value

  }

  calificarProfesional() {

    if (this.calificacion.recomendado == '') {
      let errorMsg = '<H5>Debe seleccionar si recomienda el profesional</H5>';
    }

    this.calificacion.comentarios = this.comentario;

    this.calificacionService.create(this.calificacion).subscribe((data: any) => {
      console.log("Datos de respuesta : ", data);
      if (data.code == 201) {
        this.actualizarEstatus();
        this.globalServ.mensaje({ message: data.message, color: 'success', position: 'middle' });
        this.navCtrl.navigateForward("orden-servicio-list");
      }
    }, (err: any) => { console.log("Error : ", err); });
  }

  actualizarEstatus() {
    var id = this.calificacion.orden_servicio_id;
    var data = {
      estatus: 8
    }

    this.ordenServicioService.update(id, data).subscribe(data => {
      console.log("Estatus actualizado");
    }, (err: any) => {
      console.log("Error : ", err);
    });
  }
}
