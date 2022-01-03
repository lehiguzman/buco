import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, MenuController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { GlobalService, LocalStorageService, AuthService, ApplicationInsightsService } from '../../../providers';

@Component({
  selector: 'app-solicitar',
  templateUrl: './solicitar.page.html',
  styleUrls: ['./solicitar.page.scss'],
})
export class SolicitarPage implements OnInit {

  public emailForm: FormGroup;
  public errores: any;

  //Variable de control para separar cuando se cambia la contraseña o se recupera
  public autenticado: boolean = false;

  constructor(public formBuilder: FormBuilder,
    private globalService: GlobalService,
    private ls: LocalStorageService,
    private appInsights: ApplicationInsightsService,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {

    this.errores = {
      email: '',
    };    

    this.emailForm = this.formBuilder.group({

      _email: ['', [Validators.required, this.emailValidator.bind(this)]],

    });
  }

  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('solicitar_contrasena');
    this.ls.getStoreData("emailSolicitud").then( ( email ) => {
      if(email) {
        console.log("estoy autenticado");
        this.menuCtrl.swipeGesture(true);
        this.autenticado = true;
        this.emailForm.setValue({
          _email: email,
        });
      } else {
        this.menuCtrl.swipeGesture(false);
        console.log("No estoy autenticado");
      }
    });
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('solicitar_contrasena');    
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      //header: 'Correo errado',  
      mode: 'ios',
      message: '<h5>El correo no se encuentra en nuestros registros</h5>',
      cssClass: 'buttonOk',
      buttons: ['OK']
    });

    await alert.present();
  }

  enviarMail() {
    let email = this.emailForm.value;
    this.authService.sendEmail(email).subscribe((data: any) => {
      console.log("Datos : ", data.code);
      if (data.code == '204' || data.code == '200') {
        this.globalService.mensaje({ message: data.message, color: 'success', position: 'middle' });
        this.navCtrl.navigateForward('mensaje');
      }
    });
  }

  /* Validadores */
  emailValidator(control: FormControl): { [s: string]: boolean } {

    let regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (control.value !== '' && control.value !== null) {
      if (!control.value.toLowerCase().match(regex)) {
        this.errores.email = 'Correo invalido';
        return { invalidEmail: true };
      }
    }
    this.errores.email = '';

  }

}
