import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';

import { GlobalService, LocalStorageService, DireccionService, ApplicationInsightsService } from '../../../providers';

@Component({
  selector: 'app-direccion-detalle',
  templateUrl: './direccion-detalle.page.html',
  styleUrls: ['./direccion-detalle.page.scss'],
})
export class DireccionDetallePage implements OnInit {

  id: any;
  direccion = {
    id: 0,
    direccion: '',
    instruccion: '',
    tipo: 1,
    residencia: '',
    piso_numero: '',
    pisoNumero: '',
    telefono: '',
    telefonoMovil: ''
  }

  constructor(public route: ActivatedRoute,
    public globalService: GlobalService,
    private appInsights: ApplicationInsightsService,
    private direccionService: DireccionService,
    public ls: LocalStorageService,
    public navCtrl: NavController,
    public alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.direccionService.detail(this.id).subscribe((direccion: any) => {
      this.direccion = Object.assign(this.direccion, direccion.data);
      console.log("Datos de la direccion : ", this.direccion);
    });
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('direcciones_detail');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('direcciones_detail');
  }

  editar(item) {
    this.globalService.pageTransition();
    this.navCtrl.navigateForward('direccion-mapa');
  }

  async eliminar(item) {
    let aviso = await this.alertCtrl.create({
      header: 'Confirmar',
      mode: 'ios',
      message: '<h5>¿Está seguro de eliminar la dirección?</h5>',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'buttonOk',
          handler: (blah) => {
            console.log('Cancelado');
          }
        }, {
          text: 'Si',
          cssClass: 'buttonOk',
          handler: () => {
            console.log('Confirmado');
            this.direccionService.remove(item).subscribe((data: any) => {

              this.ls.deleteStoreData("direcciones");
              this.globalService.pageTransition();
              this.navCtrl.navigateForward('direcciones');

            }, (err: any) => {
              console.error('error de validacion', err.status);
            });
          }
        }
      ]
    });

    await aviso.present();
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminada',
      mode: 'ios',
      message: '<h5>La dirección ha sido eliminada</h5>',
      cssClass: 'alertText',
      buttons: ['OK']
    });

    await alert.present();
  }

  irAtras() {
    this.globalService.pageTransition();
  }

}
