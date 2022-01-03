import { Injectable } from '@angular/core';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { Platform } from '@ionic/angular';
// Firebase
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
// import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from "firebase/app";
// Services
import { AuthService } from '../api/auth/auth.service';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  private user: any = null;

  constructor(
    // private firestore: AngularFirestore,
    private authService: AuthService,
    private database: AngularFireDatabase,
    private fcm: FCM,
    private fireAuth: AngularFireAuth,
    private lsServ: LocalStorageService,
    private platform: Platform,
  ) {
    let wind = <any>window;
    this.fireAuth.authState.subscribe(u => {
      if (u) {
        this.user = u;
        let pushToken: string = "---";
        let device: string = "---";
        if (wind && wind.device && wind.device.model) device = wind.device.model;
        if (!this.platform.is('mobileweb') && (this.platform.is('android') || this.platform.is('ios'))) {
          setTimeout(() => {
            this.fcm.getToken().then(token => {
              if (token) pushToken = token;
              u.getIdToken().then((dataToken: any) => {
                let tokendata: any = {
                  tokenId: dataToken,
                  pushToken: pushToken,
                  refreshToken: u.refreshToken,
                  uid: u.uid,
                  deviceModel: device,
                  indice: "tokens"
                };
                // actualiza tokens de Firebase en API
                if (tokendata) this.authService.updateTokens(tokendata).subscribe(() => { }, error => console.error('Error updateTokens: ', error));
                this.lsServ.setStoreData("tokendata", tokendata);
              }).catch((error: any) => { console.error("Error Firebase getIdToken()", error) });
            }).catch((error: any) => { console.error("Error Firebase getToken()", error) });
          }, 10000);
        }
      } else {
        this.user = null;
      }
    });
  }

  authState() {
    return this.fireAuth.authState;
  }

  login(credentials: any) {
    return this.fireAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  register(credentials: any) {
    return this.fireAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
  }

  get getUserAuth() {
    return this.user
  }

  logout() {
    return this.fireAuth.auth.signOut();
  }

  databaseSet(refPath: string, data: any) {
    if (typeof data === 'object')
      return this.database.database.ref(refPath).update(data);
    return null;
  }

  databaseGet(refPath: string = "") {
    return this.database.database.ref(refPath);
  }

  // firestoreAdd(collectionName: string, record: any) {
  //   return this.firestore.collection(collectionName).add(record);
  // }

  // firestoreShow(collectionName: string) {
  //   return this.firestore.collection(collectionName).snapshotChanges();
  // }

  // firestoreUpdate(collectionName: string, recordID: string, record: any) {
  //   this.firestore.doc(collectionName + '/' + recordID).update(record);
  // }

  // firestoreDelete(collectionName: string, recordID: string) {
  //   this.firestore.doc(collectionName + '/' + recordID).delete();
  // }

  /* changeEmail(credentials, newEmail, callback) {
    this.afAuth.auth
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        var u = firebase.auth().currentUser;
        u.updateEmail(newEmail)
          .then(() => {
            return callback("bien", null);
          })
          .catch(error => {
            return callback(null, error);
          });
      })
      .catch(error => {
        return callback(null, error);
      });
  } */

  /* changePassword(credentials, newPass, callback) {
    this.afAuth.auth
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        var u = firebase.auth().currentUser;
        u.updatePassword(newPass)
          .then(() => {
            return callback("bien", null);
          })
          .catch(error => {
            return callback(null, error);
          });
        //  return callback("bien", null);
      })
      .catch(error => {
        return callback(null, error);
      });
  } */

  /**
   * Mensajes de error Firebase
   * @param err
   */
  errorMessages(err: any) {
    let errorCode = err.code,
      errorMessage = err.message || err.errorMessage,
      mensaje: any = null;

    if (errorCode === "auth/email-already-in-use") {
      mensaje = "¡Este correo electrónico ya está siendo utilizado!";
    } else if (errorCode === "auth/invalid-email") {
      mensaje = "¡Correo electrónico incorrecto!";
    } else if (
      errorCode === "auth/operation-not-allowed" ||
      errorCode === "auth/user-disabled"
    ) {
      mensaje = "¡Cuenta inhabilitada!";
    } else if (errorCode === "auth/user-not-found") {
      mensaje = "¡El correo electrónico no esta registrado!";
    } else if (errorCode === "auth/weak-password") {
      mensaje = "¡La contraseña es muy debil!";
    } else if (errorCode === "auth/wrong-password") {
      mensaje = "¡Contraseña incorrecta!";
    } else if (errorCode === "auth/too-many-requests") {
      mensaje = "¡Ha intentado inicar sesión varias veces sin exito!";
    } else if (errorCode === "auth/popup-closed-by-user") {
      //Mensaje original
      mensaje = "¡La ventana fue cerrada antes de completar la operación!";
      // Mensaje por bloqueo de facebook
      // mensaje = "En este momento no tenemos comunicación con facebook.Te invitamos a registrarte con tu correo para que puedas disfrutar de los servicios de Mr.Pedidos";
    } else if (errorCode === "auth/account-exists-with-different-credential") {
      mensaje = "¡Ya existe una cuenta registrada con la misma dirección de correo electrónico!";
    } else if (errorCode === "auth/network-request-failed") {
      mensaje =
        "¡Se ha producido un error de red; no se pudo conectar con el servidor!";
    } else if (
      errorCode === "auth/invalid-credential" ||
      errorCode === "auth/invalid-verification-code" ||
      errorCode === "auth/invalid-verification-id"
    ) {
      mensaje = "¡Las credenciales inválidas!";
    } else if (errorCode == "4201" || errorMessage == "User cancelled dialog") {
      mensaje = "¡Inicio de sesión con el Método Seleccionado cancelado!";
    }

    return mensaje;
  }

}