import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../providers';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {

  public geocoder: any;
  public map: any;

  latitud: string = "";
  longitud: string = "";
  direccion: string = "";

  static mapG: any;

  constructor(private lsServ: LocalStorageService) { }

  ngOnInit() {
    this.lsServ.getStoreData("ordenServicioDetalle").then((ordenServicio: any) => {
      console.log("Respuesta : ", ordenServicio);
      this.latitud = ordenServicio.latitud;
      this.longitud = ordenServicio.longitud;
      this.direccion = ordenServicio.direccion;

      this.loadMap(this.latitud, this.longitud, null);
    });
  }

  loadMap(latitude: any, longitude: any, callback) {

    let mapEle: HTMLElement = document.getElementById('mapComponent');
    let myLatLng = {
      lat: latitude,
      lng: longitude
    };
    //console.log("latitud : ", latitude);
    //console.log("longitud : ", longitude);
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      mapTypeControl: false,
      streetViewControl: true,
      zoomControl: false,
      fullscreenControl: false,
      zoom: 16
    });

    MapaComponent.mapG = this.map;

    var marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: myLatLng,
      title: "Hello World!",
    });

    marker.setMap(this.map);

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
    });
  }

}
