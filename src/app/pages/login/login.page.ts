import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, Platform } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
// Servicios
import {
  GlobalService, LocalStorageService,
  AuthService, FirebaseAuthService, RequestsService,
  ApplicationInsightsService
} from '../../providers';
// Firebase
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  userMail: any = null;
  public pushToken: string = "---";

  constructor(
    private appInsights: ApplicationInsightsService,
    private authService: AuthService,
    private fireAuthServ: FirebaseAuthService,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private platform: Platform,
    private reqServ: RequestsService,
    public afAuth: AngularFireAuth,
    public fcm: FCM,
    public formBuilder: FormBuilder,
    public globalServ: GlobalService,
    public lsServ: LocalStorageService,
  ) {
    this.globalServ.UsuarioLogueado = false;
    this.loginForm = formBuilder.group({
      _username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      _password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]]
    });

    if (!this.platform.is('mobileweb') && (this.platform.is('android') || this.platform.is('ios'))) {
      setTimeout(() => {
        this.fcm.getToken().then(pushToken => { if (pushToken) this.pushToken = pushToken; }).catch();
      }, 10000);
    }
  }

  ngOnInit() { }
  ionViewWillEnter() {
    this.globalServ.mostrarVersion = true;
    this.menuCtrl.enable(false);

    var str = "something";
    this.makespace( str );

    var resp = str.split('').join(' '); // "h e l l o"

    console.log( resp );

  }

  makespace(str) {
    var resp = str.split('').join(' ');   

    setTimeout(() => {  alert( resp ); }, 3000);
  }

  ionViewWillLeave() {
    this.globalServ.mostrarVersion = false;
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('login');
    this.reqServ.loginGenerico();
    this.globalServ.dismissLoader();
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('login');
  }

  login() {
    if (this.loginForm.invalid) {
      console.error('error de validacion');
      this.globalServ.mensaje({ message: "Por favor introduzca datos válidos" })
      return;
    }
    this.globalServ.loadingCustom("Iniciando...", 8888);

    this.authService.login(this.loginForm.value).subscribe((res: any) => {
      this.lsServ.setToken(res.token).then(() => {

        // obtener informacion del usuario
        this.authService.getUser().subscribe((resUser: any) => {
          if (resUser.code === 200 || resUser.status === 200) {
            this.globalServ.UsuarioLogueado = true;

            this.lsServ.setStoreData("usuario", resUser);
            const usuario = resUser.data;
            const perfilProfesional = (usuario.roles[0] == 'ROLE_PROFESIONAL') ? true : false;
            this.lsServ.setStoreData("perfilProfesional", perfilProfesional);

            // almacenar datos del usuario
            this.lsServ.setActiveUser(usuario).then(() => {

              if (!perfilProfesional) {
                // loguear cliente                               
                this.globalServ.UsuarioTipo = "cliente";
                this.authService.loginCliente().subscribe((respCliente: any) => {                                    
                  this.lsServ.setActiveUser(respCliente.data);                                
                });
              } else {
                // loguear profesional 
                
                this.globalServ.UsuarioTipo = "profesional";
                this.authService.loginProfesional().subscribe((respProfesional: any) => {
                  delete respProfesional.data.user;
                  // guardar los datos del profesional en una propiedad
                  this.lsServ.setActiveUser({ profesional: respProfesional.data }).then( () => {
                    this.navCtrl.navigateRoot("orden-servicio-list"); // go to Servicios
                    this.globalServ.mensaje({ message: `¡Bienvenido ${usuario.name}!`, color: "light", duration: 1111 });        
                  });
                  
                }, error => {
                  var message = "¡Lo siento; usted no se encuentra activo en el sistema!";
                  if (error.code == 403) {
                    this.globalServ.mensaje({ message: message, color: 'warning', position: 'middle' });
                    this.fireAuthServ.logout().finally(() => {
                      this.lsServ.deleteAllStoreData();
                      this.navCtrl.navigateRoot("/login");
                    })
                  }
                });
              }              

              // autenticar con Firebase
              let credentials: any = { email: usuario.email, password: this.loginForm.value._password };
              this.fireAuthServ.login(credentials).then(() => {
                // obtener tokenID Firebase
                this.lsServ.setActiveUser({ ...usuario, ...{ tokenhash: this.globalServ.encriptar(`${usuario.username}||${credentials.password}`) } });

                // Registro de Token Push Notifications
                this.authService.updateTokens({ pushToken: this.pushToken, indice: "tokens" });

                if (!perfilProfesional) {
                  this.globalServ.mensaje({ message: `¡Bienvenido ${usuario.name}!`, color: "light", duration: 1111 });
                  this.navCtrl.navigateRoot("home"); // go to Home     
                }

                this.globalServ.dismissLoader();
                
              }).catch(error => {
                console.error(error);
                this.globalServ.dismissLoader();
                if (error.code && error.code === "auth/user-not-found") {
                  this.fireAuthServ.register(credentials);
                  this.navCtrl.navigateRoot("home"); // go to Home
                } else {
                  let mensaje = this.fireAuthServ.errorMessages(error);
                  if (this.globalServ.debug && mensaje) this.globalServ.mensaje({ message: mensaje });
                }
              }); // login firebase
            }); // localStorage

          } else if (resUser.message) {
            this.globalServ.dismissLoader();
            if (this.globalServ.debug) this.globalServ.mensaje({ message: resUser.message });
          }
        }, error => { console.error(error); this.globalServ.dismissLoader(); });

      }); // lsServ.setToken()
    }, error => { console.error(error); this.globalServ.dismissLoader(); });
  }

  recuperarPassword() {
    this.globalServ.pageTransition();
    this.navCtrl.navigateForward('solicitar');
  }
}
