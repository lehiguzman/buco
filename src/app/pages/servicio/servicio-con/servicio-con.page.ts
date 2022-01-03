import { Component, OnInit } from '@angular/core';
import { NavigationExtras, ActivatedRoute } from '@angular/router';
import {
  GlobalService,
  LocalStorageService,
  ProfesionalService,
  //ProfesionalTareaService,
  MetodoPagoService,
  ClienteTarjetaService,
  OrdenServicioService,
  OrdenServicioTareaService,
  ApplicationInsightsService
} from '../../../providers';
import { NavController, AlertController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/';
import { Base64 } from '@ionic-native/base64';
import * as moment from 'moment';

@Component({
  selector: 'app-servicio-con',
  templateUrl: './servicio-con.page.html',
  styleUrls: ['./servicio-con.page.scss'],
})
export class ServicioConPage implements OnInit {

  profesionalesODS: any[] = [];
  profesionalesArray: any[] = [];
  cantidadProfesionales: number = 1;
  porcentajeBackup: number = null;
  titulo: string;
  userId: any;
  longitud: any;
  latitud: any;
  direccion: any;
  pagoLinea: any;
  metodoPagoId: any;
  metodoPagoClienteId: any;
  dia: any;
  mes: any;
  anio: any;
  fecha: any;
  hora: any;
  descripcion: any;
  observacion: any;
  tareasOrden: any;
  tareas: any[] = [];
  montoTotal: any = 0;
  montoEfectivo: Number = 0;
  idSistema: number;

  mesLetra: any;
  servicioId: any;

  metodoPago: any;

  public profesional = {
    id: '',
    nombre: '',
    apellido: '',
    destreza: '',
    distancia: '',
    servicio: ''
  }

  horaVista: any;
  meridiano: any;

  arrayImg: any[] = [];
  profesionales: any[] = [];

  private objOrdenServicio = {
    user_id: null,
    servicio_id: null,
    //profesional_id: null,    
    profesionales: null,
    fechaHora: '',
    metodoPago_id: null,
    clienteTarjeta: null,
    monto: null,
    porcentajeBackup: null,
    montoEfectivo: null,
    latitud: '',
    longitud: '',
    titulo: '',
    direccion: '',
    estatus: null,
    descripcion: '',
    observacion: '',
    cantidadProfesionales: 1,
    file: null,
    tareas: []
  }

  constructor(
    //private profesionalTareaService: ProfesionalTareaService,
    private alertCtrl: AlertController,
    private appInsights: ApplicationInsightsService,
    private base64: Base64,
    private filePath: FilePath,
    private globalService: GlobalService,
    private ls: LocalStorageService,
    private metodoPagoService: MetodoPagoService,
    private navCtrl: NavController,
    private ordenServicioService: OrdenServicioService,
    private ordenServicioTareaService: OrdenServicioTareaService,
    private profesionalService: ProfesionalService,
    private tarjetaApi: ClienteTarjetaService,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

    moment.locale('es');

    this.globalService.loadingCustom();

    this.ls.getStoreData("idSistema").then((idSistema: any) => {
      console.log("Id sistema : ", idSistema);
      this.idSistema = idSistema;
    });

    this.ls.getStoreData("imagenes").then((imagenes: any) => {
      imagenes.forEach(element => {
        //console.log("Datos de imagen : ", element);
        this.filePath.resolveNativePath(element).then((nativePath) => {
          this.base64.encodeFile(nativePath).then((base64) => {
            //this.imagen3 = base64;
            this.arrayImg.push(base64);
          })
        });
      });
    });

    this.ls.getStoreData("ods").then((ods: any) => {
      console.log("Datos de ODS : ", ods);
      this.profesionalesODS = ods.profesionalesODS;

      this.profesionalesODS.forEach(element => this.profesionalesArray.push(element.id));

      this.cantidadProfesionales = ods.cantidadProfesionales;
      this.porcentajeBackup = ods.porcentajeBackup;
      this.titulo = ods.titulo;
      this.longitud = ods.longitud;
      this.latitud = ods.latitud;
      this.direccion = ods.direccion;
      this.pagoLinea = ods.pagoLinea;
      this.metodoPagoId = ods.metodoPagoId;
      this.metodoPagoClienteId = ods.metodoPagoClienteId;
      this.montoEfectivo = ods.montoEfectivo;
      this.dia = ods.dia;
      this.mes = ods.mes;
      this.anio = ods.anio;
      this.hora = ods.hora;
      this.descripcion = ods.descripcion;
      this.tareas = ods.tareas;

      this.tareas.forEach(element => {
        this.montoTotal += element.totalPrecio;
      });

      this.mesLetra = moment(this.mes).format('MMMM');

      this.horaSelect();
      this.obtenerUsuario();
      this.obtenerProfesional();
      //this.obtenerTareas();      

      if (this.pagoLinea) {
        this.obtenerMetodoPagoCliente();
      } else {
        this.obtenerMetodoPago();
      }
    });
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('servicio_con');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('servicio_con');
  }

  obtenerUsuario() {
    this.ls.getActiveUser().then((usuario: any) => {
      this.userId = usuario.id;
    });
  }

  obtenerProfesional() {
    console.log("Profesional : ", this.profesionalesODS);
    this.profesionalService.detail(this.profesionalesODS[0].id).subscribe((profesional: any) => {
      this.profesional.nombre = profesional.data.nombre;
      this.profesional.apellido = profesional.data.apellido;
      this.profesional.servicio = profesional.data.servicio.nombre;
      this.servicioId = profesional.data.servicio.id;
      this.globalService.dismissLoader();
    });
  }

  obtenerMetodoPago() {
    console.log("Id de metood de pago : ", this.metodoPagoId);
    this.metodoPagoService.detail(this.metodoPagoId).subscribe((metodoPago: any) => {
      console.log("Meotodo de Pago : ", metodoPago.data);
      this.metodoPago = metodoPago.data.nombre;
    });
  }

  obtenerMetodoPagoCliente() {
    this.tarjetaApi.detail(this.metodoPagoClienteId).subscribe((resp: any) => {
      this.metodoPago = resp.data.numero;
    });
  }

  horaSelect() {

    var hora: any = moment(this.hora, 'HH').format('HH');
    var minutos: any = moment(this.hora, 'mm').format('mm');

    console.log("Hora : ", hora);
    console.log("Minutos : ", minutos);

    this.horaVista = this.hora;
    this.meridiano = hora >= 12 ? 'PM' : 'AM';
  }

  guardarTareas(ordenId: number) {

    var tareasRegistradas = 0;

    this.tareas.forEach(element => {
      let tareasObj = {
        orden_servicio_id: ordenId,
        tarea_id: element.id,
        cantidad: element.cantidad,
      }

      this.ordenServicioTareaService.create(tareasObj).subscribe((respuesta: any) => {

        tareasRegistradas++;

        if (respuesta.code == 201) {
          console.log("Tarea Agregada", respuesta);
        }

        if (tareasRegistradas == this.tareas.length) {
          this.globalService.pageTransition();
          this.navCtrl.navigateForward("orden-servicio-list");
        }

      }, (err: any) => {
        console.error(err.error.message);
      });
    });
  }

  confirmarOrden() {

    let fechaFormateada = new Date(this.anio, this.mes - 1, this.dia);
    let fecha = moment(fechaFormateada).format('YYYY-MM-DD');

    let fechaHora = fecha + " " + this.hora;
    console.log("profesionales : ", this.profesionalesArray);

    this.objOrdenServicio = {
      user_id: this.userId,
      servicio_id: this.servicioId,
      profesionales: this.profesionalesArray,
      porcentajeBackup: this.porcentajeBackup,
      fechaHora: fechaHora,
      metodoPago_id: this.metodoPagoId,
      clienteTarjeta: this.metodoPagoClienteId,
      latitud: this.latitud,
      longitud: this.longitud,
      titulo: this.titulo,
      direccion: this.direccion,
      estatus: 1,
      monto: this.montoTotal,
      montoEfectivo: this.montoEfectivo,
      descripcion: this.descripcion,
      observacion: this.observacion,
      cantidadProfesionales: this.cantidadProfesionales,
      file: this.arrayImg,
      tareas: this.tareas
    }
    this.ordenServicioService.create(this.objOrdenServicio).subscribe((respuesta: any) => {

      if (respuesta.code == 201) {
        this.globalService.mensaje({ message: respuesta.message, color: 'success', position: 'middle' });
        this.ls.deleteStoreData("ods");
        this.guardarTareas(respuesta.data.id);
      }
    }, (err: any) => {
      console.log("Error : ", err.message);
    });
    console.log("Datos de orden de servicio : ", this.objOrdenServicio);
  }

  irAtras() {
    this.globalService.pageTransition();
  }
}
