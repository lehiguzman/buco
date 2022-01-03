import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, Platform } from '@ionic/angular';
import {
  GlobalService, LocalStorageService, FirebaseAuthService,
  ClienteTarjetaService, DireccionService,
  ApplicationInsightsService
} from '../../providers';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  userId: any;
  backUnable: any;

  constructor(
    private appInsights: ApplicationInsightsService,
    private direccionService: DireccionService,
    private fireAuthServ: FirebaseAuthService,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private platform: Platform,
    private tarjetaApi: ClienteTarjetaService,
    public globalServ: GlobalService,
    public lsServ: LocalStorageService,
  ) { this.globalServ.dismissLoader(); }

  ngOnInit() {
    this.globalServ.presentLoadingPrincipal();
    this.lsServ.deleteStoreData("idSistema");
    this.lsServ.deleteStoreData('metodoPago');
    this.bloquearMenu();
  }
  ionViewWillEnter() {
    if (!this.globalServ.UsuarioLogueado) {
      this.globalServ.pageTransition();
      this.navCtrl.navigateRoot('login');
    }
    this.lsServ.getActiveUser().then((usuario: any) => {
      if (usuario) {
        // code here
      } else {
        this.cerrarSesion();
      }
    });
  }
  ionViewWillLeave() { }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('home');

    this.backUnable = this.platform.backButton.subscribeWithPriority(9999, () => {
      console.log("Boton hardware atras deshabilitado ");
    });
    this.menuCtrl.enable(true);

    // AQUI COMIENZA LA CARGA DE DATOS
    this.lsServ.getActiveUser().then((usuario: any) => {
      if (usuario && usuario.id) {
        this.cargarMetodosPago();
        this.cargarDirecciones(usuario.id);

        // guardar para evitar errores
        this.lsServ.setStoreData("usuario", { data: usuario });
      }
    });
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('home');
    this.backUnable.unsubscribe();
  }

  irADepartamentos(idSistema: number) {
    this.lsServ.setStoreData("idSistema", idSistema);
    this.globalServ.pageTransition();
    this.navCtrl.navigateForward(`departamento/${idSistema}`);
  }

  cargarMetodosPago() {
    this.tarjetaApi.list().subscribe((resp: any) => {
      this.lsServ.setStoreData("metodosPago", resp);
    });
  }

  cargarDirecciones(userId: any) {
    this.direccionService.list(userId).subscribe((direcciones: any) => {
      this.lsServ.setStoreData("direcciones", direcciones);
    });
  }

  bloquearMenu() {
    this.lsServ.getStoreData("usuario").then((usuario: any) => {
      if (usuario && usuario['data'] && usuario['data']['id']) {
        this.userId = usuario.data.id;
      }
      this.globalServ.dismissLoader();
    });
  }

  cerrarSesion() {
    this.globalServ.loadingCustom();
    this.globalServ.pageTransition();
    this.fireAuthServ.logout().finally(() => {
      this.lsServ.deleteAllStoreData();
      this.navCtrl.navigateRoot("/login", { replaceUrl: true });
    })
  }

}
