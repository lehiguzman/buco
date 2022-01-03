import { Injectable } from '@angular/core';
import { LoadingController, ToastController, Platform } from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Network } from '@ionic-native/network';
import { Vibration } from '@ionic-native/vibration';
import { Config } from '../../environments/environment';
import CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  // Variables de Configuración de Ambientes, URL API, Panel, Uploads
  public urlDominioAPI: string = Config.urlDominioAPI.urlBase;
  public ApiUrl: string = this.urlDominioAPI + Config.urlDominioAPI.apiVersion;
  public urlDominioPanel: string = Config.urlDominioPanel.urlBase;
  public UploadsUrl: string = this.urlDominioPanel + Config.urlDominioPanel.uploads;
  public debug = Config.debugMode;
  public env = Config.env; // environment
  public loginGenerico = Config.loginGenerico;

  // Variables Control de la App
  public mostrarVersion: boolean = false;
  public nativeDevice: boolean = false;
  public subversionApp = '00';
  public versionApp = '1.2.8';
  public isAndroid: boolean = false;
  public isiOS: boolean = false;
  public online: boolean = window.navigator.onLine;
  public onlineShow: boolean = false;

  // Variables Control de Usuario
  public UsuarioAdmin: boolean = false;
  public UsuarioTipo: string = 'cliente';
  public UsuarioLogueado: boolean = false;

  isLoading = false;

  //Nombre corto de meses en español, se ubican en los input tipo datetime
  meses = "Ene, Feb, Mar, Abr, May, Jun, Jul, Ago, Sep, Oct, Nov, Dic";

  constructor(
    private loadingCtrl: LoadingController,
    private nativePageTransitions: NativePageTransitions,
    private network: Network,
    private pltf: Platform,
    private toastCtrl: ToastController,
    private vibration: Vibration,
  ) {
    this.nativeDevice = !this.pltf.is('desktop') && (this.pltf.is('android') || this.pltf.is('ios'));
    if (this.nativeDevice && this.debug) this.mensaje({ message: 'es un dispositivo nativo' })
    this.isAndroid = this.pltf.is('android');
    this.isiOS = this.pltf.is('ios');
  }

  public getVersionAmbiente() {
    let env = this.env;
    let subversionApp = '';
    if (parseInt(this.subversionApp) > 0) subversionApp = `.${this.subversionApp}`;
    if (this.env === 'preprod') env = 'PreProd';
    if (this.env !== 'prod')
      return `${env} ${subversionApp}`;
    return '';
  }

  /**
   * @method  mensaje   Método notificación Toast
   * https://ionicframework.com/docs/v4/api/toast
   *
   * @param  {Object} options {
   *      color: 'primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium'
   *      cssClass: nombre de la clase CSS
   *      duration: tiempo que se muestra en milisegundos por defecto tiene 4 segundos.
   *      message: mensaje de la notificacion
   *      position: top, middle, bottom (posición donde se muestra, sea SUPERIOR, CENTRADO VERTICAL, INFERIOR)
   * }
   */
  async mensaje(options: any) {
    let message: string = "", duration: number = 4000, position: any = "middle", cssClass: string = "", color: string = "", header: string = "";

    if ('header' in options) header = options.header;
    if ('message' in options) message = options.message;
    if ('duration' in options) duration = options.duration;
    if ('position' in options) position = options.position;
    if ('cssClass' in options) cssClass = options.cssClass;
    if ('color' in options) color = options.color;

    if (message) {
      const toast = await this.toastCtrl.create({
        header: header,
        message: message,
        duration: duration,
        position: position,
        cssClass: cssClass,
        color: color,
      });

      return await toast.present();
    } else {
      return null;
    }
  }

  /**
   * Cargador Imagen loading Pantalla Completa
   */
  async presentLoadingPrincipal() {
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      spinner: null,
      duration: 5555,
      message: '<div class="img_cargador"></div>',
      cssClass: 'cargadorPrincipal'
    });

    return await loading.present();
  }

  /**
   * @method  loadingCustom
   *
   * @param  {String} msg: "Mensaje a mostrar"
   */
  async loadingCustom(msg: string = null, duration: number = 2222) {
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      spinner: msg ? null : 'bubbles',
      duration: duration,
      message: msg,
      cssClass: msg ? 'buco-loading cargador-texto' : 'buco-loading cargador'
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });

    return await loading;
  }

  /**
   * @method  dismissLoader   Cerrar Loader
   * https://dcarvajal7.es/solucion-error-uncaught-in-promise-overlay-does-not-exist/
   */
  async dismissLoader() {
    if (this.isLoading) {
      return await this.loadingCtrl.getTop().then(load => {
        if (load) {
          this.isLoading = false;
          this.loadingCtrl.dismiss();
        }
      });
    }

    return null;
  } //fin dismis

  /**
   * Método evento del estado de Conexión a Internet
   * https://ionicframework.com/docs/native/network
   * https://ionicframework.com/docs/native/vibration
   */
  public controlConexion() {
    if (this.nativeDevice || this.isAndroid || this.isiOS) {
      // watch network for a disconnection
      const disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        this.online = false;
        this.vibration.vibrate(1000);
        this.onlineShow = true;
        setTimeout(() => { this.onlineShow = false; }, 4444);
      });
      // stop disconnect watch
      // disconnectSubscription.unsubscribe();

      // watch network for a connection
      const connectSubscription = this.network.onConnect().subscribe(() => {
        this.online = true;
        this.vibration.vibrate(1000);
        this.onlineShow = true;
        setTimeout(() => { this.onlineShow = false; }, 4444);
        // stop connect watch
        // connectSubscription.unsubscribe();
      });
    } else {
      window.addEventListener('offline', async (e) => {
        this.online = false;
        window.navigator.vibrate(200);
        this.onlineShow = true;
        setTimeout(() => { this.onlineShow = false; }, 4444);
      });
      window.addEventListener('online', async (e) => {
        this.online = true;
        window.navigator.vibrate(200);
        this.onlineShow = true;
        setTimeout(() => { this.onlineShow = false; }, 4444);
      });
    }
  }

  /**
   * @param time tiempo para vibrar
   */
  public vibrate(time: any) {
    if (this.nativeDevice || this.isAndroid || this.isiOS) {
      this.vibration.vibrate(time);
    } else {
      window.navigator.vibrate(time);
    }
  }

  /**
   * encriptador
   */
  public encriptar(data: string) {
    return CryptoJS.AES.encrypt(data, Config.secretKey).toString();
  }

  /**
   * desencriptador
   */
  public desencriptar(data: string) {
    return CryptoJS.AES.decrypt(data, Config.secretKey).toString(CryptoJS.enc.Utf8);
  }

  /**
   * Efecto de Transiciones entre páginas
   */
  pageTransition() {
    if (this.isAndroid) {
      let options: NativeTransitionOptions = {
        duration: 600,
        direction: 'up',
        androiddelay: 0,
        iosdelay: 0
      };

      this.nativePageTransitions.fade(options);
    }
  }

  getCountry(data: any) {
    return new Promise((resolve) => {
      let country = null, countryCode = null, city = null, cityAlt = null;
      let c, lc, component;

      for (let r = 0, rl = data.length; r < rl; r += 1) {
        let result = data[r];

        if (!city && result.types[0] === 'locality') {
          for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
            component = result.address_components[c];

            if (component.types[0] === 'locality') {
              city = component.long_name;
              break;
            }
          }
        }
        else if (!city && !cityAlt && result.types[0] === 'administrative_area_level_1') {
          for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
            component = result.address_components[c];

            if (component.types[0] === 'administrative_area_level_1') {
              cityAlt = component.long_name;
              break;
            }
          }
        } else if (!country && result.types[0] === 'country') {
          country = result.address_components[0].long_name;
          countryCode = result.address_components[0].short_name;
        }

        if (city && country) {
          break;
        }
      }
      resolve(country);
    });
  }
}
