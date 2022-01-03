import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation';
import { PosicionGps } from 'src/app/models/posicionGps';

import { LoadingController, NavController, AlertController, MenuController } from '@ionic/angular';
import { NavigationExtras, ActivatedRoute } from '@angular/router';

import { GlobalService, ApplicationInsightsService, LocalStorageService } from '../../../providers/';

declare var google;

@Component({
  selector: 'app-servicio-map',
  templateUrl: './servicio-map.page.html',
  styleUrls: ['./servicio-map.page.scss'],
})

export class ServicioMapPage implements OnInit {

  GoogleAutocomplete: google.maps.places.AutocompleteService;

  public geocoder: any;
  static mapG: any;
  @ViewChild('map', {static: false}) mapElement: ElementRef;
  public map: any;
  static geo: any;
  location: any;
  latitud: any;
  longitud: any;
  direccion: any;
  autocomplete: { input: string; };  
  autocompleteItems: any[] = [];
  placeDetails: any;
  placesService: any;
  places: any = [];
  closeSelect: boolean = true;
  panama: boolean = false;

  static instancia: any;

  isLoading = false;

  profesionalesODS: any[] = [];
  cantidadProfesionales: number = 1;
  porcentajeBackup: number = null;
  tareas: any;
  
  constructor( private geolocation: Geolocation,
               public activatedRoute: ActivatedRoute,
               private loadingCtrl: LoadingController,
               private menuCtrl: MenuController,
               private appInsights: ApplicationInsightsService,
               public zone: NgZone,
               private ls: LocalStorageService,
               private navCtrl: NavController, 
               private alertCtrl: AlertController,
               private globalService: GlobalService ) { 

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();       
    this.autocomplete = { input: '' };

  }

  ngOnInit() {
    
    this.menuCtrl.swipeGesture( false );
    this.ls.getStoreData('ods').then( ( ods: any ) => {
      this.profesionalesODS = ods.profesionalesODS;
      this.cantidadProfesionales = ods.cantidadProfesionales;
      this.porcentajeBackup = ods.porcentajeBackup;
      this.tareas = ods.tareas;
    });

    this.getPosition();    
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('servicio_map');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('servicio_map');
    this.menuCtrl.swipeGesture( true );
  }
  
  getPosition(): any {
    this.obtenerPosicionActual((response, error) => { 
      this.loadMap(response.lat, response.lng, () => { 
        this.obtenerDireccion(ServicioMapPage.mapG.getCenter(), (respuesta) => {
          this.autocomplete.input = respuesta;
          this.direccion = respuesta;
        });
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

    this.geolocation.getCurrentPosition(options).then(response => {
        return callback({ lat: response.coords.latitude, lng: response.coords.longitude }, null);
    }).catch(error => {        
      return callback({ lat: 8.99797, lng: -79.508096}, null);
    });
  }

  loadMap(latitude: any, longitude: any, callback) {

    let mapEle: HTMLElement = document.getElementById('map');
    let myLatLng = {
      lat: latitude,
      lng: longitude
    };
    //console.log("latitud : ", latitude);
    //console.log("longitud : ", longitude);

    var marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: myLatLng,
      title: "Hello World!"
    });

    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: false,
      fullscreenControl: false,
      zoom: 16
    });
   
    this.placesService = new google.maps.places.PlacesService(this.map);
   
    ServicioMapPage.mapG = this.map;
    ServicioMapPage.geo = new google.maps.Geocoder();

    marker.setMap(this.map);

    google.maps.event.addListener(marker, "dragend", event => {
      var latLng = event.latLng;
      this.latitud = latLng.lat(res => {
        return res;
      });
      this.longitud = latLng.lng(res => {
        return res;
      });      
      this.obtenerDireccion(latLng, respuesta => {        
        this.autocomplete.input = respuesta;
        this.direccion = respuesta;
      });
    });

    google.maps.event.addListener(this.map, "click", event => {
      console.log(event);
      var latLng = event.latLng;
      this.latitud = latLng.lat(res => {
        return res;
      });
      this.longitud = latLng.lng(res => {
        return res;
      });     
      this.obtenerDireccion(latLng, respuesta => {            
        this.direccion = respuesta;        
        this.autocomplete.input = respuesta;        
      });
      if (marker) {
        marker.setPosition(latLng);        
      } else {
        marker = new google.maps.Marker({
          map: this.map,
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: latLng,
          title: "Hello Worl"
        });
        marker.setMap(this.map);
      }
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
   
      this.obtenerDireccion(myLatLng, (respuesta) => {

        return callback();

      });
      mapEle.classList.add('show-map');
    });
    google.maps.event.addListener(this.map, 'click', (event) => {});
  }

