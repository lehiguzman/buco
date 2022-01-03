import { Component, OnInit } from '@angular/core';

import { NavigationExtras, ActivatedRoute } from '@angular/router';

import {
  GlobalService,
  LocalStorageService,
  ClienteTarjetaService,
  MetodoPagoService,
  OrdenServicioService,
  ProfesionalMetodoPagoService,
  ApplicationInsightsService
} from '../../../providers/';

import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-servicio-pago',
  templateUrl: './servicio-pago.page.html',
  styleUrls: ['./servicio-pago.page.scss'],
})
export class ServicioPagoPage implements OnInit {

  profesionalesODS: any[] = [];
  cantidadPorfesionales: number = 1;
  porcentajeBackup: number = null;
  longitud: any;
  latitud: any;
  direccion: any;
  tarjetas: any = [];

  tarjeta: any = "/assets/icons/tarjeta.png";
  efectivo: any = "/assets/icons/efectivo.png";
  textoBuscar: string = '';

  ordenId: number;
  metodosPago: any[] = [];
  metodoPagoId: number;
  requiereVuelto: any;
  metodoPagoClienteId: number;
  pagoLinea: boolean = false;
  tareas: any;
  cambioMetodo: boolean = false;
  cantidadProfesionales: number = 0;

  public esEfectivo: boolean = false;
  public montoEfectivo: number;
  public montoTotal: number;

  constructor(
    private alertCtrl: AlertController,
    private appInsights: ApplicationInsightsService,
    private globalService: GlobalService,
    private ls: LocalStorageService,
    private metodoPagoService: MetodoPagoService,
    private navCtrl: NavController,
    private ordenServicio: OrdenServicioService,
    private profesionalMetodoPago: ProfesionalMetodoPagoService,
    private tarjetaApi: ClienteTarjetaService,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.globalService.loadingCustom();

    this.ls.getStoreData("cambiarMetodoPago").then((cambiarMetodoPago: boolean) => {
      if (cambiarMetodoPago) {
        this.ls.getStoreData("datosCambio").then((datosCambio: any) => {
          this.cambioMetodo = cambiarMetodoPago;
          this.ordenId = datosCambio.ordenId;
          this.profesionalesODS = datosCambio.profesionalesODS;
          this.tareas = datosCambio.tareas;

          this.listarMetodosPago();
        });
      } else {
        this.ls.getStoreData("ods").then((ods: any) => {
          //console.log("Datos de ODS en metodos de pago : ", ods);
          this.longitud = ods.longitud;
          this.latitud = ods.latitud;
          this.direccion = ods.direccion;
          this.profesionalesODS = ods.profesionalesODS;
          this.cantidadPorfesionales = ods.cantidadProfesionales;
          this.porcentajeBackup = ods.porcentajeBackup;
          this.tareas = ods.tareas;

          this.listarMetodosPago();
        });
      }
    });
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('servicio_pago');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track       
    this.appInsights.stopTrackPage('servicio_pago');
    this.ls.deleteStoreData("cambiarMetodoPago");
    this.ls.deleteStoreData("datosCambio");
  }

  listarMetodosPago() {

    this.cantidadPorfesionales = this.profesionalesODS.length;

    this.metodoPagoService.list().subscribe((data: any) => {
      this.buscarMetodosComunes(data.data);
    });
  }

  buscarMetodosComunes(metodosPago: any) {

    metodosPago.forEach(metodoPago => {
      var metodoExiste = 0;
      
      this.profesionalesODS.forEach(profesional => {

        this.profesionalMetodoPago.listProfesional(profesional.id).subscribe((data: any) => {
          var metodosPago = data.data;          
          if( this.profesionalesODS.length > 1 ) {
          metodosPago.forEach(element => {

            if (metodoPago.id == element.metodoPago.id) {
              metodoExiste++;
            }

            if (metodoExiste == this.cantidadPorfesionales) {
              this.metodosPago.push(element);
            }
          
          });
          } else {
            this.metodosPago = metodosPago;
            return false;
          }
        });
      });
    });
  }

  buscarMetodoPago(event) {
    this.textoBuscar = event.detail.value;
  }

  validarMetodoPago(metodoPago) {

    this.metodoPagoId = metodoPago.id;
    this.pagoLinea = metodoPago.pagoLinea;
    this.requiereVuelto = metodoPago.requiereVuelto;
    this.tarjetas = [];

    if (this.requiereVuelto) {
      this.desplegarMonto();
      return false;
    } else {
      this.esEfectivo = false;
      this.montoEfectivo = null;
    }

    if (this.pagoLinea) {
      this.tarjetaApi.list().subscribe((resp: any) => {
        var metodoPagoCliente = resp.data;
        metodoPagoCliente.forEach(element => {
          this.tarjetas.push({
            name: element.numero,
            type: 'radio',
            label: element.numero,
            value: element.id,
          });
        });

        this.agregarTarjeta();
      });
    } else {
      this.continuar(null);
    }
  }

  async agregarTarjeta() {
    const alert = await this.alertCtrl.create({
      header: 'Seleccione una tarjeta',
      inputs: this.tarjetas,
      cssClass: 'alert-prueba alert-danger',
      mode: 'ios',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'buttonOk',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          cssClass: 'buttonOk',
          handler: (data) => {
            //console.log('ok' );
            console.log("Inputs : ", data);
            this.metodoPagoClienteId = data;

            this.continuar(this.metodoPagoClienteId);
          }
        }
      ]
    });

    await alert.present();
  }

  continuar(metodoPagoClienteId) {

    if (this.cambioMetodo) {

      var odsModificacion = {
        metodoPago_id: this.metodoPagoId,
        metodoPagoCliente_id: metodoPagoClienteId,
        montoEfectivo: this.montoEfectivo,
      }

      this.ordenServicio.updateMetodoPago(this.ordenId, odsModificacion).subscribe((data: any) => {
        console.log("data : ", data);
        if (data.code == 200 || data.code == 204) {
          this.globalService.mensaje({ message: data.message, color: 'success', position: 'middle' });

          //Porvisional
          let datosOrden: NavigationExtras = {
            queryParams: {
              id: this.ordenId,
              tipoListado: 1,
            }
          }
          ///
          this.navCtrl.navigateForward("orden-servicio-detail", datosOrden);
        }
      });

    } else {
      var ods = {
        profesionalesODS: this.profesionalesODS,
        cantidadProfesionales: this.cantidadPorfesionales,
        porcentajeBackup: this.porcentajeBackup,
        latitud: this.latitud,
        longitud: this.longitud,
        direccion: this.direccion,
        pagoLinea: this.pagoLinea,
        metodoPagoId: this.metodoPagoId,
        metodoPagoClienteId: metodoPagoClienteId,
        montoEfectivo: this.montoEfectivo,
        tareas: this.tareas
      }

      console.log("DOS : ", ods);

      this.ls.setStoreData("ods", ods);

      this.globalService.pageTransition();
      this.navCtrl.navigateForward('servicio-req');
    }
  }

  desplegarMonto() {
    var montoTotal: number = 0;

    this.tareas.forEach(element => {
      montoTotal += element.precio || element.monto;
    });

    this.montoTotal = montoTotal;
    this.esEfectivo = true;
  }

}
