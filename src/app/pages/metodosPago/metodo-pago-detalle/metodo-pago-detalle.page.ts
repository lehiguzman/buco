import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import {
  GlobalService, LocalStorageService,
  ClienteTarjetaService, ApplicationInsightsService
} from '../../../providers';

@Component({
  selector: 'app-metodo-pago-detalle',
  templateUrl: './metodo-pago-detalle.page.html',
  styleUrls: ['./metodo-pago-detalle.page.scss'],
})
export class MetodoPagoDetallePage implements OnInit {

  id: any;
  metodoPago = {
    id: 0,
    numero: '',
    fechaExpiracion: '',
    cvv: '',
    nombre: '',
  };

  constructor(
    private appInsights: ApplicationInsightsService,
    private tarjetaApi: ClienteTarjetaService,
    public alertCtrl: AlertController,
    public globalServ: GlobalService,
    public lsServ: LocalStorageService,
    public navCtrl: NavController,
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.tarjetaApi.detail(this.id).subscribe((metodoPago: any) => {
      console.log("Metodos de pago : ", metodoPago);
      this.metodoPago = Object.assign(this.metodoPago, metodoPago.data);
    });
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('cliente_tarjeta_detalle');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('cliente_tarjeta_detalle');
  }

  editar(item) {
    this.lsServ.setStoreData("metodoPago", this.metodoPago);
    this.navCtrl.navigateForward('metodo-pago-add');

  }

  async eliminar(item) {
    let aviso = await this.alertCtrl.create({
      header: 'Confirmar',
      mode: 'ios',
      message: '<h5>¿Desea eliminar este método de pago?</h5>',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'buttonCancel',
          handler: (blah) => {
            console.log('Cancelado');

          }
        }, {
          text: 'Si',
          cssClass: 'buttonConfirm',
          handler: () => {
            this.globalServ.loadingCustom("Eliminando Tarjeta...");
            this.tarjetaApi.remove(item).subscribe((data: any) => {
              if (data.code == 200 || data.code == 204) {
                this.lsServ.deleteStoreData("metodosPago");
                this.globalServ.mensaje({ message: data.message, color: 'success', position: 'middle' });
                this.navCtrl.navigateForward('metodo-pago-list');
              } else {
                this.globalServ.mensaje({ message: data.message, color: 'danger', position: 'middle' });
              }
            }, (err: any) => {
              this.globalServ.mensaje({ message: err.error.message, color: 'danger', position: 'middle' });
            });
          }
        }
      ]
    });

    await aviso.present();
  }

  async presentAlert(msg: any, ruta: any) {
    const alert = await this.alertCtrl.create({
      //header: '',      
      mode: 'ios',
      message: msg,
      buttons: [{
        text: 'OK',
        cssClass: 'buttonOk',
        handler: () => {
          if (ruta != "none") {
            this.globalServ.pageTransition();
            this.navCtrl.navigateForward(ruta);
          }
        }
      }]
    });

    await alert.present();
  }

  irAtras() {
    this.globalServ.pageTransition();
  }
}