  direccionMap() {

    this.obtenerDireccion(ServicioMapPage.mapG.getCenter(), (respuesta) => {        
        
          this.latitud = ServicioMapPage.mapG.getCenter().lat();
        console.log("Latitud : ", this.latitud);  
          this.longitud = ServicioMapPage.mapG.getCenter().lng();
        console.log("Longitud : ", this.longitud);  
          this.direccion = respuesta;
        console.log("Direccion : ", this.direccion);  
          this.autocomplete.input = respuesta;
          this.placeDetails = new PosicionGps(ServicioMapPage.mapG.getCenter().lat(),
                                              ServicioMapPage.mapG.getCenter().lng(),
                                              respuesta);                 
      });

  }

  
    // Funcion Asycrona LoadingController Ionic 4
    async present() {
      this.isLoading = true;
      return await this.loadingCtrl.create({
        duration: 5000,
      }).then(a => {
        a.present().then(() => {
          console.log('Loadding presented');
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('termino presenting'));
          }
        });
      });
    }// Fin present()

    async presentAlert( msg: any, ruta: any ) {
      const alert = await this.alertCtrl.create({
        //header: '',  
        mode: 'ios',    
        message: msg,
        buttons: [{
          text: 'OK',
          cssClass: 'buttonOk', 
          handler: () => {
            alert.dismiss().then( () => {
              if(ruta != "none")
              {
               this.globalService.pageTransition();
               this.navCtrl.navigateForward([ruta]);
              }
            })
          }
        }]
      });

      await alert.present();
    }

  ngAfterViewInit(): void {
    this.geocoder = new google.maps.Geocoder;    
    this.present();

    ServicioMapPage.instancia = this;
  }

  /*  se obtiene la direccion escrita segun un punto gps */
  obtenerDireccion(latLng, callback) {
    //console.log(latLng);
      this.geocoder.geocode({
        'location': latLng
      }, (results, status) => {
        // tslint:disable-next-line:new-parens
        if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {

        let data = results;
        
          this.globalService.getCountry( data ).then( ( pais: any ) => {
            console.log("Pais : ", pais);
            if (pais == "Panamá" || pais == "Panama") {
              this.panama = true;
              //this.ls.setStoreData("direccionNombre", results[0].formatted_address);
              return callback(results[0].formatted_address);
            } else {
              this.panama = false;
              return callback("Dirección no permitida, por favor asegúrese de ingresar una dirección dentro de Panamá.");
            }
          });
        } else {
          return callback("Dirección no encontrada");
        }
      } else {
        return callback("Dirección no encontrada");
      }
    });      
  }

  selectPlace(place){

    this.places = [];

    let location = {
        lat: null,
        lng: null,
        name: place.name,
        description: place.description
    };

    this.autocomplete.input = location.description; 

    this.obtenerDireccion(ServicioMapPage.mapG.getCenter(), (respuesta) => {                  

        this.direccion = location.description;
        
    this.placeDetails = new PosicionGps(ServicioMapPage.mapG.getCenter().lat(),
                                        ServicioMapPage.mapG.getCenter().lng(),
                                        respuesta);       
    });
      
    this.placesService.getDetails({placeId: place.place_id}, (details) => {
          
        this.zone.run(() => {

            location.name = details.name;
            console.log( "Location : ", location.name);

            location.lat = details.geometry.location.lat();
            this.latitud = location.lat;
              
            location.lng = details.geometry.location.lng(); 
            this.longitud = location.lng;               
              
            this.map.setCenter({lat: location.lat, lng: location.lng}); 

            this.location = location;

            this.closeSelect = true;

        });

    });

}

  updateSearchResults(){

    this.closeSelect=false;
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }

    this.GoogleAutocomplete.getPlacePredictions({ 
      input: this.autocomplete.input,
      componentRestrictions: { country: "pa" }
    },(predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }

  irAMetodoPago() {
      
    this.obtenerDireccion(ServicioMapPage.mapG.getCenter(), (respuesta) => {        
      
      this.placeDetails = new PosicionGps(ServicioMapPage.mapG.getCenter().lat(),
                                          ServicioMapPage.mapG.getCenter().lng(),
                                          respuesta);       
    });     

    if(!this.direccion && !this.autocomplete.input) {

      let msg = "<h5>Debe seleccionar una dirección</h5>";
      this.presentAlert(msg, "none");        
      
    } else {        

      if (!this.panama) {
        this.globalService.loadingCustom("Dirección no permitida, por favor asegúrese de ingresar una dirección dentro de Panamá.");
        return false;
      }      
      
      var ods = {
        profesionalesODS: this.profesionalesODS,
        cantidadProfesionales: this.cantidadProfesionales,
        porcentajeBackup: this.porcentajeBackup,
        latitud: this.latitud,
        longitud: this.longitud,
        direccion: this.direccion,
        tareas: this.tareas
      }

      console.log("Datos de direccion : ", this.direccion);

      this.ls.setStoreData("ods", ods);

      this.globalService.pageTransition();
      this.navCtrl.navigateForward('servicio-pago'); 

    }      
  }

}
