import { Component, OnInit } from '@angular/core';

import { NavigationExtras, ActivatedRoute } from '@angular/router';

import { NavController } from '@ionic/angular';

import { GlobalService, LocalStorageService} from '../../../providers/';

@Component({
  selector: 'app-orden-servicio-filter',
  templateUrl: './orden-servicio-filter.page.html',
  styleUrls: ['./orden-servicio-filter.page.scss'],
})
export class OrdenServicioFilterPage implements OnInit {

  min: any;
  max: any;

  constructor( private ls: LocalStorageService,
               private globalService: GlobalService,
               private navCtrl: NavController ) { }

  ngOnInit() {
  }

  asignarValores(e: any) {

    console.log(e);
    this.min = e.target.value.lower;
    this.max = e.target.value.upper;
  }

  filtrarDistancia() {

    let datosDistancia: NavigationExtras = {
      queryParams: {
        min: this.min,
        max: this.max        
      }
    }
    this.globalService.pageTransition();
    this.navCtrl.navigateForward('orden-servicio-result', datosDistancia);
  }



}
