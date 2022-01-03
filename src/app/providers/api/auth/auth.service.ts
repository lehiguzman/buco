import { Injectable } from '@angular/core';
// Services
import { RequestsService } from '../requests.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private model: string = "api";

  constructor(private reqServ: RequestsService) { }

  /**
   * Obtiene el Usuario Logueado
   */
  getUser() {
    return this.reqServ.get({ endpoint: `v1`, module: `user`, noVersionApi: true })
  }

  /**
   * Authentica el usuario
   * 
   * @param data   Credenciales del Usuario
   */
  login(data: any) {
    return this.reqServ.post({ endpoint: `login_check`, body: data, module: `auth_login_check`, noVersionApi: true })
  }  

  /**
   * Login Cliente
   */
  loginCliente() {
    return this.reqServ.post({ endpoint: `clientes/auth/login`, module: `auth_login_cliente` })
  }

  /**
   * Login Profesional
   */
  loginProfesional() {
    return this.reqServ.post({ endpoint: `profesionales/auth/login`, module: `auth_login_profesional` })
  }

  /**
   * Cierra sesión del profesional
   * 
   * @param data   Credenciales del Usuario
   */
  logoutProfesional() {
    return this.reqServ.post({ endpoint: `profesionales/auth/logout`, module: `profesional_logout` })
  }

  /**
   * Registrar Usuario
   * 
   * @param data   Datos del Usuario
   */
  create(data: any) {
    return this.reqServ.post({ endpoint: `registro`, body: data, module: "auth_user_register", noVersionApi: true })
  }

  /**
   * Actualizar Tokens Firebase
   * 
   * @param data   Datos tokens
   */
  updateTokens(data: any) {
    return this.reqServ.post({ endpoint: "firebase/tokens", body: data, module: "firebase_update_tokens" });
  }

  recuperarContrasena(data: any) {
    return this.reqServ.post({ endpoint: `${this.model}/recuperarAcceso/correo`, body: data, module: `${this.model}_recuperar_Usuario`, noVersionApi: true })
  }

  reestablecerContrasena(data: any) {
    return this.reqServ.post({ endpoint: `${this.model}/recuperarAcceso/codigo`, body: data, module: `${this.model}_recuperar_Usuario`, noVersionApi: true })
  }

  sendEmail(data: any) {
    return this.reqServ.post({ endpoint: `password_email`, body: data, model: `user_password_email`, noVersionApi: true });
  }

  renewPassword(data: any) {
    return this.reqServ.post({ endpoint: `password_reset`, body: data, model: `user_password_reset`, noVersionApi: true });
  }

  /**
   * Cambia Contraseña del Usuario (Vista Perfil)
   * 
   * @param password   Contraseña nueva
   */
  cambiarContrasena(password: any) {
    return this.reqServ.post({ endpoint: `seguridad/cambiarClave`, body: password, module: `${this.model}_cambiar_contraseña` })
  }

}