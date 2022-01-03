import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';
import { NavigationExtras, ActivatedRoute } from '@angular/router';

import { GlobalService, LocalStorageService, MetodoPagoService, FormularioDinamicoServicioService, ApplicationInsightsService } from '../../../providers/';

import * as moment from 'moment';

@Component({
  selector: 'app-profesional-filter',
  templateUrl: './profesional-filter.page.html',
  styleUrls: ['./profesional-filter.page.scss'],
})

export class ProfesionalFilterPage implements OnInit {

  /*ubicacion: any = {
    latitud: 8.99797,
    longitud: -79.508096
  }*/

  min: any;
  max: any;
  profesionales: any[] = [];
  metodosPago: any[] = [];
  metodosPagoSeleccionados: any[] = [];

  opcionesSimple: any[];
  opcionesMultiple: any[];

  //Campo Especificos  
  camposEspecificos: any[] = [];  

  hayCampos: number = 0;

  genero: number = 0;

  constructor(private ls: LocalStorageService,
              private metodoPagoService: MetodoPagoService,
              private formularioDinamicoServicioService: FormularioDinamicoServicioService,
              private appInsights: ApplicationInsightsService,
              private globalService: GlobalService,
              private navCtrl: NavController) { }

  ngOnInit() { 

    this.listarMetodosPago();    

    this.ls.getStoreData("servicio").then( ( servicio: any ) => {
      console.log("Servicio : ", servicio );

      this.formularioDinamicoServicioService.detail( servicio ).subscribe( ( data: any ) => {
        
        var campo = data.data;
        moment.locale('es');

        campo.forEach( element => {

          //inicialización de variables
          var desde: string = null;
          var hasta: string = null;
          this.opcionesSimple = [];
          this.opcionesMultiple = [];

          //Condicionales para inicializar variables independientes por tipo( 6 => hora, 7 => fecha y hora, 9 => Selección simple, 10 => Selección múltiple  )
          if( element.formularioDinamico.id == 6 ) {
            desde = null;//moment().format('LT');            
            hasta = null;//moment().format('LT');
          } else if( element.formularioDinamico.id == 7 ) {
            desde = null;//moment().format('LLLL');            
            hasta = null;//moment().format('LLLL');
          } else if( element.formularioDinamico.id == 9 ) {
            //convertir a array             
            this.opcionesSimple = element.opciones.split(";");

            //Elimina el ultimo elemento
            //this.opcionesSimple.pop();            
            
          } else if( element.formularioDinamico.id == 10 ) {
            console.log("Opciones : ", element.opciones);
            
            var opciones = element.opciones.split(";");

            //Elimina el ultimo elemento
            //opciones.pop();

            //Se crea otro arreglo con las opciones para poder adjuntar el estatus de seleccion por cada opcion
            opciones.forEach( element => { 
              this.opcionesMultiple.push({
                elemento: element,
                seleccion: false
              });
            });
          }

          //Se crea un arreglo independiente con los datos organizados para la vista
          this.camposEspecificos.push({
            nombre: element.nombre,
            formulario_id: element.formularioDinamico.id,
            opcionesSimple: this.opcionesSimple,
            opcionesMultiple: this.opcionesMultiple,  
            desde: desde,
            hasta: hasta          
          });          
        });
      });
    });
  }

  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('profesional_filter');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('profesional_filter');  
    this.camposEspecificos = [];  
  } 

  listarMetodosPago() {
    
    this.metodoPagoService.list().subscribe( ( metodosPago: any ) => {
      console.log("Metodos de pago : ", metodosPago);
      this.metodosPago = metodosPago.data;
    });
  }

  asignarValores(e: any) {
    this.min = e.target.value.lower;
    this.max = e.target.value.upper;
  }

  filtrar() {    

    let datos: NavigationExtras = {
      queryParams: {
        min: this.min,
        max: this.max,
        genero: this.genero, 
        metodos: this.metodosPagoSeleccionados,
        datosEspecificos: this.camposEspecificos
      }
    }

    console.log("Datos de filtro : ", datos);
    this.globalService.pageTransition();
    this.navCtrl.navigateForward('profesional-result', datos);
  }

  filtrarGenero(e: any) {
    this.genero = e.detail.value;    
  }

  seleccionMetodo( ev: any ) {
    
    let indexElemento = this.metodosPagoSeleccionados.indexOf( ev.target.value );    

    if( indexElemento === -1 ){
      this.metodosPagoSeleccionados.push(ev.target.value);       
    } else if( indexElemento > -1 ) {
      this.metodosPagoSeleccionados.splice(indexElemento, 1); 
    }    
  }
}
