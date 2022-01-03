import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { PosicionGps } from 'src/app/models/posicionGps';
import { NavController, LoadingController, AlertController, MenuController } from '@ionic/angular';
import { NavigationExtras, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Alerta } from 'src/app/models/alerta';

import { LocalStorageService, GlobalService, ApplicationInsightsService } from '../../../providers/';

declare var google;

@Component({
  selector: 'app-direccion-mapa',
  templateUrl: './direccion-mapa.page.html',
  styleUrls: ['./direccion-mapa.page.scss'],
})
export class DireccionMapaPage implements OnInit {

  //Autocomplete
  GoogleAutocomplete: google.maps.places.AutocompleteService;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;

  public locationOptions: GeolocationOptions = { timeout: 25000 };
  public geocoder: any;
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  public map: any;
  public placeDetails: PosicionGps;
  public posicion: string = '';
  public posicionInicial: PosicionGps;
  public regresar: boolean = false;
  public rr: string = '';
  public modalText: Alerta;
  public modalEditar: Alerta;
  // tslint:disable-next-line:member-ordering
  static intancia: any;
  static geo: any;
  static loader: any;
  static mapG: any;
  latitude: number = 0;
  longitude: number = 0;

  placesService: any;
  places: any = [];
  saveDisabled: boolean;
  input: string = '';
  closeSelect: boolean = true;
  dir: any;
  latitud: any;
  longitud: any;
  item: any;  
  direccion: any;
  direccionEdit: any;
  direccionObj: any = [];
  marker: any;
  titulo: string = "Registrar dirección";
  clienteId: any;
  panama: boolean = false;

  isLoading = false;

