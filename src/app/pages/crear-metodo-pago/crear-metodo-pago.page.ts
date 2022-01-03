import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-crear-metodo-pago',
  templateUrl: './crear-metodo-pago.page.html',
  styleUrls: ['./crear-metodo-pago.page.scss'],
})
export class CrearMetodoPagoPage implements OnInit {
  isLoading = false;
  constructor(public loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.present();
    
  }
   // Funcion Asycrona LoadingController Ionic 4
   async present() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      duration: 1000,
    }).then(a => {
      a.present().then(() => {
        console.log('Cargando presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('termino presenting'));
        }
      });
    });
  }// Fin present()

   // Funcion Asycrona LoadingController Ionic 4
  async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }//fin dismis


}
