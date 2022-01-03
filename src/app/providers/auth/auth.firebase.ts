import { Injectable } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthFirebaseService {

  constructor(public afAuth: AngularFireAuth) { }

  registerUser(value: any) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  loginUser(value: any) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut()
          .then(() => {
            console.log("LOG Out");
            resolve();
          }).catch((error) => {
            reject(error);
          });
      } else {
        reject();
        console.log("NO LOGOUT USER")
      }
    })
  }

  userDetails() {
    return firebase.auth().currentUser;
  }

  auth() {
    return firebase.auth();
  }

  /* changeEmail(credentials: any, newEmail: string, callback) {
    this.afAuth.auth
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        let u = firebase.auth().currentUser;
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

  /* changePassword(credentials: any, newPass: string, callback) {
    this.afAuth.auth
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        let u = firebase.auth().currentUser;
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
      mensaje = "¡Este correo electrónico ya está registrado!";
    } else if (errorCode === "auth/invalid-email") {
      mensaje = "¡Correo electrónico incorrecto!";
    } else if (errorCode === "auth/operation-not-allowed" || errorCode === "auth/user-disabled") {
      mensaje = "¡Cuenta inhabilitada!";
    } else if (errorCode === "auth/user-not-found") {
      mensaje = "¡El correo electrónico no esta registrado!";
    } else if (errorCode === "auth/weak-password") {
      mensaje = "¡La contraseña es muy debil!";
    } else if (errorCode === "auth/wrong-password") {
      mensaje = "¡Contraseña incorrecta!";
    } else if (errorCode === "auth/popup-closed-by-user") {
      mensaje = "¡La ventana fue cerrada antes de completar la operación!";
    } else if (errorCode === "auth/account-exists-with-different-credential") {
      mensaje = "¡Ya existe una cuenta registrada con la misma dirección de correo electrónico!";
    } else if (errorCode === "auth/network-request-failed") {
      mensaje = "¡Se ha producido un error de red; no se pudo conectar con el servidor!";
    } else if (errorCode === "auth/invalid-credential" || errorCode === "auth/invalid-verification-code" || errorCode === "auth/invalid-verification-id") {
      mensaje = "¡Las credenciales inválidas!";
    } else if (errorCode == "4201" || errorMessage == "User cancelled dialog") {
      mensaje = "¡Inicio de sesión con Facebook cancelado!";
    }

    return mensaje;
  }
}
