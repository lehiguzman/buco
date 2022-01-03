import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocalStorageService, NavigatorService } from '../../../providers';

@Component({
  selector: 'app-orden-servicio-map',
  templateUrl: './orden-servicio-map.page.html',
  styleUrls: ['./orden-servicio-map.page.scss'],
})
export class OrdenServicioMapPage implements OnInit {

  latitud: number = 0;
  longitud: number = 0;

  constructor(private navCtrl: NavController,
    private ls: LocalStorageService,
    private navigate: NavigatorService,
    private geolocation: Geolocation) { }

  ngOnInit() { }

  ionViewDidEnter() { }

  irAOrden() {
    this.ls.deleteStoreData("ordenServicioDetalle");
    this.navCtrl.navigateBack("orden-servicio-detail");
  }

  abrirWaze() {
    this.ls.getStoreData("ordenServicioDetalle").then((ordenServicio: any) => {
      this.latitud = ordenServicio.latitud;
      this.longitud = ordenServicio.longitud;

      this.obtenerPosicionActual((response, error) => {

        console.log("Response : ", response);
        let posActual = [
          response.lat,
          response.lng
        ];

        let direccion = [
          this.latitud,
          this.longitud
        ];

        this.navigate.navigate(posActual, direccion).then((resp) => console.log(resp));
      });
    });
  }

  /*  se obtiene la posicion actual si no se puede se retorna el valor por defecto que es en ciudad de panama  */
  obtenerPosicionActual(callback) {
    let options = {
      timeout: 50000,
      enableHighAccuracy: false,
      maximumAge: 36000
    };

    this.geolocation.getCurrentPosition(options).then(response => {
      return callback({ lat: response.coords.latitude, lng: response.coords.longitude }, null);
    }).catch(error => {
      return callback({ lat: 8.99797, lng: -79.508096 }, null);
    });
  }
}
