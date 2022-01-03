import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-orden-servicio-dir',
  templateUrl: './orden-servicio-dir.page.html',
  styleUrls: ['./orden-servicio-dir.page.scss'],
})
export class OrdenServicioDirPage implements OnInit {

  @Input() longitud;
  @Input() latitud;
  @Input() direccion;  

  public geocoder: any;   
  public map: any;

  constructor( private modalCtrl: ModalController ) { }

  ngOnInit() {

    this.loadMap( this.latitud, this.longitud, null);
  }

  loadMap(latitude: any, longitude: any, callback) {

    let mapEle: HTMLElement = document.getElementById('map');
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

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
    });    
  }

  irAOrden() { 
    this.modalCtrl.dismiss();
  }
}
