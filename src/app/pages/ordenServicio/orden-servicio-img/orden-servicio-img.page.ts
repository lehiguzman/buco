import { Component, OnInit } from '@angular/core';

import { OrdenServicioService, LocalStorageService } from '../../../providers/';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-orden-servicio-img',
  templateUrl: './orden-servicio-img.page.html',
  styleUrls: ['./orden-servicio-img.page.scss'],
})
export class OrdenServicioImgPage implements OnInit {

  public fotos: any[] = [];
  public fotoVer: any;

  constructor( private ordenServicio: OrdenServicioService, 
               private ls: LocalStorageService,
               private navCtrl: NavController ) { }

  ngOnInit() {  }

  ionViewDidEnter() {
    this.ls.getStoreData("ordenServicioDetalle").then( ( ordenServicioDetalle: any ) => {      
      this.ordenServicio.listFotos(ordenServicioDetalle.id).subscribe( ( data: any ) => {      
        this.fotos = data.data;
      });
    });
  }

  verFoto( indice ) {
    this.fotoVer = this.fotos[indice].ruta;
  }

  dismissImage() {
    this.fotoVer = null;    
  }

  irAtras() {
    this.navCtrl.navigateBack('orden-servicio-detail');
  }
}
