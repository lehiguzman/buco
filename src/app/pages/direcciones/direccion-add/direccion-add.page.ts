import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import { GlobalService, LocalStorageService, DireccionService, ApplicationInsightsService } from '../../../providers/';

import { Direccion } from '../../../models/direccion';

@Component({
  selector: 'app-direccion-add',
  templateUrl: './direccion-add.page.html',
  styleUrls: ['./direccion-add.page.scss'],
})
export class DireccionAddPage implements OnInit {

  public registroForm: FormGroup;

  private objDireccion: Direccion;

  id: any;
  direccion: any;
  clienteId: any;
  longitud: any;
  latitud: any;
  argumentos: any;
  nombre: any;
  tipo: any = '';
  residencia: any = '';
  pisoNumero: any = '';
  instruccion: any = '';
  telefono: any = '';
  telefonoMovil: any = '';
  editar: boolean = false;
  titulo: string = "Registrar dirección";

  constructor(public formBuilder: FormBuilder,
    public globalService: GlobalService,
    private direccionService: DireccionService,
    private appInsights: ApplicationInsightsService,
    public ls: LocalStorageService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    this.registroForm = this.formBuilder.group({

      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      tipo: ['', [Validators.required]],
      residencia: ['', [Validators.required]],
      pisoNumero: ['', [Validators.required]],
      instruccion: ['', [Validators.required]],
      telefono: ['', [this.lengthValidator.bind(this)]],
      telefonoMovil: ['', [this.lengthValidator.bind(this)]],

    });
  }

  ngOnInit() {

    this.ls.getActiveUser().then((usuario: any) => {      
      this.clienteId = usuario.id;
    });
    this.ls.getStoreData("direccion").then((direccion: any) => {
      if (direccion) {
        console.log("Direccion : ", direccion);
        this.id = direccion.id;
        this.nombre = direccion.direccion;
        this.tipo = direccion.tipo;
        this.residencia = direccion.residencia;
        this.pisoNumero = direccion.piso_numero || direccion.pisoNumero;
        this.instruccion = direccion.instruccion;
        this.telefono = direccion.telefono;
        this.telefonoMovil = direccion.telefonoMovil;
        this.editar = true;
      }
    });
    this.ls.getStoreData("direccionMap").then((direccionMap: any) => {
      this.latitud = direccionMap.latitud;
      this.longitud = direccionMap.longitud;
      this.direccion = direccionMap.direccion;

      this.cargarForm();
    });
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('direcciones_add');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('direcciones_add');
  }

  cargarForm() {
    this.registroForm.setValue({
      nombre: this.direccion,
      tipo: this.tipo.toString(),
      residencia: this.residencia,
      pisoNumero: this.pisoNumero,
      instruccion: this.instruccion,
      telefono: this.telefono,
      telefonoMovil: this.telefonoMovil
    });
  }

  lengthValidator(control: FormControl) {

    let minLength: number = 8;
    let telefonoLength: number;

    if (control.value) { telefonoLength = control.value.toString().length; }

    if (telefonoLength < minLength) {
      return { invalidTelefono: true };
    }

  }

  /*async presentAlert(msg: any, ruta: any) {
    const alert = await this.alertCtrl.create({
      //header: '',  
      mode: 'ios',
      message: msg,
      buttons: [{
        text: 'OK',
        cssClass: 'buttonOk',
        handler: () => {
          alert.dismiss().then(() => {
            if (ruta != "none") {
              this.globalService.pageTransition();
              this.router.navigate([ruta]);
            }
          })
        }
      }]
    });

    await alert.present();
  }*/

  registro() {

    let form = this.registroForm.value;

    /*if (this.registroForm.invalid) {
      console.error('error de validacion');
      return;
    }*/

    this.objDireccion = {
      user_id: this.clienteId,
      direccion: form.nombre,
      tipo: form.tipo,
      longitud: this.longitud,
      latitud: this.latitud,
      residencia: form.residencia,
      pisoNumero: form.pisoNumero,
      telefono: form.telefono,
      telefonoMovil: form.telefonoMovil,
      instruccion: form.instruccion
    }

    console.log("Objeto direccion : ", this.objDireccion);

    if (this.editar) {
      this.direccionService.update(this.id, this.objDireccion).subscribe((data: any) => {

        console.log("Data : ", data);
        if (data.code == 200 || data.code == 201) {
          this.globalService.mensaje({ message: data.message, color: 'success', position: 'middle' });
          this.ls.deleteStoreData("direcciones");
          this.navCtrl.navigateForward("direcciones");
        }
      }, (err: any) => {
        let errorMsg = '<H5>' + err.error.message + '</H5>';
        //this.presentAlert(errorMsg, "none");
      });
    }
    else {
      this.direccionService.create(this.objDireccion).subscribe((data: any) => {

        console.log("Datos de direccion : ", data);

        if (data.code == 201) {
          this.globalService.mensaje({ message: data.message, color: 'success', position: 'middle' });
          this.ls.deleteStoreData("direcciones");
          this.navCtrl.navigateForward("direcciones");
        }

      }, (err: any) => {
        let errorMsg = '<H5>' + err.error.message + '</H5>';
        //this.presentAlert(errorMsg, "none");
      });
    }
  }

  irAtras() {
    this.globalService.pageTransition();
    this.navCtrl.navigateBack("direccion-mapa");
  }
}



