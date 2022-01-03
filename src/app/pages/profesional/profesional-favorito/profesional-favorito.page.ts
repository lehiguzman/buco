import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation';

import { GlobalService, LocalStorageService, FavoritoService, ProfesionalService, ApplicationInsightsService } from '../../../providers';

@Component({
  selector: 'app-profesional-favorito',
  templateUrl: './profesional-favorito.page.html',
  styleUrls: ['./profesional-favorito.page.scss'],
})
export class ProfesionalFavoritoPage implements OnInit {

  id: any;
  profesionales: any[] = [];
  distanciaProfesional: any;
  textoBuscar: string = '';
  ubicacion: any;
  distancia: any = 0;
  empty: string = ""

  resultados: number;
  backUnable: any;

  constructor(private route: ActivatedRoute,
    private geolocation: Geolocation,
    private globalService: GlobalService,
    private ls: LocalStorageService,
    private favoritoService: FavoritoService,
    private profesionalService: ProfesionalService,
    private appInsights: ApplicationInsightsService,
    private navCtrl: NavController,
    private platform: Platform) { }

  ngOnInit() {

    this.globalService.loadingCustom(null);

    this.obtenerPosicionActual((response, error) => {

      console.log("Latitud actual : ", response.lat);
      console.log("Longitud actual : ", response.lng);

      //Se utilizan las coordenadas geograficas del centro de panama por defecto (Provisional) 
      this.ubicacion = {
        latitud: 8.99797,
        longitud: -79.508096
      }

    });

    this.id = this.route.snapshot.paramMap.get('id');
    //console.log( "id de servicio : ", this.id );
    this.listarFavoritos();
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('profesional_favorito');
    this.backUnable = this.platform.backButton.subscribeWithPriority(9999, () => {
      this.navCtrl.navigateBack('home');
    });
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('profesional_favorito');
    this.backUnable.unsubscribe();
  }

  listarFavoritos() {
    this.ls.getStoreData("usuario").then((usuario: any) => {
      this.favoritoService.list(usuario.data.id).subscribe((favoritos: any) => {
        //console.log("Favoritos lista : ", favoritos.data);    
        this.resultados = favoritos.totalRecords;
        //Recorre todos los profesionales
        for (const favorito in favoritos.data) {

          if (favoritos.data.hasOwnProperty(favorito)) {

            const element = favoritos.data[favorito];
            //Recorta el primer nombre y primer apellido

            let cortarNombre = element.profesional.nombre.split(' ');
            let primerNombre = cortarNombre[0];

            let cortarApellido = element.profesional.apellido.split(' ');
            let primerApellido = cortarApellido[0];

            let distancia: 0.0;
            let puntuacion: 0;

            //if(element.user.id == usuario.data.id) {

            //Obtengo la distancia de cada profesional individualmente
            this.profesionalService.getDistancia(element.profesional.id, this.ubicacion).subscribe((cobertura: any) => {
              //Obtengo la calificacion de cada profesional individualmente
              if (cobertura.data) { distancia: cobertura.data.distancia; } else { distancia = 0; }

              this.profesionalService.getPopularidad(element.profesional.id).subscribe((calificacion: any) => {
                //Cargo un objeto "profesionales" con los datos necesarios para la vista                  
                if (calificacion.data) { puntuacion: calificacion.data.promedioGeneral; }

                this.globalService.dismissLoader();
                this.profesionales.push({
                  id: element.profesional.id,
                  nombre: primerNombre,
                  apellido: primerApellido,
                  foto: element.profesional.user.foto,
                  destreza_detalle: element.profesional.destreza_detalle,
                  servicio: element.profesional.servicio.nombre,
                  distancia: distancia,
                  calificacion: puntuacion
                });
              });
            });
          }
        }
      }, (err: any) => { this.globalService.dismissLoader(); this.resultados = 0; console.log("Error"); });
    });
  }

  buscarProfesional(event) {

    this.textoBuscar = event.detail.value;

  }

  irAFiltro() {

    this.globalService.pageTransition();
    this.navCtrl.navigateForward('profesional-filter');

  }

  detalle(id) {

    this.globalService.pageTransition();
    this.navCtrl.navigateForward(`profesional-detail/${id}`);

  }

  buscarProfesionales() {

    this.globalService.pageTransition();
    this.navCtrl.navigateForward('departamento');
  }

  /*  se obtiene la posicion actual si no se puede se retorna el valor por defecto que es en ciudad de panama  */
  obtenerPosicionActual(callback) {
    let options = {
      timeout: 50000,
      enableHighAccuracy: false,
      maximumAge: 36000
    };
    this.geolocation.getCurrentPosition(options)
      .then(response => {
        return callback({
          lat: response.coords.latitude,
          lng: response.coords.longitude
        }, null);
      }).catch(error => {
        //this.alerta.titulo = "No se pudo obtener su ubicación actual";
        //this.alerta.visible = true;
        return callback({
          lat: 8.99797,
          lng: -79.508096
        }, null);
      });
  }

}
