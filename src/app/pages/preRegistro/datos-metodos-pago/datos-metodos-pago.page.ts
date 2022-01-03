import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

//Services
import {
  GlobalService, MetodoPagoService, LocalStorageService, ProfesionalPreRegistroService
} from '../../../providers/';

@Component({
  selector: 'app-datos-metodos-pago',
  templateUrl: './datos-metodos-pago.page.html',
  styleUrls: ['./datos-metodos-pago.page.scss'],
})
export class DatosMetodosPagoPage implements OnInit {

  servicioID: number;
  metodosPago: any;
  servicio: any = {
    nombre: "",
    descripcion: ""
  };

  constructor(
    private lsServ: LocalStorageService,
    private metodosPgoService: MetodoPagoService,
    private navCtrl: NavController,
    private preRegistroApi: ProfesionalPreRegistroService,
    public globalServ: GlobalService,
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.lsServ.getStoreData("preRegistro_servicioPostular").then((servicio: any) => {
      this.servicio = { ...this.servicio, ...servicio };
      console.log("Servicio : ", this.servicio);
      this.servicioID = servicio.id;
      this.globalServ.loadingCustom("Cargando Información...", 9999);

      this.metodosPgoService.list().subscribe((data: any) => {
        console.log("Metodos de pago : ", data);

        this.metodosPago = data.data;
        this.globalServ.dismissLoader();
      });
    });
  }

  registrarMetodos() {
    console.log("Metodos de pago : ", this.metodosPago);

    this.globalServ.loadingCustom("Guardando Información...", 9999);
    let datos: any = this.metodosPago.filter(item => item.isChecked);

    console.log("Metodos de pago seleccionados : ", datos);

    this.preRegistroApi.create({ metodosPago: datos, servicioID: this.servicioID }).subscribe(() => {
      this.globalServ.dismissLoader();
      this.lsServ.setStoreData("preRegistro_metodosPago", datos)
        .then(() => this.navCtrl.navigateForward("preregistro-home"));
    });
  }

}
