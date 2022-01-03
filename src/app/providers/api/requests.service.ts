import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
// Services
import { GlobalService } from '../global.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ApplicationInsightsService } from '../ApplicationInsights/applicationinsights.service';
// RxJS
import { Observable } from 'rxjs/Observable';


/**
 * Base de peticiones REST API
 * 
 * https://angular.io/api/common/http
 * https://angular.io/guide/http
 */
@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private apiUrl: string = this.globalServ.ApiUrl;
  private loginCountMax: number = 5;
  private loginCount: number = 0;

  constructor(
    private appInsights: ApplicationInsightsService,
    private globalServ: GlobalService,
    private http: HttpClient,
    private lsServ: LocalStorageService,
    private router: Router,
  ) { }

  /**
   * @method  get   Método GET genérico para consultas al api
   *
   * @param  {Object} data {
   *     endpoint: ruta de la consulta
   *     params: parámetros de la consulta'
   *     noVersionApi: remplaza la vesion "/v1" del api si es true
   * }
   *
   * @return {Observable<Object>} Observable<Object> or NULL
   */
  public get(data: any): Observable<Object> {
    return new Observable(observer => {
      this.preRequestToken(data)
        .subscribe((token: string) => {
          let apiUrl = this.apiUrl;
          if ('noVersionApi' in data && data.noVersionApi) apiUrl = apiUrl.replace("/v1", "");

          // config options
          const httpOptions = this.setHttpOptions(token);
          if (data.params) httpOptions.params = this.setParameters(data.params);

          if (data.endpoint) {
            this.http.get(`${apiUrl}/${data.endpoint}`, httpOptions)
              .subscribe(res => {
                observer.next(res);
                observer.complete();
              }, err => {
                observer.error(this.errorServer(err, data));
                observer.complete();
              });
          } else {
            console.error('Error en endpoint', data.endpoint);
          }
        }, err => {
          observer.error(err);
          observer.complete();
        });
    });
  }

  /**
   * @method  post   Método POST genérico para consultas al api
   *
   * @param  {Object} data {
   *     endpoint: ruta de la consulta
   *     body: datos a enviar en la petición
   *     params: parámetros de la consulta'
   *     noVersionApi: remplaza la vesion "/v1" del api si es true
   * }
   *
   * @return {Observable<Object>} Observable<Object> or NULL
   */
  public post(data: any): Observable<Object> {
    return new Observable(observer => {
      this.preRequestToken(data)
        .subscribe((token: string) => {
          let apiUrl = this.apiUrl;
          if ('noVersionApi' in data && data.noVersionApi) apiUrl = apiUrl.replace("/v1", "");

          // config options
          let httpOptions = this.setHttpOptions(token);
          if (!data.body) data.body = {};
          if (data.params) httpOptions.params = this.setParameters(data.params);

          if (data.endpoint) {
            this.http.post(`${apiUrl}/${data.endpoint}`, data.body, httpOptions)
              .subscribe(res => {
                observer.next(res);
                observer.complete();
              }, err => {
                observer.error(this.errorServer(err, data));
                observer.complete();
              });
          } else {
            console.error("Error en endpoint", data.endpoint)
          }
        }, err => {
          observer.error(err);
          observer.complete();
        });
    });
  }

  /**
   * @method  put   Método PUT genérico para consultas al api
   *
   * @param  {Object} data {
   *     endpoint: ruta de la consulta
   *     body: datos a enviar en la petición
   *     params: parámetros de la consulta'
   *     noVersionApi: remplaza la vesion "/v1" del api si es true
   * }
   *
   * @return {Observable<Object>} Observable<Object> or NULL
   */
  public put(data: any): Observable<Object> {
    return new Observable(observer => {
      this.preRequestToken(data)
        .subscribe((token: string) => {
          let apiUrl = this.apiUrl;
          if ('noVersionApi' in data && data.noVersionApi) apiUrl = apiUrl.replace("/v1", "");

          // config options
          let httpOptions = this.setHttpOptions(token);
          if (!data.body) data.body = {};
          if (data.params) httpOptions.params = this.setParameters(data.params);

          if (data.endpoint) {
            this.http.put(`${apiUrl}/${data.endpoint}`, data.body, httpOptions)
              .subscribe(res => {
                observer.next(res);
                observer.complete();
              }, err => {
                observer.error(this.errorServer(err, data));
                observer.complete();
              });
          } else {
            console.error("Error en endpoint", data.endpoint)
          }
        }, err => {
          observer.error(err);
          observer.complete();
        });
    });
  }

  /**
   * @method  delete   Método DELETE genérico para consultas al api
   *
   * @param  {Object} data {
   *     endpoint: ruta de la consulta
   *     params: parámetros de la consulta'
   *     noVersionApi: remplaza la vesion "/v1" del api si es true
   * }
   *
   * @return {Observable<Object>} Observable<Object> or NULL
   */
  public delete(data: any): Observable<Object> {
    return new Observable(observer => {
      this.preRequestToken(data)
        .subscribe((token: string) => {
          let apiUrl = this.apiUrl;
          if ('noVersionApi' in data && data.noVersionApi) apiUrl = apiUrl.replace("/v1", "");

          // config options
          let httpOptions = this.setHttpOptions(token);
          if (data.params) httpOptions.params = this.setParameters(data.params);

          if (data.endpoint) {
            this.http.delete(`${apiUrl}/${data.endpoint}`, httpOptions)
              .subscribe(res => {
                observer.next(res);
                observer.complete();
              }, err => {
                observer.error(this.errorServer(err, data));
                observer.complete();
              });
          } else {
            console.error("Error en endpoint", data.endpoint)
          }
        }, err => {
          observer.error(err);
          observer.complete();
        });
    });
  }

  /**
   * @method  preRequestToken
   *
   * @return  {Observable<String>}
   */
  private preRequestToken(data: any): Observable<String> {
    return new Observable(observer => {
      // control de conexiones
      if (!this.globalServ.online) {
        this.globalServ.mensaje({ message: "No cuenta con conexión a Internet en estos momentos" });
        observer.error("503 Service Unavailable");
        observer.complete();
        this.globalServ.dismissLoader(); // cerrar loader (solo si esta activado)
      }

      if (!data || !data.endpoint) {
        console.error('La propiedad endpoint es requerida!');
        observer.next(null);
        observer.complete();
      } else {
        this.lsServ.getStoreData('token').then((token: any) => {
          if (token) {
            observer.next(token);
            observer.complete();
          } else {
            observer.next(null);
            observer.complete();
          }
        }).catch(() => {
          console.error('token no almacenado');
          observer.error('token no almacenado');
          observer.complete();
        });
      }
    });
  }

  /**
   * @method  setHttpOptions
   *
   * @return  {HttpHeaders<Object>}
   */
  private setHttpOptions(token: string = "", contentType: string = "application/json") {
    return {
      headers: new HttpHeaders({
        'Content-Type': contentType,
        'Authorization': `Bearer ${token}`
      }),
      params: new HttpParams({})
    };
  }

  /**
   * @method  setParameters   Configura los parámetros de las peteciones
   *
   * @param   {Object}  parameters    parámetros de la petición
   *
   * @return  {HttpParams<Object>}
   */
  private setParameters(parameters: any) {
    let params = new HttpParams({});
    for (let p in parameters) {
      params = params.append('' + p + '', parameters[p]);
    }

    return params;
  }

  public loginGenerico() {
    // desloguear al usaurio / borrar datos del usuario
    this.globalServ.UsuarioLogueado = false;
    this.lsServ.getActiveUser().then((usuario: any) => {
      let _username = this.globalServ.loginGenerico.username;
      let _password = this.globalServ.loginGenerico.password;
      let goHome = false;
      if (usuario) {
        if (usuario.tokenhash) {
          let credentials = this.globalServ.desencriptar(usuario.tokenhash).split('||');
          _username = credentials[0];
          _password = credentials[1];
          goHome = true;
        }
      }
      // evitar loop inicio de sesión
      if (this.loginCount <= this.loginCountMax) {
        this.loginCount++;
        this.post({
          endpoint: 'login_check', body: { _username: _username, _password: _password }, noVersionApi: true
        }).subscribe((res: any) => {
          this.lsServ.setToken(res.token).then(() => {
            if (this.globalServ.debug) this.globalServ.mensaje({ message: "Token renovado", color: 'success', duration: 2000 });
            if (goHome) {
              this.loginCount = 0;
              this.globalServ.UsuarioLogueado = true;
              this.router.navigate(['home']);
            } else { this.router.navigate(['/login']); }
          });
        });
      } else {
        let msj = "Se alcanzó el límite máximo de inicio de sesión";
        if (this.globalServ.debug) this.globalServ.mensaje({ message: msj });
        console.warn(msj);
        this.loginCount = 0;
        this.lsServ.deleteAllStoreData();
        setTimeout(() => { this.router.navigate(['/login']); }, 999);
      }
    });
  }

  /**
   * Mensajes de Control de Errores (consultas al servidor [API Rest])
   * https://es.wikipedia.org/wiki/Anexo:C%C3%B3digos_de_estado_HTTP
   *
   * Responses con code error:
   *     400:    Petición Mala
   *     401:    No Autorizado
   *     403:    Acceso Denegado
   *     404:    Recurso No Encontrado
   *     500:    Error Interno en el Servidor
   */
  private errorServer(error: any, data: any = null) {
    if (error.name === "HttpErrorResponse") {
      console.error("HttpErrorResponse");
      console.error(error.message);
      if (error.status === 403 && error.statusText === "Forbidden") {
        let msj = "Se ha producido un error mientras se procesaba la solicitud";
        if (this.globalServ.debug) this.globalServ.mensaje({ message: msj, color: 'warning', duration: 2000 });
        error['error'] = {
          code: 403,
          message: msj,
          type: "HttpErrorResponse"
        };
      }
      error = error.error;
    }
    console.error("ERROR REQUEST:", error);

    if (error.code === 401 || error.code === 403) {
      let message = "Acceso No Autorizado";
      if (error.code === 401 && error.message === "Expired JWT Token") {
        console.warn("TOKEN EXPIRADO");
        message += " | " + "El token ha expirado";
      } else if (error.code === 401 && error.message === "Invalid JWT Token") {
        console.warn("TOKEN INVÁLIDO");
        message += " | " + "El token es inválido";
      } else if (error.code === 401) {
        message = "Credenciales Inválidas";
      }
      if (this.globalServ.debug) { this.globalServ.mensaje({ message: message, color: 'warning', duration: 2000 }); }
      this.loginGenerico();
    }

    // >>> Servicio de Control y Diagnóstico de errores
    let labelError = ('module' in data) ? data.module : 'generico';
    this.appInsights.trackEvent(labelError, { error: error, request: data });
    // <<< Servicio de Control y Diagnóstico de errores

    if (error.code === 400) {
      console.error("Petición Mala")
    } else if (error.code === 403) {
      console.error("Acceso Denegado")
    } else if (error.code === 404) {
      console.error("Recurso No Encontrado")
    } else if (error.code === 500) {
      console.error("Error Interno del Servidor")
      if (error.description && error.type === "validator") {
        let mensaje = "";
        if (error.description) {
          if (!("title" in error.description) && !("detail" in error.description)) {
            if (error.description instanceof Array) {
              error.description.forEach(element => {
                if (element.message && element.property_path) mensaje += ` [${element.property_path}: ${element.message}] `;
              });
            }
          } else if ("title" in error.description && "detail" in error.description) {
            if (error.description.violations instanceof Array) {
              error.description.violations.forEach(element => {
                if (element.title && element.propertyPath) mensaje += ` [${element.propertyPath}: ${element.title}] `;
              });
            }
          }
        }
        // mostrar errores no controlados de parámetros inválidos
        if (mensaje) this.globalServ.mensaje({ header: error.message || '', message: mensaje, color: 'warning', position: 'top', duration: 9999 });
      }
    }

    let message = "¡Oops! :'( ";
    if (error.message) message = error.message;
    if (!error.message) message = "¡ERROR DESCONOCIDO!";
    if (!error.message && error.info) message = error.info;
    if (error.message && error.info && error.message != error.info) message += " (" + error.info + ")";
    // validar número de orden
    if (error.trackIdInvalid) { message = null; }

    if (message) {
      if (error.code === 500) {
        this.globalServ.mensaje({ message: message, color: 'danger', position: 'bottom' });
      } else {
        if ((error.code != 404 && error.code != 401) || this.globalServ.debug) {
          this.globalServ.mensaje({ message: message, color: 'warning', position: 'middle' });
        }
      }
    }

    // cerrar loader (solo si esta activado)
    this.globalServ.dismissLoader();

    return error;
  }
}
