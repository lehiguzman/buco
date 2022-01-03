import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Platform } from '@ionic/angular';
import {
  GlobalService, LocalStorageService,
  ClienteTarjetaService, ApplicationInsightsService,
  ProfesionalMetodoPagoService, MetodoPagoService
} from '../../../providers';

@Component({
  selector: 'app-metodo-pago-list',
  templateUrl: './metodo-pago-list.page.html',
  styleUrls: ['./metodo-pago-list.page.scss'],
})

export class MetodoPagoListPage implements OnInit {

  backUnable: any;
  metodosPago: any = [];
  metodosPagoBuco: any = [];

  constructor(
    private alertCtrl: AlertController,
    private appInsights: ApplicationInsightsService,
    private lsServ: LocalStorageService,
    private metodosPagoApi: MetodoPagoService,
    private navCtrl: NavController,
    private platform: Platform,
    private profesionalMPApi: ProfesionalMetodoPagoService,
    private tarjetaApi: ClienteTarjetaService,
    public globalServ: GlobalService,
  ) { }

  ngOnInit() { this.globalServ.loadingCustom(); }
  ionViewWillEnter() { }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    if (this.globalServ.UsuarioTipo === 'cliente') this.appInsights.startTrackPage('cliente_tarjeta_listado');
    if (this.globalServ.UsuarioTipo === 'profesional') this.appInsights.startTrackPage('profesional_metodospago_listado');
    this.backUnable = this.platform.backButton.subscribeWithPriority(9999, () => {
      this.navCtrl.navigateBack('home');
    });

    this.listarMetodosPago();
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    if (this.globalServ.UsuarioTipo === 'cliente') this.appInsights.stopTrackPage('cliente_tarjeta_listado');
    if (this.globalServ.UsuarioTipo === 'profesional') this.appInsights.stopTrackPage('profesional_metodospago_listado');
    this.backUnable.unsubscribe();
  }

  listarMetodosPago() {
    this.metodosPago = [];

    this.lsServ.getActiveUser().then((usuario: any) => {

      if (this.globalServ.UsuarioTipo === 'cliente') {
        this.globalServ.loadingCustom("Cargando Listado de Tarjetas...");

        this.lsServ.getStoreData("metodosPagoCliente").then((tarjetas: any) => {
          if (Array.isArray(tarjetas)) {
            console.log("Tiene las tarjetas en store");
            this.globalServ.dismissLoader();
            this.metodosPago = tarjetas;
          } else {
            this.tarjetaApi.list().subscribe((resp: any) => {
              console.log("Respuesta : ", resp);
              this.globalServ.dismissLoader();
              this.metodosPago = resp.data;
              this.lsServ.setStoreData("metodosPagoCliente", resp.data);
            });
          }
        });
      }

      if (this.globalServ.UsuarioTipo === 'profesional' && (usuario.profesional && usuario.profesional.id)) {
        this.globalServ.loadingCustom("Cargando Métodos de Pago...");
        this.profesionalMPApi.list().subscribe((resp: any) => {
          this.globalServ.dismissLoader();
          this.metodosPago = resp.data;
          this.lsServ.setStoreData("metodosPagoProfesional", resp.data);

          this.metodosPagoApi.list().subscribe((resp: any) => {
            this.metodosPagoBuco = resp.data.map(item => {
              item.isChecked = this.metodosPago.find(i => i.metodoPago.id === item.id) ? true : false;
              return item;
            }).filter(i => !i.isChecked);
          });
        });
      }
    });
  }

  verDetalle(id) {
    this.globalServ.pageTransition();
    this.navCtrl.navigateForward(`metodo-pago-detalle/${id}`);
  }

  agregarMetodoPago() {
    this.globalServ.pageTransition();
    this.navCtrl.navigateForward('metodo-pago-add');
  }

  editar(item) {
    this.metodosPago.find(element => {
      if (element.id == item) {
        this.lsServ.setStoreData("metodoPago", element);
      }
    });
    this.globalServ.pageTransition();
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
          handler: (blah) => { }
        }, {
          text: 'Si',
          cssClass: 'buttonConfirm',
          handler: () => {
            this.globalServ.loadingCustom("Eliminando Tarjeta...");
            this.tarjetaApi.remove(item).subscribe((resp: any) => {
              if (resp.code == 200 || resp.code == 204) {
                this.lsServ.deleteStoreData("metodosPago");
                this.globalServ.mensaje({ message: resp.message, color: 'success', position: 'middle' });
                this.listarMetodosPago();
              } else {
                this.globalServ.mensaje({ message: resp.message, color: 'danger', position: 'middle' });
              }
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
        handler: () => { }
      }]
    });

    await alert.present();
  }

  irAtras() {
    this.navCtrl.navigateBack('home');
    this.globalServ.pageTransition();
  }


  // ======= Métodos del Profesional
  isActive(item: any) {
    return item.status === 0 ? true : false
  }

  eliminarMetodoPago(item: any) {
    this.globalServ.loadingCustom("Eliminando Método de Pago...");
    this.profesionalMPApi.remove(item.id).subscribe(resp => {
      this.globalServ.mensaje({ message: "Método eliminado con éxito", color: 'success', position: 'middle' });
      this.listarMetodosPago();
    });
  }

  actualizarMetodosPago() {
    const metodos = this.metodosPagoBuco.filter(i => i.isChecked);
    if (metodos.length == 0) {
      this.globalServ.mensaje({ message: "No ha seleccionado ningún método" });
      return;
    }
    this.globalServ.loadingCustom("Actualizando Métodos de Pago...");
    for (const meto of metodos) {
      this.profesionalMPApi.create({ metodoPago_id: meto.id }).subscribe(resp => {
        this.globalServ.mensaje({ message: "Métodos Actualizados con éxito", color: 'success', position: 'middle' });
        this.listarMetodosPago();
      });
    }
  }

}
