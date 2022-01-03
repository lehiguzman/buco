import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { NavController, MenuController } from '@ionic/angular';

// Servicios
import {
  GlobalService, LocalStorageService,
  AuthService, ApplicationInsightsService
} from "../../providers";
import * as moment from 'moment';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
    
  public typeclave: string = 'password';
  public registroForm: FormGroup;
  public errores: any;
  public mensajeEdad = 'Si soy mayor de 18 años';
  public nombreColor: string;
  public now: any;
  mayor: boolean = false;
  edad: any;

  constructor(
    private appInsights: ApplicationInsightsService,
    private authService: AuthService,
    public formBuilder: FormBuilder,
    public globalServ: GlobalService,    
    public lsServ: LocalStorageService,
    public navCtrl: NavController,
    private menuCtrl: MenuController,
  ) {
    this.menuCtrl.swipeGesture( false );
    this.globalServ.UsuarioLogueado = false;
    this.now = new Date();
  }

  ngOnInit() {
    this.globalServ.loadingCustom();
    this.errores = {
      password: '',
      nombre: '',
      // telefono: '',
      email: ''
    };

    this.registroForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), this.onlyNameValidator.bind(this)]],
      email: ['', [Validators.required, this.emailValidator.bind(this)]],
      // telefono: [false, [this.lengthValidator.bind(this)]],
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10), this.onlyNameValidator.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15), this.onlyPassValidator.bind(this)]],
      cumpleannos: [false, [Validators.required, this.mayorValidator.bind(this)]],
      genero: ['1', [Validators.required]],
      mayor: [{ value: null, disabled: true }, []],
      todosLosTermns: [false, []],
      terminos: [false, [Validators.required, Validators.requiredTrue]],
      cancelacion: [false, [Validators.required, Validators.requiredTrue]],
      cookies: [false, [Validators.required, Validators.requiredTrue]],
      servicios: [false, [Validators.required, Validators.requiredTrue]],
      tratamiendo: [false, [Validators.required, Validators.requiredTrue]]
    });
  }
  ionViewWillEnter() {
    this.globalServ.mostrarVersion = true;
  }
  ionViewWillLeave() {
    this.globalServ.mostrarVersion = false;
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('registro');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('registro');
  }

  registro() {
    if (this.registroForm.invalid) {
      console.error("error de validación del form", this.registroForm);
      return;
    }
    this.globalServ.loadingCustom("Registrando...", 8888);

    let form = this.registroForm.value;
    const credenciales = { _username: form.email, _password: form.password };
    let datos = {
      _name: form.nombre,
      _email: form.email,
      _username: form.username,
      _password: form.password,
      genero: form.genero,
      fechaNacimiento: form.cumpleannos,
      foto: null
      //uuid: res.user.uid,
      //pushToken: res.user.refreshToken
    };

    console.log("Datos de registro : ", datos);

    // crear registro en Plataforma
    this.authService.create(datos).subscribe((resUser: any) => {
      if (resUser.code === 201 || resUser.status === 201) {
        this.lsServ.setStoreData("usuario", resUser);
        const usuario = resUser.data;
        // almacenar usuario
        this.lsServ.setActiveUser(usuario).then(() => {
          this.globalServ.dismissLoader();
          this.globalServ.mensaje({ message: `¡Registro Exitoso! Por favor, inicie su sesión`, color: "light", duration: 3333 });
          this.navCtrl.navigateRoot("login"); // goto Login
        });
      } else if (resUser.message) {
        this.globalServ.dismissLoader();
        this.globalServ.mensaje({ message: resUser.message });
      }
    }, error => { console.error(error); this.globalServ.dismissLoader(); }, () => { });
  }

  mayorValidator(control: FormControl) {
    if (control.value) {
      let date = moment(control.value).format('YYYY-MM-DD');
      this.edad = moment().diff(date, 'year');
      return this.edad;
    }
  }

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

  onlyPassValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value !== '' && control.value !== null && (control.value.length < 6 || control.value.length > 12)) {
      this.errores.password = "La contraseña debe ser entre 8 y 15 carácteres";
      return { invalidPass: true };
    }
    this.errores.password = "";
  }

  onlyNameValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value !== '' && control.value !== null && (control.value.length < 2)) {
      this.errores.nombre = 'El nombre debe contener mas de 2 carácteres';
      return { invalidPass: true };
    }
    this.errores.nombre = '';
  }

  public selectAllTermns(e: any) {
    if (e.detail.checked) {
      this.registroForm.patchValue({
        terminos: true,
        cancelacion: true,
        cookies: true,
        servicios: true,
        tratamiendo: true
      });
    } else {
      this.registroForm.patchValue({
        terminos: false,
        cancelacion: false,
        cookies: false,
        servicios: false,
        tratamiendo: false
      });
    }
  }
}
