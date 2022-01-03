import { Component, OnInit } from '@angular/core';

import { NavigationExtras, ActivatedRoute } from '@angular/router';

import { GlobalService, LocalStorageService, UsuarioService, ApplicationInsightsService } from '../../../providers';

import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-servicio-dir',
  templateUrl: './servicio-dir.page.html',
  styleUrls: ['./servicio-dir.page.scss'],
})
export class ServicioDirPage implements OnInit {

  direcciones: any = [];
  pinNegro: string = "/assets/icons/locate.jpg";
  pinAzul: string = "/assets/icons/locate-azul.png";
  textoBuscar: string = '';
  longitud: any;
  latitud: any;
  direccion: any;
  profesionalesODS: any[] = [];
  cantidadProfesionales: number = 1;
  porcentajeBackup: number = null;
  tareas: any;


  constructor(private globalService: GlobalService,
    private usuarioService: UsuarioService,
    private appInsights: ApplicationInsightsService,
    private ls: LocalStorageService,
    public activatedRoute: ActivatedRoute,
    private navCtrl: NavController) { }

  ngOnInit() {
    //console.clear();

    this.globalService.loadingCustom();

    /*this.activatedRoute.queryParams.subscribe(params => {

      this.profesionalId = params["profesionalId"];
      this.tareas = params["tareas"];
      
    });*/
    this.ls.getStoreData("ods").then((ods: any) => {
      console.log("Datos de ods : ", ods);
      this.profesionalesODS = ods.profesionalesODS;
      this.cantidadProfesionales = ods.cantidadProfesionales;
      this.porcentajeBackup = ods.porcentajeBackup;
      this.tareas = ods.tareas;


      this.listarDirecciones();
    });
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('servicio_direccion');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('servicio_direccion');
  }

  listarDirecciones() {
    this.ls.getActiveUser().then((usuario: any) => {
      this.usuarioService.listDirecciones(usuario.id).subscribe((data: any) => {        
        this.direcciones = data.data;
        this.globalService.dismissLoader();
      });
    });
  }

  buscarDireccion(event) {

    this.textoBuscar = event.detail.value;

  }

  irAMetodoPago(longitud: any, latitud: any, direccion: any) {    

    var ods = {
      profesionalesODS: this.profesionalesODS,
      cantidadProfesionales: this.cantidadProfesionales,
      porcentajeBackup: this.porcentajeBackup,
      tareas: this.tareas,
      latitud: latitud,
      longitud: longitud,
      direccion: direccion
    }

    this.ls.setStoreData("ods", ods);

    this.globalService.pageTransition();
    this.navCtrl.navigateForward('servicio-pago');
  }

  irAMapa() {
    this.navCtrl.navigateForward('servicio-map');
  }
}
