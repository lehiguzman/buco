import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { PosicionGps } from 'src/app/models/posicionGps';
import { NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { NavigationExtras, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Alerta } from 'src/app/models/alerta';

import { GlobalService } from '../../providers/global.service';
import { LocalStorageService } from '../../providers/local-storage/local-storage.service';

declare var google;
//declare const google: any;

@Component({
  selector: 'app-agregar-direccion',
  templateUrl: './agregar-direccion.page.html',
  styleUrls: ['./agregar-direccion.page.scss'],
})

export class AgregarDireccionPage implements OnInit {

  //Autocomplete
  GoogleAutocomplete: google.maps.places.AutocompleteService;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;

  private destroy$: Subject<boolean> = new Subject<boolean>();
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
  editar: boolean = false;
  direccion: any;
  direccionEdit: any;
  titulo: string = "Registrar dirección";
  clienteId: any;

  isLoading = false;
  constructor(private geolocation: Geolocation,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public zone: NgZone,
    public activatedRoute: ActivatedRoute,
    public ls: LocalStorageService,
    public global: GlobalService,
    public alertCtrl: AlertController
    //public navParams: NavParams
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.placeDetails = new PosicionGps(0, 0, '');
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.item = params["item"];
    });

    if (!this.item) {
      this.getPosition();
    }
    else {
      //Recuperar direccion
      this.titulo = "Editar dirección";
      this.editar = true;
      this.ls.getStoreData("token").then((token: any) => {
        // this.global.getDireccion(this.item, token).subscribe((direccion: any) => {
        //   //Actualizar posicion del mapa                
        //   this.loadMap(direccion.data.latitud, direccion.data.longitud, () => {
        //     this.direccion = direccion.data;
        //     this.autocomplete.input = direccion.data.direccion;
        //   });
        // });
      });
    }

    this.ls.getStoreData("token").then((token: any) => {
      this.ls.getStoreData("usuario").then((usuario: any) => {
        this.clienteId = usuario.data.id;
      });
    });
    this.placeDetails = new PosicionGps(0, 0, '');
  }

  ionViewWillEnter() {
    //console.clear();
    //Guarda los datos para no perder la edicion previa en modulo de Registro de dirección
    this.activatedRoute.queryParams.subscribe(params => {
      this.direccionEdit = params;
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

  // Funcion Asycrona LoadingController Ionic 4
  async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }//fin dismis

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
              this.global.pageTransition();
              this.navCtrl.navigateForward([ruta]);
            }
          })
        }
      }]
    });

    await alert.present();
  }

  direccionMap() {
    this.obtenerDireccion(AgregarDireccionPage.mapG.getCenter(), (respuesta) => {
      //console.log("Lugar : ", respuesta);
      this.latitud = AgregarDireccionPage.mapG.getCenter().lat();
      console.log("Latitud : ", this.latitud);
      this.longitud = AgregarDireccionPage.mapG.getCenter().lng();
      console.log("Longitud : ", this.longitud);
      this.dir = respuesta;
      this.autocomplete.input = respuesta;
      this.placeDetails = new PosicionGps(AgregarDireccionPage.mapG.getCenter().lat(),
        AgregarDireccionPage.mapG.getCenter().lng(),
        respuesta);
    });
  }

  updateSearchResults() {
    this.closeSelect = false;
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }

    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }

  geoCode(address: string) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
      this.latitude = results[0].geometry.location.lat();
      this.longitude = results[0].geometry.location.lng();
      alert("lat: " + this.latitude + ", long: " + this.longitude);
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

    this.obtenerDireccion(AgregarDireccionPage.mapG.getCenter(), (respuesta) => {

      this.dir = location.description;

      this.placeDetails = new PosicionGps(AgregarDireccionPage.mapG.getCenter().lat(),
        AgregarDireccionPage.mapG.getCenter().lng(),
        respuesta);
    });

    this.placesService.getDetails({ placeId: place.place_id }, (details) => {

      this.zone.run(() => {

        location.name = details.name;
        location.lat = details.geometry.location.lat();
        this.latitud = location.lat;

        //console.log("Latitud : ", this.latitud);                

        location.lng = details.geometry.location.lng();
        this.longitud = location.lng;
        //console.log("Longitud : ", this.longitud);    

        this.map.setCenter({ lat: location.lat, lng: location.lng });

        this.location = location;

        this.closeSelect = true;

      });

    });

  }

  ngAfterViewInit(): void {
    this.geocoder = new google.maps.Geocoder;
    console.log("Geocoder : ", this.geocoder);
    this.present();

    AgregarDireccionPage.intancia = this;
  }

  addDireccion() {

    this.obtenerDireccion(AgregarDireccionPage.mapG.getCenter(), (respuesta) => {

      this.placeDetails = new PosicionGps(AgregarDireccionPage.mapG.getCenter().lat(),
        AgregarDireccionPage.mapG.getCenter().lng(),
        respuesta);
    });

    if (!this.dir && !this.autocomplete.input) {

      let msg = "<h5>Debe seleccionar una dirección</h5>";
      this.presentAlert(msg, "none");

    } else {

      let datosDireccion: NavigationExtras = {
        queryParams: {
          latitud: this.latitud,
          longitud: this.longitud,
          nombre: this.dir,
          clienteId: this.clienteId,
          direccionEdit: this.direccionEdit
        }
      }
      this.global.pageTransition();
      this.navCtrl.navigateForward('direccion-add', datosDireccion);

    }
  }

  editDireccion() {
    if (!this.dir) { this.dir = this.autocomplete.input }
    let datosDireccion: NavigationExtras = {
      queryParams: {
        nombre: this.dir,
        direccion: this.direccion
      }
    }
    this.global.pageTransition();
    this.navCtrl.navigateForward('direccion-add', datosDireccion);
  }

  /*  se obtiene la direccion escrita segun un punto gps */
  obtenerDireccion(latLng, callback) {
    //console.log(latLng);
    this.geocoder.geocode({
      'location': latLng
    }, (results, status) => {
      // tslint:disable-next-line:new-parens
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          console.log("Direccion formateadda: ", results[0].formatted_address);
          return callback(results[0].formatted_address);
        } else {
          return callback("Dirección no encontrada");
        }
      } else {
        return callback("Dirección no encontrada");
      }
    });
  }

  buscarDireccion() {
    this.modalText.visible = true;
  }

  editarDireccion() {
    this.modalEditar.visible = true;
  }

  puntoActual() {
    this.placeDetails.address = this.posicionInicial.address;
    //console.log(this.placeDetails.address);
    this.placeDetails.lat = this.posicionInicial.lat;
    this.placeDetails.lng = this.posicionInicial.lng;
    AgregarDireccionPage.mapG.setCenter({
      lat: this.placeDetails.lat,
      lng: this.placeDetails.lng
    });
  }

  getPosition(): any {

    this.loadMap(8.99797, -79.508096, () => {

      /* this.obtenerPosicionActual((response, error) => {
         AgregarDireccionPage.mapG.setCenter({
           lat: response.lat,
           lng: response.lng
         });
         this.obtenerDireccion(AgregarDireccionPage.mapG.getCenter(), (respuesta) => {
           this.placeDetails = new PosicionGps(response.lat, response.lng, respuesta);
           this.posicionInicial = new PosicionGps(response.lat, response.lng, respuesta);
           //AgregarDireccionPage.loader.dismiss();
           this.dismiss();
         });
       }); */
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

  loadMap(latitude: any, longitude: any, callback) {
    let mapEle: HTMLElement = document.getElementById('map');
    let myLatLng = {
      lat: latitude,
      lng: longitude
    };
    //console.log("latitud : ", latitude);
    //console.log("longitud : ", longitude);
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: false,
      fullscreenControl: false,
      zoom: 16
    });
    //Prueba    
    this.placesService = new google.maps.places.PlacesService(this.map);
    ///////
    /*  CrerDireccionPage.geo = new google.maps.Geocoder();
     mapEle.classList.add('show-map');
     google.maps.event.addListener(this.map, 'click', (event) => {}); */
    AgregarDireccionPage.mapG = this.map;
    AgregarDireccionPage.geo = new google.maps.Geocoder();

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      //CrerDireccionPage.intancia.placeDetails._address = '';
      this.obtenerDireccion(myLatLng, (respuesta) => {
        //CrerDireccionPage.intancia.placeDetails._address = respuesta;
        //CrerDireccionPage.intancia.placeDetails._lat = myLatLng.lat;
        //CrerDireccionPage.intancia.placeDetails._lng = myLatLng.lng;
        return callback();
      });
      mapEle.classList.add('show-map');
    });
    google.maps.event.addListener(this.map, 'click', (event) => { });
  }

  loadMap2() {

    var map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: 8.99797, lng: -79.508096 },
      //center: { lat: 8.99797 , lng: -79.508096},
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: false,
      fullscreenControl: false,
      zoom: 16
    });
    return map;
    console.log(this.map);
  }
}// Fin de la class
