import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
// Services
import { GlobalService } from '../global.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { applicationInsightsConfig } from "../../../environments/environment";

/**
 * https://www.npmjs.com/package/@microsoft/applicationinsights-web
 */
@Injectable({
  providedIn: 'root'
})
export class ApplicationInsightsService {

  private nativeDevice: boolean = false;
  private version: string = this.globalServ.versionApp;
  private projectName: string = "BUCOAPP";
  private prefix: string = "BUCO";
  private datos: any = {
    proyecto: "BUCO",
    ambiente: this.globalServ.env,
    app: this.projectName,
    app_ambiente: `${this.projectName}_${this.globalServ.env}`,
    app_version: this.version,
    usuario_correo: "---",
    usuario_nombre: "---",
    error: ""
  };
  private appInsights = new ApplicationInsights({
    config: {
      instrumentationKey: applicationInsightsConfig.instrumentationKey
    }
  });

  constructor(
    private globalServ: GlobalService,
    private lsServ: LocalStorageService,
    private pltf: Platform
  ) {
    this.prefix = this.projectName + "_" + this.globalServ.env.toUpperCase();
    this.appInsights.loadAppInsights();

    this.nativeDevice = this.pltf.is('android') || this.pltf.is('ios');
    this.lsServ.getActiveUser().then((dataUser: any) => {
      if (dataUser && typeof dataUser === "object") {
        if (dataUser.user && dataUser.user.email && dataUser.id) {
          this.appInsights.setAuthenticatedUserContext(dataUser.user.email, dataUser.id);
        } else {
          this.appInsights.clearAuthenticatedUserContext();
        }
      }
    });
  }

  /**
   * Log a user action or other occurrence.
   * @param {IEventTelemetry} event  {name[, properties[, measurements]]}
   * @param {ICustomProperties} [customProperties] {any}
   */
  public trackEvent(eventName: string, customProperties?: any) {
    if (this.nativeDevice && this.globalServ.env !== 'dev') {
      this.lsServ.getActiveUser().then((dataUser: any) => {
        if (dataUser && typeof dataUser === "object") {
          if (dataUser.nombre) this.datos.usuario_nombre = dataUser.nombre;
          if (dataUser.user && dataUser.user.email) this.datos.usuario_correo = dataUser.user.email;
          const customEvent: any = {
            name: `${this.prefix}_v${this.version}_${eventName}`,
            properties: { ...this.datos, ...customProperties }
          };
          this.appInsights.trackEvent(customEvent);
        }
      });
    }
  }

  public clearAuthenticatedUse() {
    this.appInsights.clearAuthenticatedUserContext();
  }

  public startTrackPage(pageName: string = "page") {
    if (this.nativeDevice && this.globalServ.env !== 'dev') {
      let viewName = `${this.prefix}_VIEWS_${pageName}`;
      console.info("startTrackPage", viewName.toUpperCase())
      try {
        this.appInsights.startTrackPage(viewName.toUpperCase());
      } catch (ex) {
        this.appInsights.trackException(ex);
      }
    }
  }

  public stopTrackPage(pageName: string = "page") {
    if (this.nativeDevice && this.globalServ.env !== 'dev') {
      let viewName = `${this.prefix}_VIEWS_${pageName}`;
      console.info("stopTrackPage", viewName.toUpperCase())
      try {
        this.appInsights.stopTrackPage(viewName.toUpperCase());
      } catch (ex) {
        this.appInsights.trackException(ex);
      }
    }
  }

}
