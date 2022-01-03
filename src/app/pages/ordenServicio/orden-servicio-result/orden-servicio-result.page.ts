import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';

import { GlobalService, LocalStorageService } from '../../../providers/';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';

import * as moment from 'moment';

@Component({
  selector: 'app-orden-servicio-result',
  templateUrl: './orden-servicio-result.page.html',
  styleUrls: ['./orden-servicio-result.page.scss'],
})
export class OrdenServicioResultPage implements OnInit {

  userId: any;
  profesionalId: any;

  min: number;
  max: number;

  lat: number;
  lon: number;
  distancia: number;

  ordenesServicio: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private geolocation: Geolocation,
    private ls: LocalStorageService,
    private navCtrl: NavController,
    public globalServ: GlobalService,
    ) {
    this.getGeolocation();
  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {

      this.min = params["min"];
      this.max = params["max"];

    });
    this.listarOrdenes();
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      this.lat = 8.99797; //geoposition.coords.latitude;
      this.lon = -79.508096; //geoposition.coords.longitude;     
    });
  }

  calculateDistance(lon1, lon2, lat1, lat2) {
    let p = 0.017453292519943295;
    let c = Math.cos;
    let a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((lon1 - lon2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a)));
    //return Math.trunc(dis);
    return dis;
  }

  listarOrdenes() {
    this.ls.getStoreData("token").then((token: any) => {
      this.ls.getStoreData("usuario").then((usuario: any) => {

        this.userId = usuario.data.id;

        // this.globalService.getProfesionalUsuario(token, this.userId).subscribe((profesional: any) => {

        //   this.profesionalId = profesional.data.id;

        //   this.globalService.getOrdenesServicioProfesional(this.profesionalId, token).subscribe((ordenes: any) => {

        //     for (const orden in ordenes.data) {
        //       if (ordenes.data.hasOwnProperty(orden)) {

        //         const element = ordenes.data[orden];
        //         let formatDistancia: any;

        //         //Extaer fecha y hora separados del campo fecha_hora
        //         let fecha = moment.parseZone(element.fecha_hora).format('DD/MM/YYYY');
        //         let hora = parseInt(moment.parseZone(element.fecha_hora).format('HH'));

        //         //formato para mostrar en la vista
        //         let meridiano = hora >= 12 ? 'PM' : 'AM';
        //         let horaVista = hora > 12 ? hora - 12 : hora;

        //         let longitudServicio = element.longitud;
        //         let latitudServicio = element.latitud;

        //         this.distancia = this.calculateDistance(this.lon, longitudServicio, this.lat, latitudServicio);

        //         if (this.distancia > this.min && this.distancia < this.max) {

        //           if (this.distancia > 1) {
        //             formatDistancia = this.distancia.toFixed(2) + " Km";
        //           }
        //           else {
        //             formatDistancia = Math.trunc((this.distancia * 1000)) + " Mts";
        //           }

        //           this.ordenesServicio.push({
        //             id: element.id,
        //             foto: element.profesional.user.foto,
        //             nombre: element.user.name,
        //             servicio: element.profesional.servicio.nombre,
        //             distancia: formatDistancia,
        //             estatus: element.estatus,
        //             fecha: fecha,
        //             hora: horaVista,
        //             meridiano: meridiano
        //           });
        //         }
        //       }
        //     }
        //   });

        // });
      });
    });
  }

  irAFiltro() {

    this.globalServ.pageTransition();
    this.navCtrl.navigateForward('orden-servicio-filter');

  }
}
