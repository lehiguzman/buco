import { Component } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation, GeolocationOptions } from "@ionic-native/geolocation";
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
// Services
import {
  GlobalService, LocalStorageService, RequestsService,
  AuthService, FirebaseAuthService
} from './providers/';
import * as moment from 'moment';
// Modals
import { PushNotificationsPage } from './modals/push-notifications/push-notifications.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class BucoApp {

  userId: any;
  perfilProfesional: boolean;

  constructor(
    private authService: AuthService,
    private fcm: FCM,
    private fireAuthServ: FirebaseAuthService,
    private geolocation: Geolocation,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private platform: Platform,
    private reqServ: RequestsService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public globalServ: GlobalService,
    public lsServ: LocalStorageService,
  ) {
    this.globalServ.presentLoadingPrincipal();

    console.info(`Versión App ${this.globalServ.versionApp} .${this.globalServ.subversionApp}`);
    this.initializeApp();

    // invocar método de control de conexión a internet
    this.globalServ.controlConexion();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.lsServ.getStoreData('introApp').then((result: any) => {
        // console.log("introApp",result)
        // if (!result) this.lsServ.setStoreData('introApp', true).then(() => this.navCtrl.navigateRoot('intro'));
      });

      this.lsServ.getStoreData("token").then(token => { if (!token) this.reqServ.loginGenerico(); }).catch(error => console.error("getStoreData", error));
      this.lsServ.getActiveUser().then((usuario: any) => {
        if (!usuario) {
          this.cerrarSesion();
        } else {
          this.lsServ.setStoreData("versionApp", this.globalServ.versionApp);

          // guardar historial de última conexión
          let ID = this.lsServ.getCodeID() || 0;
          this.fireAuthServ.databaseGet(`users/${ID}`).once('value', (snapshot) => {
            let info = (snapshot.val()) || null;
            this.fireAuthServ.databaseSet(`users/${ID}`, {
              appSubversion: this.globalServ.subversionApp,
              appVersion: this.globalServ.versionApp,
              usuario: usuario.email || '---',
              ultimaConexion: moment().format("YYYYMMDD-HHmmss")
            });
          });

          // actualizar y comprobar última versión de la App
          this.fireAuthServ.databaseGet(`public/versions`).once('value', (snapshot) => {
            let version = (snapshot.val()) || null;
            if (version && version.appVersion) {
              let v1 = this.globalServ.versionApp.split('.');
              let v2 = version.appVersion.split('.');
              const MAJOR = parseInt(v1[0]) === parseInt(v2[0]);
              const MINOR = parseInt(v1[1]) === parseInt(v2[1]);
              const PATCH = parseInt(v1[2]) === parseInt(v2[2]);
              if ((!MAJOR && parseInt(v1[0]) < parseInt(v2[0])) ||
                (MAJOR && !MINOR && parseInt(v1[1]) < parseInt(v2[1])) ||
                (MAJOR && MINOR && !PATCH && parseInt(v1[2]) < parseInt(v2[2]))) {
                this.globalServ.mensaje({
                  message: `¡Se detecto una nueva versión de la aplicación (v${version.appVersion}). Por favor actualice desde la tienda!`,
                  position: 'top',
                  color: 'light'
                });
              }
            }
            this.fireAuthServ.databaseSet(`public/versions`, {
              appSubversion: this.globalServ.subversionApp,
              appVersion: this.globalServ.versionApp
            });
          });

          this.lsServ.setStoreData("usuario", { data: usuario }); // guardar para evitar errores
          const prof = (usuario.roles[0] == 'ROLE_PROFESIONAL') ? true : false;
          if (prof) { this.activarGeolocalizacion(); }
          this.lsServ.getStoreData("perfilProfesional").then(perfil => {
            this.globalServ.UsuarioTipo = "cliente";
            if (perfil) this.globalServ.UsuarioTipo = "profesional";
            if (this.globalServ.debug || prof) this.globalServ.mensaje({ message: "Tu perfil configurado es: " + this.globalServ.UsuarioTipo.toUpperCase() })
          });
        }
      }).catch(error => console.error(error));

      // activar el canal de comunicación en Android
      if (!this.platform.is('mobileweb') && this.platform.is('android')) {
        this.crearCanalAndroid();
      }

      // >>> --- Servicio PushNotification ---
      if (!this.platform.is('mobileweb') && (this.platform.is('android') || this.platform.is('ios'))) {
        // configurar sonido para notificaciones
        // this.nativeAudio.preloadSimple('audioNotificacion', 'assets/audios/appcliente.mp3')
        //   .then(onSuccess => console.info('nativeAudio preloadSimple', onSuccess), onError => console.error('nativeAudio preloadSimple', onError));

        this.fcm.getToken()
          .then(pushToken => { if (pushToken) this.authService.updateTokens({ pushToken: pushToken, indice: "tokens" }) })
          .catch(error => console.error("fcm.getToken()", error));

        this.fcm.onTokenRefresh().subscribe(pushRefreshToken => {
          if (pushRefreshToken) this.authService.updateTokens({ pushRefreshToken: pushRefreshToken, indice: "tokens" });
        });

        this.fcm.onNotification().subscribe((data: any) => {
          // this.playAudioNotification();
          this.lsServ.setStoreData("pushNotifications", data).then(() => {
            this.presentModalPushNotifications();
            this.globalServ.vibrate([200, 100, 200]);
          });

          if (data.wasTapped) {
            // cuando se hace TAP (clic) en la notificación y el App
            // esta en segundo plano o no esta en ejecución
          } else {
            // ocurre cuando la aplicación se encuentra en primer plano
          }
        });
      }
      // <<< --- Servicio PushNotification ---

      // configura el tipo de plataforma
      if (this.platform.is('cordova') || this.platform.is('android') || this.platform.is('ios')) {
        this.splashScreen.hide();
        this.statusBar.styleDefault();
      }
    });
  }

  private cerrarSesion() {
    this.globalServ.loadingCustom();
    this.fireAuthServ.logout().finally(() => {
      if (this.globalServ.nativeDevice) {
        this.fcm.clearAllNotifications();
        this.fcm.deleteInstanceId();
      }
      this.lsServ.deleteAllStoreData();
      this.navCtrl.navigateRoot("/login", { replaceUrl: true });
    })
  }

  async crearCanalAndroid() {
    await this.fcm.createNotificationChannel({
      id: "canal_BUCO", // required
      name: "Notificación Buco", // required
      description: "Canal de Notificaciones de Buco",
      importance: "high", // https://developer.android.com/guide/topics/ui/notifiers/notifications#importance
      visibility: "public", // https://developer.android.com/training/notify-user/build-notification#lockscreenNotification
      sound: "buco", // In the "alert_sound" example, the file should located as resources/raw/alert_sound.mp3
      lights: true, // enable lights for notifications
      vibration: true
    });
  }

  // private playAudioNotification() {
  //   if (!this.platform.is('mobileweb') && this.platform.is('android')) {
  //     this.nativeAudio.play('audioNotificacion')
  //       .then(onSuccess => console.info('nativeAudio play', onSuccess), onError => console.error('nativeAudio play', onError));
  //   }
  // }

  async presentModalPushNotifications() {
    const modal = await this.modalCtrl.create({ component: PushNotificationsPage });
    return await modal.present();
  }

  private activarGeolocalizacion() {
    let locationOptions: GeolocationOptions = { timeout: 50000 };

    // obtener posición una sola vez
    this.geolocation.getCurrentPosition(locationOptions).then(
      (resp: any) => {
        if (resp && resp.coords && resp.coords.latitude && resp.coords.longitude) {
          let mensaje = `latitud: ${resp.coords.latitude.toFixed(4)} - longitud ${resp.coords.longitude.toFixed(4)}`;
          if (this.globalServ.debug) this.globalServ.mensaje({ message: mensaje, position: "bottom" });
        }
      },
      (err: any) => {
        if (err.code == 1) {
          this.globalServ.mensaje({ message: "La aplicación no tiene permisos para utilizar el GPS." });
        } else if (err.code == 2) {
          this.globalServ.mensaje({ message: "La ubicación por GPS no está disponible." });
        } else if (err.code == 3) {
          this.globalServ.mensaje({ message: "El tiempo límite para obtener la ubicación se ha agotado." });
        } else {
          this.globalServ.mensaje({ message: "¡No se obtuvo su ubicación. Por favor verifique las opciones del GPS!" });
        }
      }
    ).catch((error) => {
      console.error("Error getting location", error);
      this.globalServ.mensaje({ message: "¡No se obtuvo su ubicación. Por favor verifique las opciones del GPS!" });
    });
  }

}
