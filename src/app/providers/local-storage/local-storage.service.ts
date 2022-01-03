import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';


// tiempo, en minutos, en que expiran los datos en el storage
// uso exclusivo de metodos: setStoreDataTimestamp() y getStoreDataTimestamp()
const MINUTOS = 3;

// https://ionicframework.com/docs/storage/
// https://ionicframework.com/docs/v4/native/native-storage/
// https://ionicframework.com/docs/building/storage
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private nativeDevice: boolean = false;
  private vCodeID: string = ""; // controla la versión del key por cada usuario
  private versionApp: string = "000";

  constructor(private ns: NativeStorage, private ls: Storage, private pltf: Platform) {
    this.nativeDevice = this.pltf.is('cordova') && (this.pltf.is('android') || this.pltf.is('ios'));
    // >>> el siguiente bloque de código limpia el storage del día anterior
    if (this.nativeDevice) {
      this.ns.keys().then((keys) => {
        if (keys) {
          keys.forEach((element: any) => {
            if (!this.isInclude(element)) this.deleteStoreData(element);
          });
        }
      }).catch(() => { });
    } else {
      this.ls.keys().then((keys) => {
        if (keys) {
          keys.forEach((element: any) => {
            if (!this.isInclude(element)) this.deleteStoreData(element);
          });
        }
      }).catch(() => { });
    }
    // <<< fin limpieza storage
  }

  isInclude(text: string) {
    let index = moment().format("YYYYMMDD");
    // claves que deben permanecer
    index += 'activeuser' + 'token' + 'usermail' + 'versionApp' + 'introApp' + 'usuario' + 'preRegistro';
    return index.includes(text.toLowerCase());
  }

  public getCodeID() {
    return this.vCodeID.toString();
  }

  private setCodeID(dataUser: any) {
    this.vCodeID = "";
    if (this.versionApp === "000") {
      this.getStoreData("versionApp")
      .then((v: any) => { if (v) this.versionApp = v.replace(/\./g, ''); });
    } else {
      this.vCodeID += this.versionApp;
    }
    if (dataUser && typeof dataUser === "object") {
      if (dataUser.id) this.vCodeID += dataUser.id;
      if (dataUser.user && dataUser.user.id) this.vCodeID += dataUser.user.id;
    }
  }

  /**
   * Almacena datos en el storage
   *
   * @param key    Nombre de la clave
   * @param data   Datos a almacenar
   */
  setStoreData(key: string, data: any) {
    return new Promise((resolve) => {
      if (!key) {
        console.warn("¡key no proporcionada!");
        resolve(null);
      }
      if (this.vCodeID && !"activeusertokenversionApp".includes(key)) key = this.vCodeID + "__" + key;
      if (this.nativeDevice) {
        this.ns.setItem(key, data).finally(() => resolve(true));
      } else {
        this.ls.set(key, data).finally(() => resolve(true));
      }
    });
  }

  /**
   * Recupera un dato del storage['indexeddb', 'sqlite', 'websql']
   *
   * @param key    Nombre de la clave
   *
   * @return {Promise<Object>} Retorna una Promise con los datos almacenados en la clave
   */
  getStoreData(key: string) {
    return new Promise((resolve) => {
      if (!key) {
        console.warn("¡key no proporcionada!");
        resolve(null);
      }
      if (this.vCodeID && !"activeusertokenversionApp".includes(key)) key = this.vCodeID + "__" + key;
      if (this.nativeDevice) {
        this.ns.getItem(key).then(data => resolve(data)).catch(err => resolve(this.errorNative(err, key)));
      } else {
        this.ls.get(key).then(data => resolve(data)).catch(err => resolve(this.errorNative(err, key)));
      }
    });
  }

  /**
   * Recupera un dato del storage['indexeddb', 'sqlite', 'websql']
   *
   * @param key    Nombre de la clave
   *
   * @return {Observable<Object>} Retorna un Observable con los datos almacenados en la clave
   */
  getStoreDataObservable(key: string): Observable<Object> {
    return new Observable(observer => {
      this.getStoreData(key).then(res => { observer.next(res); observer.complete(); });
    });
  }

  /**
   * Elimina los datos de la clave
   *
   * @param key    Nombre de la clave
   */
  deleteStoreData(key: string) {
    if (!key) {
      console.warn("¡key no proporcionada!");
      return null;
    }
    if (this.vCodeID && !"activeusertokenversionApp".includes(key)) key = this.vCodeID + "__" + key;
    if (this.nativeDevice) {
      this.ns.remove(key);
    } else {
      this.ls.remove(key);
    }
  }

  /**
   * Elimina todos los datos del storage
   */
  deleteAllStoreData() {
    if (this.nativeDevice) {
      this.ns.clear();
    } else {
      this.ls.clear();
    }
  }

  /**
   * Almacena los datos con un timestamp
   * utilizado para mantener una cache temporal
   *
   * @param key    Nombre de la clave
   * @param data   Datos a almacenar
   */
  setStoreDataTimestamp(key: string, data: any) {
    if (key != "") key += "__" + moment().format("YYYYMMDD");
    this.setStoreData(key, { datos: JSON.stringify(data), timestamp: moment().format("YYYY-MM-DD HH:mm:ss") });
  }

  /**
   * Comprueba si los datos estan expirados o no
   * utilizado para mantener una cache temporal
   *
   * @param key    Nombre de la clave
   *
   * @return {Observable<Object>} Retorna un Observable con los datos almacenados en la clave
   */
  getStoreDataTimestamp(key: string, minutos = null): Observable<Object> {
    return new Observable(observer => {
      if (!key) {
        console.warn("¡key no proporcionada!");
        observer.next(null);
        observer.complete();
      }
      key += "__" + moment().format("YYYYMMDD");
      if (!minutos) minutos = MINUTOS;
      if (this.vCodeID) key = this.vCodeID + "__" + key;
      this.getStoreData(key).then((sdt: any) => {
        if (sdt && sdt.timestamp && (moment().diff(moment(sdt.timestamp, 'YYYY-MM-DD HH:mm:ss'), 'minutes') <= minutos)) {
          observer.next(JSON.parse(sdt.datos));
        } else observer.next(null);
        observer.complete();
      });
    });
  }

  /**
   * Errores NativeStorage
   */
  private errorNative(error: any, key: string): any {
    // https://github.com/TheCocoaProject/cordova-plugin-nativestorage#errors
    /*
     * NATIVE_WRITE_FAILED = 1
     * ITEM_NOT_FOUND = 2
     * NULL_REFERENCE = 3
     * UNDEFINED_TYPE = 4
     * JSON_ERROR = 5
     * WRONG_PARAMETER = 6
    */
    if (!error) return null;
    if (error.source == "Native")
      return null;
    return "";
  }

  /**
   * almacena el token para conexion al API
   */
  setToken(token: string) {
    return new Promise((resolve) => {
      this.setStoreData('token', token).finally(() => resolve(true));
    });
  }

  /**
   * Recupera los datos del usuario logueado
   */
  getActiveUser() {
    return new Promise((resolve) => {
      this.getStoreData('activeuser').then((au: any) => {
        if (au) {
          this.setCodeID(JSON.parse(au));
          resolve(JSON.parse(au));
        } else resolve(null);
      }).catch();
    });
  }

  /**
   * Almacena los datos del usuario logueado
   *
   * @param data   Objeto personalizado con los datos del usuario
   */
  setActiveUser(data: any) {
    return new Promise((resolve) => {
      this.getActiveUser().then((res: any) => {
        let __data: any = {}, obj: any = {};
        if (res) __data = { ...__data, ...res };
        if (data && data.uid && data.providerData) {
          const { uid, email, refreshToken, providerData } = data;
          obj = { ...{ uid, email, refreshToken, providerData }, ...{ provider: providerData[0] }, ...{ idToken: data.ma } };
          delete obj.providerData;
          __data = { ...__data, ...obj };
        }
        if (data && (data.id || data.profesional)) {
          __data = { ...__data, ...data };
        } else {
          data.profesional = null;
        }
        delete __data.password;
        delete __data.passwordDate;
        delete __data.passwordEncrypted;
        delete __data.passwordKey;
        delete __data.plainPassword;
        this.setCodeID(__data);
        this.setStoreData('activeuser', JSON.stringify(__data));
      }).catch().finally(() => resolve(true));
    });
  }

  /**
   * Elimina los datos del usuario logueado
   */
  deleteActiveUser() {
    this.deleteStoreData('activeuser');
    this.deleteStoreData('token');
  }

  /**
   * Establece los elementos del arreglo datos
   *
   * @param key    Nombre de la clave
   * @param data   Datos a almacenar
   */
  setItemList(key: string, data: any) {
    if (!key.includes("__")) key += "__" + moment().format("YYYYMMDD");
    this.setStoreData(key, data);
  };

  /**
   * Retorna los elementos del arreglo datos
   *
   * @param key    Nombre de la clave
   */
  getItemList(key: string) {
    if (!key.includes("__")) key += "__" + moment().format("YYYYMMDD");
    return new Promise((resolve) => {
      this.getStoreData(key).then(res => resolve(res)).catch();
    });
  };

  /**
   * Agrega/Actuliza un elemento en el arreglo datos
   *
   * @param key      Nombre de la clave
   * @param data     Datos a almacenar
   * @param position top: coloca el item al comienzo del listado
   */
  addItem(key: string, data: any, position: string = '---') {
    if (!key.includes("__")) key += "__" + moment().format("YYYYMMDD");
    this.getItemList(key).then((elemts: any) => {
      let encontrado = false;
      let index = data.id;
      let regs: any = [];
      if (elemts) {
        regs = elemts.map((item: any) => {
          if (item.id === index) {
            encontrado = true;
            item = { ...item, ...data };
          }
          return item;
        });
      }
      if (!encontrado) if (position === 'top') regs.unshift(data); else regs.push(data);
      this.setItemList(key, regs);
    }).catch();
  };

  /**
   * Elimina un elemento en el arreglo datos
   *
   * @param key    Nombre de la clave
   * @param data   Datos a almacenar
   */
  deleteItem(key: string, data: any) {
    if (!key.includes("__")) key += "__" + moment().format("YYYYMMDD");
    this.getItemList(key).then((elemts: any) => {
      let index = data.id;
      let regs: any = [];
      if (elemts) regs = elemts.filter((item: any) => { if (item.id !== index) return item });
      this.setItemList(key, regs);
    }).catch();
  };

}
