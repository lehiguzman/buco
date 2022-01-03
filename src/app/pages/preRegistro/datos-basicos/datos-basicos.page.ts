import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
// Services
import {
  GlobalService, LocalStorageService,
  ProfesionalPreRegistroService
} from '../../../providers';
import * as moment from 'moment';

@Component({
  selector: 'app-datos-basicos',
  templateUrl: './datos-basicos.page.html',
  styleUrls: ['./datos-basicos.page.scss'],
})
export class DatosBasicosPage implements OnInit {

  registroForm: FormGroup;
  
  form: any = {
    nombre: null,
    genero: null,
    fechaNacimiento: null,
    identificacion: null,
    nacionalidad: null,
    celular: null,
    email: null,
    radioCobertura: null,
    aniosExperiencia: null,
    auto: null,
    ctaTwitter: null,
    ctaFacebook: null,
    ctaLinkedin: null,
    ctaInstagram: null,
    destrezaDetalle: null,
  };
  servicioID: any = 0;

  constructor(
    private lsServ: LocalStorageService,
    private preRegistroApi: ProfesionalPreRegistroService,
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    public globalServ: GlobalService,
  ) { }

  ngOnInit() {
    this.globalServ.loadingCustom("Cargando Información...", 1111);
    this.registroForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      genero: ['1', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      identificacion: [null, [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      celular: [null, [Validators.required]],
      email: ['', [Validators.required, this.emailValidator.bind(this)]],
      radioCobertura: [null, [Validators.required]],
      aniosExperiencia: [null, [Validators.required]],
      auto: ['2', [Validators.required]],
      ctaTwitter: ['', []],
      ctaFacebook: ['', []],
      ctaLinkedin: ['', []],
      ctaInstagram: ['', []],
      destrezaDetalle: ['', [Validators.required]],
    });
  }

  ionViewDidEnter() {
    let p0 = this.lsServ.getStoreData("preRegistro_servicioPostular");
    let p1 = this.lsServ.getActiveUser();
    let p2 = this.lsServ.getStoreData("preRegistro_datosBasicos");
    let p3 = this.lsServ.getStoreData("profesional");
    Promise.all([p0, p1, p2, p3]).then((values: any) => {
      if (values[0] && values[0].id) {
        this.servicioID = values[0].id;
        console.log("Servicio : ", this.servicioID);
      } else {
        this.globalServ.mensaje({ message: "No se pudo válidar el servicio configurado." });
        this.navCtrl.navigateForward("preregistro-home");
      }
      let objUsuario: any = { ...{}, ...this.form, ...this.registroForm };
      if (values[1]) {
        objUsuario = { ...objUsuario, ...values[1] };
      }
      if (values[2]) {
        objUsuario = { ...objUsuario, ...values[2] };
      }
      if (values[3]) {
        objUsuario = { ...objUsuario, ...values[3] };
      }
      if (objUsuario.email) this.cargarForm(objUsuario);
    });
  }
  ionViewWillLeave() {
    // if (this.registroForm.invalid) {
    //   this.lsServ.setStoreData("preRegistro_datosBasicos", null)
    //     .then(() => this.navCtrl.navigateForward("preregistro-home"));
    // }
  }
  ionViewDidLeave() {
    this.registroForm.reset();
  }

  private cargarForm(usuario: any) {

    console.log("Datos de usuario : ", usuario);
    const genero = usuario.genero || usuario.user.genero;
    let radioCobertura = null;
    if (usuario.radioCobertura) {
      radioCobertura = usuario.radioCobertura;
    } else if (usuario.areaCobertura) {
      radioCobertura = usuario.areaCobertura;
    }
    this.registroForm.setValue({
      nombre: usuario.nombre || usuario.name || usuario.user.name,
      genero: String(genero),
      fechaNacimiento: usuario.fechaNacimiento,
      identificacion: usuario.identificacion,
      nacionalidad: usuario.nacionalidad,
      celular: usuario.celular,
      email: usuario.email || usuario.user.email,
      ctaTwitter: usuario.ctaTwitter,
      ctaFacebook: usuario.ctaFacebook,
      ctaLinkedin: usuario.ctaLinkedin,
      ctaInstagram: usuario.ctaInstagram,
      aniosExperiencia: usuario.aniosExperiencia,
      radioCobertura: radioCobertura,
      destrezaDetalle: usuario.destrezaDetalle,
      auto: usuario.auto,
    });
  }

  registro() {
    this.globalServ.loadingCustom("Guardando Información...", 9999);
    let datos: any = this.registroForm.value;
    datos = {
      ...datos, ...{
        correo: datos.email,
        nombreCompleto: datos.nombre,
        cedula: datos.identificacion,
        tlfCelular: datos.celular,
        fechaNacimiento: moment(datos.fechaNacimiento).format("YYYY-MM-DD"),
        areaCobertura: datos.radioCobertura,
        vehiculo: parseInt(datos.auto) === 1 ? 'si' : 'no',
        redesSociales: {
          tw: datos.ctaTwitter,
          fb: datos.ctaFacebook,
          in: datos.ctaLinkedin,
          ig: datos.ctaInstagram,
        },
        especialidad: datos.destrezaDetalle,
        servicioID: this.servicioID,
      }
    };
    this.preRegistroApi.create(datos).subscribe(() => {
      this.globalServ.dismissLoader();
      this.lsServ.setStoreData("preRegistro_datosBasicos", datos)
        .then(() => this.navCtrl.navigateForward("preregistro-home"));
    });
  }

  emailValidator(control: FormControl): { [s: string]: boolean } {
    let regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (control.value !== '' && control.value !== null) {
      if (!control.value.toLowerCase().match(regex)) {
        return { invalidEmail: true };
      }
    }
  }
}
