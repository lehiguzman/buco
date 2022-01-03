import { Injectable } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {
  /* launchnavigator.APP.GOOGLE_MAPS (Android & iOS)
    * launchnavigator.APP.WAZE (Android & iOS) */
  GMap: boolean = false;
  Waze: boolean = false;
  Uber: boolean = false;

  constructor(private launchNavigator: LaunchNavigator, private platform: Platform,) {
    if (platform.is('cordova') && (this.platform.is('android') || this.platform.is('ios'))) {
      this.GMap = this.isAppDisponible(launchNavigator.APP.GOOGLE_MAPS);
      this.Waze = this.isAppDisponible(launchNavigator.APP.WAZE);
      this.Uber = this.isAppDisponible(launchNavigator.APP.UBER);
    }
  }

  navigate(miUbicacion, destino) {
    return new Promise((resolve, reject) => {
      let launchApp = this.launchNavigator.APP.USER_SELECT;

      if (this.Waze) {
        launchApp = this.launchNavigator.APP.WAZE;
      }

      if (!this.GMap && this.Waze) {
        launchApp = this.launchNavigator.APP.WAZE;
      }

      if (this.GMap && !this.Waze) {
        launchApp = this.launchNavigator.APP.GOOGLE_MAPS;
      }

      let options: LaunchNavigatorOptions = {
        app: launchApp,
        start: miUbicacion
      };

      this.launchNavigator.navigate(destino, options)
        .then(
          success => resolve('Launched navigator'),
          error => reject(error)
        );
    });
  }

  appDisponibles() {
    this.launchNavigator.availableApps().then((data) => {
      console.log(data);
      console.log(typeof data);
    });
  }

  private isAppDisponible(app) {
    if (this.platform.is('cordova')) {
      this.launchNavigator.isAppAvailable(app).then(() => {
        return true;
      });
    }
    return false;
  }

}
