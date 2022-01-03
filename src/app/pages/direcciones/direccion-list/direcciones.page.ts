import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Platform } from '@ionic/angular';
// Services
import {
  GlobalService, LocalStorageService,
  DireccionService, ApplicationInsightsService,
  ProfesionalPreRegistroService
} from '../../../providers/';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.page.html',
  styleUrls: ['./direcciones.page.scss'],
})
export class DireccionesPage implements OnInit {

  direcciones: any;
  backUnable: any;
  idPrincipal: number;
  esPreregistro: boolean;

  constructor(
    private alertCtrl: AlertController,
    private appInsights: ApplicationInsightsService,
    private direccionService: DireccionService,
    private lsServ: LocalStorageService,
    private navCtrl: NavController,
    private platform: Platform,
    private preRegistroApi: ProfesionalPreRegistroService,
    public globalServ: GlobalService,
  ) { }

  ngOnInit() { }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('direcciones_list');
    this.backUnable = this.platform.backButton.subscribeWithPriority(9999, () => {
      this.navCtrl.navigateBack('home');
    });
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('direcciones_list');
    this.backUnable.unsubscribe();
  }

  ionViewWillEnter() {
    console.clear();
    this.lsServ.getStoreData("esPreregistro").then((esPreregistro: boolean) => {
      this.esPreregistro = esPreregistro;
      if (this.esPreregistro) {
        this.lsServ.getStoreData("preRegistro_direccionID").then((data: any) => {
          if (data) this.idPrincipal = data;
        });
      }
    });
    this.listarDirecciones();
  }

  listarDirecciones() {
    this.globalServ.loadingCustom("Cargando Direcciones...");
    this.lsServ.getStoreData("direcciones").then((direcciones: any) => {
      if (direcciones && direcciones.data) {
        this.direcciones = direcciones.data;
        this.globalServ.dismissLoader();
      } else {
        this.lsServ.getStoreData("usuario").then((usuario: any) => {
          if (usuario && usuario.data && usuario.data.id) {
            this.direccionService.list(usuario.data.id).subscribe((direcciones: any) => {
              this.globalServ.dismissLoader();
              if (direcciones && direcciones.data) {
                this.lsServ.setStoreData("direcciones", direcciones);
                this.direcciones = direcciones.data;
              }
            });
          } else {
            this.globalServ.dismissLoader();
          }
        });
      }
    });
  }

  agregarDireccion() {
    this.globalServ.pageTransition();
    this.navCtrl.navigateForward('direccion-mapa');
  }

  editar(item) {
    this.direcciones.find(element => {
      if (element.id == item) {
        this.lsServ.setStoreData("direccion", element);
      }
    });
    this.globalServ.pageTransition();
    this.navCtrl.navigateForward('direccion-mapa');
  }

  async eliminar(item) {
    let aviso = await this.alertCtrl.create({
      header: 'Confirmar',
      mode: 'ios',
      message: '<h5>¿Desea eliminar esta dirección?</h5>',
      buttons: [
        {
          text: 'No',
          cssClass: 'buttonCancel',
          role: 'cancel',
          handler: (blah) => {
            console.info('Cancelado');
          }
        }, {
          text: 'Si',
          cssClass: 'buttonConfirm',
          handler: () => {
            this.direccionService.remove(item).subscribe((data: any) => {
              if (data.code == 204 || data.code == 200) {
                this.globalServ.loadingCustom();
                this.lsServ.deleteStoreData("direcciones");
                this.globalServ.mensaje({ message: data.message, color: 'success', position: 'middle' });
                this.listarDirecciones();
              } else {
                this.globalServ.mensaje({ message: data.message, color: 'danger', position: 'middle' });
              }
            });
          }
        }
      ]
    });

    await aviso.present();
  }

  verDetalle(item) {
    this.direcciones.find(element => {
      if (element.id == item) {
        this.lsServ.setStoreData("direccion", element);
      }
    });
    this.globalServ.pageTransition();
    this.navCtrl.navigateForward(`direccion-detalle/${item}`);
  }

  cambiarDireccion(id: number) {
    this.idPrincipal = id;
    this.globalServ.loadingCustom("Guardando Dirección...", 9999);
    this.lsServ.getStoreData("preRegistro_servicioPostular").then((servicio: any) => {
      if (servicio) {
        this.lsServ.setStoreData("preRegistro_direccionID", id);
        this.preRegistroApi.create({ direccionID: id, servicioID: servicio.id }).subscribe((data) => {
          console.log("Data : ", data);
          this.globalServ.dismissLoader();
        });
      }
    });
  }

  irAPreregistro() {
    this.navCtrl.navigateForward("preregistro-home");
  }

  irAtras() {
    this.globalServ.pageTransition();
    this.lsServ.getStoreData('perfilProfesional').then((perfilProfesional: any) => {
      var url = perfilProfesional ? 'orden-servicio-list' : 'home';
      this.navCtrl.navigateBack(url);
    });
  }
}
