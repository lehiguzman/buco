import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';

import {
  GlobalService,
  LocalStorageService,
  ProfesionalService,
  ProfesionalTareaService,
  OrdenServicioService,
  ApplicationInsightsService
} from '../../../providers/';

@Component({
  selector: 'app-profesional-list',
  templateUrl: './profesional-list.page.html',
  styleUrls: ['./profesional-list.page.scss'],
})
export class ProfesionalListPage implements OnInit {

  id: any;
  profesionales: any[] = [];
  profesionalesSeleccionados: any[] = [];
  distanciaProfesional: any;
  textoBuscar: string = '';
  ubicacion: any;
  distancia: any = 0;
  odsfinalizadas: number = 0;
  idSistema: number;
  archivosPortafolio: number;

  constructor(private route: ActivatedRoute,
    private geolocation: Geolocation,
    private globalService: GlobalService,
    private profesionalService: ProfesionalService,
    private profesionalTareaService: ProfesionalTareaService,
    private appInsights: ApplicationInsightsService,
    private ordenServicioService: OrdenServicioService,
    private ls: LocalStorageService,
    private navCtrl: NavController,
    private alertCtrl: AlertController) { }

  ngOnInit() {

    this.globalService.loadingCustom();
    this.ls.getStoreData("idSistema").then((idSistema: any) => {
      console.log("Sistema id : ", idSistema);
      this.idSistema = idSistema;
    });
    this.obtenerPosicionActual((response, error) => {

      //console.log("Latitud actual : ", response.lat);
      //console.log("Longitud actual : ", response.lng);

      //Se utilizan las coordenadas geograficas del centro de panama por defecto (Provisional) 
      this.ubicacion = {
        latitud: 8.99797,
        longitud: -79.508096
      }
    });

    this.id = this.route.snapshot.paramMap.get('id');
    //console.log( "id de servicio : ", this.id );
    this.listarProfesionales();
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('profesional_list');
    console.log("Borro los profesionales seleccionados");
    this.profesionalesSeleccionados = [];
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('profesional_list');
  }

  listarProfesionales() {

    console.log("Servicio ID : ", this.id);

    this.profesionalService.listPorServicio(this.id).subscribe((data: any) => {
      console.log("Lista de profesionales por servicio: ", data.data);

      var registros = data.data;

      registros.forEach(element => {        
        var tarifas = [];

        console.log("Datos de portafolio : ", element.portafolio);        

        //Recorta el primer nombre y primer apellido
        let cortarNombre = element.profesional.nombre.split(' ');
        let primerNombre = cortarNombre[0];

        let cortarApellido = element.profesional.apellido.split(' ');
        let primerApellido = cortarApellido[0];   
        
        if( element.tareas.length > 0) {
          element.tareas.forEach(tarea => { tarifas.push(tarea.precio); });

          var tarifaMinima = tarifas.reduce( (a,b) => Math.min(a,b) );
        }                

        var odsFinalizadas = element.ordenes_servicio.filter(element => (element.ordenServicio.estatus == 7 || element.ordenServicio.estatus == 8));

        var distancia = element.distancia ? element.distancia.distancia : 0;
        var calificacion = element.calificacion ? element.calificacion.promedioGeneral : 0;        

        this.profesionales.push({
          id: element.profesional.id,
          nombre: primerNombre,
          apellido: primerApellido,
          foto: element.profesional.user.foto,
          destreza_detalle: element.profesional.destreza_detalle,
          aniosExperiencia: element.profesional.aniosExperiencia,
          servicio: element.profesional.servicio.nombre,
          distancia: distancia,
          calificacion: calificacion,
          genero: element.profesional.user.genero,
          metodosPago: element.metodos_pago,
          seleccionado: false,
          odsFinalizadas: odsFinalizadas.length,
          tarifaMinima: tarifaMinima,
          tareas: element.tareas,
          datosEspecificos: element.profesional.datosEspecificos,
          portafolio: element.portafolio
        });        
      });
      this.globalService.dismissLoader().then(() => { console.log("dismissed") });
    });
  }

  buscarProfesional(event) {

    this.textoBuscar = event.detail.value;
    this.navCtrl.navigateForward('profesional-filter');
  }

  irAPortafolio(profesional){
    console.log("prueba de protafolio");
    this.ls.setStoreData("profesional", profesional);
    this.navCtrl.navigateForward('profesional-portafolio');    
  }

  irAFiltro() {

    this.ls.setStoreData("servicio", this.id);
    console.log("Lista de profesionales : ", this.profesionales);

    this.ls.setStoreData("profesionales", this.profesionales);
    this.globalService.pageTransition();
    this.navCtrl.navigateForward('profesional-filter');

  }

  detalle(profesional) {

    if (this.idSistema == 2) {
      this.profesionales.forEach(element => {
        if (element.id == profesional.id) {
          if (element.seleccionado) {
            let index = this.profesionalesSeleccionados.indexOf(profesional);
            console.log("index : ", index);
            if (index > -1) {
              this.profesionalesSeleccionados.splice(index, 1);
            }
          } else {
            this.profesionalesSeleccionados.push(profesional);
          }
          element.seleccionado = !element.seleccionado;
        }
      });
      return false;
    } else {
      this.ODSCalificar();
      this.profesionalesSeleccionados.push(profesional);
      this.ls.setStoreData("profesional", profesional);
    }
  }

  solicitarServicio() {
    console.log("Profesional seleccionado: ", this.profesionalesSeleccionados);
    this.ls.setStoreData("profesional", this.profesionalesSeleccionados[0]);
    this.ODSCalificar();
  }

  ODSCalificar() {

    this.ls.getActiveUser().then((usuario: any) => {
      this.ordenServicioService.listUser(usuario.id).subscribe((ordenesServicio: any) => {
        var ods = ordenesServicio.data;
        var odsPorCalificar = ods.filter(element => element.estatus == 7);
        if (odsPorCalificar.length > 0) {
          var odsId = odsPorCalificar[0].id;
          var msg = 'La Orden # ' + odsId + ' debe ser calificada para poder continuar';
          this.irACalificacion(msg, odsId);
        } else {
          this.ls.setStoreData("profesionalesODS", this.profesionalesSeleccionados);
          this.globalService.pageTransition();
          this.navCtrl.navigateForward(`profesional-detail`);
        }
      });
    });
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

  async irACalificacion(msg: string, odsId: number) {
    const alert = await this.alertCtrl.create({
      //header: '',  
      mode: 'ios',
      message: msg,
      buttons: [{
        text: 'Calificar',
        cssClass: 'buttonOk',
        handler: () => {
          alert.dismiss().then(() => {
            this.globalService.pageTransition();
            var datosCalificacion = {
              ordenServicio_id: odsId,
            }
            this.ls.setStoreData("datosCalificacion", datosCalificacion)
            this.navCtrl.navigateForward('calificacion');
          })
        }
      }]
    });

    await alert.present();
  }
}
