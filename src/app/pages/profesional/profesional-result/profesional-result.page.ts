import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';

import { GlobalService, LocalStorageService, ProfesionalService, ProfesionalMetodoPagoService, ApplicationInsightsService } from '../../../providers/';

import * as moment from 'moment';

@Component({
  selector: 'app-profesional-result',
  templateUrl: './profesional-result.page.html',
  styleUrls: ['./profesional-result.page.scss'],
})
export class ProfesionalResultPage implements OnInit {

  cargador: any;
  min: any;
  max: any;  
  genero: number;  
  metodosPago: any = [];
  profesionales: any = [];    
  textoBuscar: string = ''; 
  ubicacion: any;
  servicio: any;  
  datosEspecificos: any;

  isDesc: boolean = true;
  column: string;
  direction: number;  

  resultados: number;  
  filtro: boolean;

  constructor( private activatedRoute: ActivatedRoute,
               private appInsights: ApplicationInsightsService,
               private profesionalService: ProfesionalService,
               private profesionalMetodoPagoService: ProfesionalMetodoPagoService,
               private globalService: GlobalService,
               private ls: LocalStorageService, 
               private navCtrl: NavController,
               private loadingCtrl: LoadingController ) { 
               }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {

      this.min = params["min"];
      //console.log("Minimo : ", this.min);
      this.max = params["max"];
      //console.log("Maximo : ", this.max);
      this.genero = params["genero"];
      //console.log("Maximo : ", this.genero);
      this.metodosPago = params["metodos"];
      //console.log("Maximo : ", this.metodosPago);
      this.datosEspecificos = params["datosEspecificos"];
      console.log("Maximo : ", this.datosEspecificos);
      this.filtrarProfesionales();  
    });
    
    
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('profesional_result');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('profesional_result');  
    this.profesionales = [];  
  } 

  filtrarProfesionales() {    
     //Se utilizan las coordenadas geograficas del centro de panama por defecto (Provisional) 
    this.ubicacion = {
      latitud: 9.102632821782235, //8.99797,
      longitud: -79.5181158840135 //-79.553894790802
    }   
   
    this.ls.getStoreData("profesionales").then( ( profesionales: any ) => {
      console.log("Datos de profesionales : ", profesionales );
      profesionales.forEach( element => {     

        var cumpleMetodoPago: boolean = true;
        var cumpleDistancia: boolean = true;
        var cumpleGenero: boolean = true;
        var cumpleEspecifico: boolean = true;
        
        if( !(this.min < element.distancia && this.max > element.distancia) ) {                         
          cumpleDistancia = false;          
        }        

        if( this.genero ) {
          if( this.genero != element.genero ) {
            cumpleGenero = false;
          }
        }                

        if( this.metodosPago.length > 0 ) {
          element.metodosPago.find( data => {          
            var encontrado = this.metodosPago.includes( String(data.metodoPago.id) );  
            console.log(encontrado);
            if( !encontrado ) cumpleMetodoPago = false;
          });
        }  
        
        if( element.datosEspecificos ) {
          console.log("dato Texto")
          element.datosEspecificos.forEach( datoEspecifico => {            
            if( datoEspecifico.formdina_tipo == "text" ) {
              console.log("Dato tipo : ", datoEspecifico.formdina_tipo);
              this.datosEspecificos.filter( dato => {
                if( dato.nombre == datoEspecifico.nombre && dato.valor && (datoEspecifico.valor.search(dato.valor.toLowerCase()) > -1 )) {
                  console.log("Encontrado : ", dato.valor );
                } else if( dato.valor && dato.valor.length > 0 ) {   
                  console.log("Profesional descartado texto");
                  cumpleEspecifico = false;
                }
              });
            } else if( datoEspecifico.formdina_tipo == "number" || datoEspecifico.formdina_tipo == "decimal" || datoEspecifico.formdina_tipo == "money" ) {
              console.log("Dato numerico")
              this.datosEspecificos.filter( dato => {
                if( dato.nombre == datoEspecifico.nombre && dato.desde && dato.hasta ) {
                  if( dato.desde <= datoEspecifico.valor && dato.hasta >= datoEspecifico.valor ) {
                    console.log("Encontrado numerico: ", datoEspecifico.valor );
                  } else if( dato.desde && dato.hasta && (dato.desde > 0 && dato.hasta > 0 )) {
                    console.log("Profesional descartado numerico");
                    cumpleEspecifico = false;
                  }
                }
              });
            } else if( datoEspecifico.formdina_tipo == "date" ) {
              console.log("Dato Fecha")
              this.datosEspecificos.filter( dato => {
                if( dato.nombre == datoEspecifico.nombre && dato.desde && dato.hasta ) {          
                  //Consierte fecha de BD en String de Valores
                  var anio = moment(datoEspecifico.valor, 'DD/MM/YYYY').format('YYYY');
                  var mes = moment(datoEspecifico.valor, 'DD/MM/YYYY').format('MM');
                  var dia = moment(datoEspecifico.valor, 'DD/MM/YYYY').format('DD');        
                  
                  //Crea un Objeto date con los valores de la fecha de BD                  
                  var fechaBuscar = new Date(Number(anio), Number(mes), Number(dia));                  
                  var fechaDesde = new Date(dato.desde);                  
                  var fechaHasta = new Date(dato.hasta);

                  console.log("Fecha desde : ", dato.desde.length);
                  console.log("Fecha hasta : ", dato.hasta.length);
                  
                  if( fechaDesde <= fechaBuscar && fechaHasta >= fechaBuscar ) {
                    console.log("Encontrado Fecha: ", datoEspecifico.valor );
                  } else {                    
                    console.log("Profesional descartado fecha");
                    cumpleEspecifico = false;
                  }               
                }
              });
            } else if( datoEspecifico.formdina_tipo == "time" ) {
              console.log("Dato Hora") 
              this.datosEspecificos.filter( dato => {
                if( dato.nombre == datoEspecifico.nombre && dato.desde && dato.hasta ) {                      
                  var horaDesde = dato.desde;                  
                  var horaHasta = dato.hasta;                  
                  var hora = moment(datoEspecifico.valor, 'HH:mm A').format('HH');                  

                  if(  horaDesde <= hora && horaHasta >= hora ) {
                    console.log("Hora encontrada : ", hora);
                  } else {           
                    console.log("Profesional descartado hora");         
                    cumpleEspecifico = false;
                  }     
                }
              })
            } else if( datoEspecifico.formdina_tipo == "datetime" ) {
              console.log("Dato Fecha Hora");
              this.datosEspecificos.filter( dato => { 
                if( dato.nombre == datoEspecifico.nombre && dato.desde && dato.hasta ) {

                  var anio = moment(datoEspecifico.valor, 'DD/MM/YYYY HH:mm A').format('YYYY');
                  var mes = moment(datoEspecifico.valor, 'DD/MM/YYYY  HH:mm A').format('MM');
                  var dia = moment(datoEspecifico.valor, 'DD/MM/YYYY  HH:mm A').format('DD');
                  var hora = moment(datoEspecifico.valor, 'HH:mm A').format('HH');

                  var fechaHoraBuscar = new Date(Number(anio), Number(mes), Number(dia), Number(hora));                  
                  console.log("FechaHora buscar : ", fechaHoraBuscar);
                  var fechaHoraDesde = new Date(dato.desde);          
                  console.log("FechaHora Desde : ", fechaHoraDesde);         
                  var fechaHoraHasta = new Date(dato.hasta);       
                  console.log("FechaHora Hasta : ", fechaHoraHasta);            

                  if( fechaHoraDesde <= fechaHoraBuscar && fechaHoraHasta >= fechaHoraBuscar ) {
                    console.log("Encontrado Fecha hora : ", datoEspecifico.valor );
                  } else {
                    console.log("Profesional descartado fechaHora");
                    cumpleEspecifico = false;
                  } 
                }
              });
            } else if( datoEspecifico.formdina_tipo == "boolean" ) {
              this.datosEspecificos.filter( dato => { 
                if( dato.nombre == datoEspecifico.nombre && dato.seleccion ) {                   
                  if( dato.seleccion == datoEspecifico.valor ) {
                    console.log("Encontrado booleano :", dato.seleccion)    
                  } else {
                    console.log("Profesional descartado booleano");
                    cumpleEspecifico = false;
                  } 
                } 
              });
            } else if( datoEspecifico.formdina_tipo == "selectsimple" ) {
              this.datosEspecificos.filter( dato => { 
                if( dato.nombre == datoEspecifico.nombre && dato.seleccionSimple ) { 
                  if( dato.seleccionSimple  == datoEspecifico.valor) {
                    console.log("Estructura : ", dato);
                    console.log("Datos especificos : ", datoEspecifico);
                  } else {
                    console.log("Profesional descartado select simple");
                    cumpleEspecifico = false;
                  }                
                }
              });
            } else if( datoEspecifico.formdina_tipo == "selectmultiple" ) {
              
              var encontrados: number = 0; //Valores encontrados en el array de multiseleccion
              var seleccionados: number = 0; //Debe ser mayor a 1 para comprobar que viene al menos una opcion seleccionada

              this.datosEspecificos.filter( dato => {                 
                if( dato.nombre == datoEspecifico.nombre ) {                   
                  dato.opcionesMultiple.forEach( opcion => {                                                     
                    if( opcion.seleccion ) {
                      seleccionados++;
                      var encontrado = datoEspecifico.valor.includes( opcion.elemento );                          
                    
                      if( opcion.seleccion && encontrado ) {
                        console.log("Encontrado Multiple : ", opcion.elemento)                      
                        encontrados++;
                      }
                    }                    
                  });                  
                }
              });

              if( seleccionados > 0 && encontrados == 0 ) {
                console.log("Profesional descartado select multiple");
                cumpleEspecifico = false;
              } 
            }
          });
        }
        
        if( cumpleDistancia && cumpleGenero && cumpleMetodoPago && cumpleEspecifico ) {
          this.profesionales.push(element);
        }       
      });   
    });     
  }

  sort(property) {
    
    this.isDesc = !this.isDesc;
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;    

  }

  detalle(id) { 
    
    this.globalService.pageTransition();    
    this.navCtrl.navigateForward(`profesional-detail/${id}`);

  }

  irAFiltro() {

    this.globalService.pageTransition();
    this.navCtrl.navigateForward('profesional-filter');

  }

  buscarProfesionales() {
    this.ls.getStoreData("idSistema").then( ( idSistema: number ) => {
      this.globalService.pageTransition();
      this.navCtrl.navigateForward(`departamento/${idSistema}`);
    });    
  }
}