  constructor(private geolocation: Geolocation,
              public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private menuCtrl: MenuController,
              private appInsights: ApplicationInsightsService,
              public zone: NgZone,
              public activatedRoute: ActivatedRoute,
              public ls: LocalStorageService,
              public globalService: GlobalService,
              public alertCtrl: AlertController) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.placeDetails = new PosicionGps(0, 0, '');
  }

  ngOnInit() {
    this.menuCtrl.swipeGesture( false );
    this.ls.getStoreData("direccion").then((direccion: any) => {      
      console.log( "Direccion : ", direccion );
      if (direccion) {

        this.titulo = "Editar dirección";        
        this.loadMap(direccion.latitud, direccion.longitud, () => {

          this.latitud = direccion.latitud;
          this.longitud = direccion.longitud;

          this.obtenerDireccion(DireccionMapaPage.mapG.getCenter(), (respuesta) => {
            this.autocomplete.input = respuesta;
            this.direccion = respuesta;            
          });
        });
      } else {        
        this.getPosition();        
      }
    });    
    this.ls.getStoreData("usuario").then((usuario: any) => {
      this.clienteId = usuario.data.id;
    });
    
    this.placeDetails = new PosicionGps(0, 0, '');
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('direcciones_map');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('direcciones_map');        
    this.menuCtrl.swipeGesture( true );
  }

  ngAfterViewInit(): void {
    this.geocoder = new google.maps.Geocoder;
    DireccionMapaPage.intancia = this;
  }

  getPosition(): any {
    //Ubicacion Actual
    this.obtenerPosicionActual((response, error) => { 
      this.loadMap(response.lat, response.lng, () => { 

        this.latitud = response.lat;
        this.longitud = response.lng;

        this.obtenerDireccion(DireccionMapaPage.mapG.getCenter(), (respuesta) => {
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

    this.marker = new google.maps.Marker({
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
    
    DireccionMapaPage.mapG = this.map;
    DireccionMapaPage.geo = new google.maps.Geocoder();

    this.marker.setMap(this.map);

    google.maps.event.addListener(this.marker, "dragend", event => {
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
      var latLng = event.latLng;
      this.latitud = latLng.lat(res => {
        return res;
      });
      this.longitud = latLng.lng(res => {
        return res;
      });  
      
      console.log("Longitud : ", this.longitud);
      console.log("Latitud : ", this.latitud);  
      this.obtenerDireccion(latLng, respuesta => {            
        this.direccion = respuesta;        
        this.autocomplete.input = respuesta;        
      });
      if ( this.marker ) {
        this.marker.setPosition(latLng);        
      } else {
        this.marker = new google.maps.Marker({
          map: this.map,
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: latLng,
          title: "Hello Worl"
        });
        this.marker.setMap(this.map);
      }
    });

    google.maps.event.addListenerOnce(this.map, "idle", () => {      
      this.obtenerDireccion(myLatLng, respuesta => {        
        return callback();
      });
      mapEle.classList.add("show-map");      
    });
    google.maps.event.addListener(this.map, "click", event => {
      //console.log("evento clic del mapa");
    });   
  }

  /*  se obtiene la direccion escrita segun un punto gps */
  obtenerDireccion(latLng, callback) {
    //console.log(latLng);
    this.geocoder.geocode({ 
      location: latLng 
    }, (results, status) => {      
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {

        let data = results;
        
          this.globalService.getCountry( data ).then( ( pais: any ) => {            
            if (pais == "Panamá" || pais == "Panama") {
              this.panama = true;              
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

  updateSearchResults() {
    this.closeSelect = false;
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

  selectPlace(place) {

    this.places = [];    

    let location = {
      lat: null,
      lng: null,
      name: place.name,
      description: place.description
    };

    this.autocomplete.input = location.description;    

    this.obtenerDireccion(DireccionMapaPage.mapG.getCenter(), (respuesta) => {
      this.placeDetails = new PosicionGps(DireccionMapaPage.mapG.getCenter().lat(),
        DireccionMapaPage.mapG.getCenter().lng(),
        respuesta);
    });

    this.placesService.getDetails({ placeId: place.place_id }, (details) => {

      this.zone.run(() => {

        location.name = details.name;
        location.lat = details.geometry.location.lat();
        this.latitud = location.lat;
        

        location.lng = details.geometry.location.lng();
        this.longitud = location.lng;        

        this.map.setCenter({ lat: location.lat, lng: location.lng });

        this.obtenerDireccion(this.map.getCenter(), (respuesta) => {
          
          this.direccion = location.description;

          this.placeDetails = new PosicionGps(
            DireccionMapaPage.mapG.getCenter().lat(),
            DireccionMapaPage.mapG.getCenter().lng(),
            respuesta
          );
        });

        this.marker = new google.maps.Marker({
          map: this.map,
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: location,
          title: "Hello World!",
        });

        this.marker.setMap(this.map);

        this.location = location;

        this.closeSelect = true;
      });
    });
  }

  direccionMap() {
    this.obtenerDireccion(DireccionMapaPage.mapG.getCenter(), (respuesta) => {      
      this.autocomplete.input = respuesta;      
      this.placeDetails = new PosicionGps(DireccionMapaPage.mapG.getCenter().lat(),
        DireccionMapaPage.mapG.getCenter().lng(),
        respuesta);
    });
  }

  registrar() {

    this.obtenerDireccion(DireccionMapaPage.mapG.getCenter(), (respuesta) => {

      this.placeDetails = new PosicionGps(DireccionMapaPage.mapG.getCenter().lat(),
        DireccionMapaPage.mapG.getCenter().lng(),
        respuesta);
    });

    if ( !this.autocomplete.input ) {

      let msg = "<h5>Debe seleccionar una dirección</h5>";
      this.presentAlert(msg, "none");

    } else {

      if (!this.panama) {
        this.globalService.loadingCustom("Dirección no permitida, por favor asegúrese de ingresar una dirección dentro de Panamá.");
        return false;
      }
      
      console.log("Latitud de direccion : ", this.latitud);
      console.log("Longitud de direccion : ", this.longitud);
      console.log("Direccion : ", this.direccion);

      var direccionMap = {
        latitud: this.latitud,
        longitud: this.longitud,
        direccion: this.direccion
      }

      this.ls.setStoreData("direccionMap", direccionMap);
      this.globalService.pageTransition();                  
      this.navCtrl.navigateForward('direccion-add');
    }
  }

  async presentAlert(msg: any, ruta: any) {
    const alert = await this.alertCtrl.create({
      //header: '',  
      mode: 'ios',
      message: msg,
      buttons: [{
        text: 'OK',
        cssClass: 'buttonOk',
        handler: () => {
          alert.dismiss().then(() => {
            if (ruta != "none") {
              this.globalService.pageTransition();
              this.navCtrl.navigateForward([ruta]);
            }
          })
        }
      }]
    });

    await alert.present();
  }

  irAtras() {
    this.ls.deleteStoreData("direccion");
    this.globalService.pageTransition();    
  }
}
