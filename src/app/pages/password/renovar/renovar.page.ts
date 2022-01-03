import { Component, OnInit } from '@angular/core';

import { NavController, AlertController, MenuController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { GlobalService, LocalStorageService, AuthService, ApplicationInsightsService } from '../../../providers';

@Component({
  selector: 'app-renovar',
  templateUrl: './renovar.page.html',
  styleUrls: ['./renovar.page.scss'],
})
export class RenovarPage implements OnInit {

	  public passwordForm: FormGroup;
  	public errores: any;
    public typeclave: string = "password";
    public autenticado: boolean = false;

  constructor( public formBuilder: FormBuilder, 
               private globalService: GlobalService,
               private ls: LocalStorageService,
               private navCtrl: NavController,
               private menuCtrl: MenuController,
               private authService: AuthService,
               private appInsights: ApplicationInsightsService,
               private alertCtrl: AlertController ) { }

  ngOnInit() {

  	this.errores = {    
      _email: '',
      _code: '',
      _password: '',
    };
    
    this.passwordForm = this.formBuilder.group({
      
        _email: ['', [Validators.required, this.emailValidator.bind(this) ] ],
        _code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)],  ],
        _password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15), this.onlyPassValidator.bind(this) ]], 
        //mostrarClave: [false, []]

      });
    }
    
    ionViewDidEnter() {
      // Application Insights ::: iniciar track
      this.appInsights.startTrackPage('renovar_password');
      this.ls.getStoreData("emailSolicitud").then( email => {
        if( email ) {
          this.menuCtrl.swipeGesture(true);
          this.autenticado = true;
          this.passwordForm.setValue({
            _email: email,
            _code: '',
            _password: ''
          });          
        }  else {
          this.menuCtrl.swipeGesture(false);
          console.log("No estoy autenticado");
        }
      });
    }
    ionViewDidLeave() {
      // Application Insights ::: detener track
      this.appInsights.stopTrackPage('renovar_password');
    }

    async presentAlert( msg: any, ruta: any ) {
      const alert = await this.alertCtrl.create({
        //header: '',      
        mode: 'ios', 
        message: msg,        
        buttons: [{
          text: 'OK',
          cssClass: 'buttonOk',
          handler: () => {
            alert.dismiss().then( () => {
              if(ruta == "login")
              {
               this.globalService.pageTransition();
               this.navCtrl.navigateForward('login');
              }
            })
          }
        }]
      });

      await alert.present();
    }

    renovarClave() {

      let form = this.passwordForm.value;

      this.authService.renewPassword(form).subscribe( ( data: any ) => {
        if( data.code == 200 ) {
          this.globalService.mensaje({ message: data.message, color: 'success', position: 'middle' });
          this.navCtrl.navigateForward("login");
        }
      });     
      
    }

  	  /* Validadores */
	  emailValidator(control: FormControl): { [s: string]: boolean } {

	    let regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	    if (control.value !== '' && control.value !== null) {
	      if (!control.value.toLowerCase().match(regex)) {
	        this.errores._email = 'Correo invalido';
	        return { invalidEmail: true };
	      }
	    }
	    this.errores._email = '';

	  }

	  onlyPassValidator(control: FormControl): { [s: string]: boolean } {

	    if (control.value !== '' && control.value !== null && (control.value.length < 6 || control.value.length > 12)) {      
	      this.errores._password = "La contraseña debe ser entre 8 y 15 caracteres";
	      return { invalidPass: true };
	    }
	    this.errores._password = "";

	  }

    /*mostrar() {      
        if (this.passwordForm.value.mostrarClave) {
          this.typeclave = "text";
        } else {
          this.typeclave = "password";
        }
    }*/

    irAtras() {
      this.navCtrl.navigateBack('solicitar');
    }

  }
