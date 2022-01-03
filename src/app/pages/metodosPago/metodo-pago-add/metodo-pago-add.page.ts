import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { CardIO } from '@ionic-native/card-io';
import {
  GlobalService, LocalStorageService,
  ClienteTarjetaService, ApplicationInsightsService
} from '../../../providers';
import * as moment from 'moment';

@Component({
  selector: 'app-metodo-pago-add',
  templateUrl: './metodo-pago-add.page.html',
  styleUrls: ['./metodo-pago-add.page.scss'],
})
export class MetodoPagoAddPage implements OnInit {

  public registroForm: FormGroup;
  private objMetodoPago: any;

  titulo = "Registrar Método de pago";
  item: any;
  metodoPago: any;

  id: any;
  numero: any;
  nombre: any;
  fechaExpiracion: any;
  cvv: any = "";  

  constructor(
    private appInsights: ApplicationInsightsService,
    private tarjetaApi: ClienteTarjetaService,
    public activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public cardIO: CardIO,
    public formBuilder: FormBuilder,
    public globalServ: GlobalService,
    public ls: LocalStorageService,
    public navCtrl: NavController,
    public router: Router,
  ) { }

  async presentAlert(msg: any, ruta: any) {
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
              this.globalServ.pageTransition();
              this.router.navigate([ruta]);
            }
          })
        }
      }]
    });

    await alert.present();
  }

  ngOnInit() {

    this.registroForm = this.formBuilder.group({
      nombre: [this.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      numero: [this.numero, [this.lengthValidator.bind(this)]],
      fechaExpiracion: ['', [Validators.required]],
      cvv: ['', [this.lengthCvvValidator.bind(this)]],
    });
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('cliente_tarjeta_add');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('cliente_tarjeta_add');
    this.ls.deleteStoreData("metodoPago");
    this.registroForm.reset();
  }

  cargarForm() {
    this.registroForm.setValue({
      numero: this.numero,
      fechaExpiracion: this.fechaExpiracion,
      cvv: this.cvv,
      nombre: this.nombre
    });
    this.registroForm.controls['numero'].disable();
    this.registroForm.controls['fechaExpiracion'].disable();
    this.registroForm.controls['cvv'].disable();
  }

  scan() {
    console.log("scan");
    this.cardIO.canScan()
      .then(
        (res: boolean) => {
          if (res) {
            let options = {
              scanExpiry: true,
              requireExpiry: true,
              requireCVV: true,
              requireCardHolderName: true,
              scanInstructions: "Escanee la parte frontal de su Tarjeta",
              hideCardIOLogo: true,
              useCardIOLogo: true,
            };
            this.cardIO.scan(options).then((data) => {
              this.setCardData(data);
            }, err => {
              console.log("error");
            });
          }
        }
      );
  }

  setCardData(data: any) {
    let formCard = this.registroForm.controls;
    formCard.numero.setValue(data.cardNumber);
    formCard.fechaExpiracion.setValue(data.expiryYear + "-" + data.expiryMonth);
    formCard.cvv.setValue(data.cvv);
    formCard.nombre.setValue(data.cardholderName);
  }

  registro() {
    let form = this.registroForm.value;
    if (this.registroForm.invalid) {
      console.error('error de validacion');
      return;
    }
    this.globalServ.loadingCustom("Registrando...", 99999);
    this.objMetodoPago = {
      numero: form.numero,
      fechaExpiracion: moment(form.fechaExpiracion).format('MM') + "/" + moment(form.fechaExpiracion).format('YY'),
      cvv: form.cvv,
      nombre: form.nombre
    };

    this.tarjetaApi.create(this.objMetodoPago).subscribe((res: any) => {
      this.globalServ.dismissLoader();
      if (res.code == 201) {
        this.globalServ.mensaje({ message: res.message, color: 'success', duration: 2000 });
        this.ls.deleteStoreData("metodoPago");
        this.ls.deleteStoreData("metodosPago");
        this.ls.deleteStoreData("metodosPagoCliente");
        this.navCtrl.navigateForward("metodo-pago-list");
      }
    });
  }

  irAtras() {
    this.globalServ.pageTransition();
  }

  lengthValidator(control: FormControl) {

    let minLength: number = 16;
    let numeroTarjetaLength: number;

    if (control.value) { numeroTarjetaLength = control.value.toString().length; }

    if (numeroTarjetaLength < minLength) {
      return { invalidNumeroTarjeta: true };
    }

  }

  lengthCvvValidator(control: FormControl) {

    let minLength: number = 3;
    let cvvLength: number;

    if (control.value) { cvvLength = control.value.toString().length; }

    if (cvvLength < minLength) {
      return { invalidCvv: true };
    }

  }
}
