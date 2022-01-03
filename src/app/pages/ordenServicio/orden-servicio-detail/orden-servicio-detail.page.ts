import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import {
  GlobalService, LocalStorageService,
  OrdenServicioService,
  OrdenServicioProfesionalService,
  ProfesionalTareaService,
  OrdenServicioTareaService,
  ServicioService,
  ApplicationInsightsService
} from '../../../providers';
import * as moment from 'moment';
import { OrdenServicioDirPage } from '../orden-servicio-dir/orden-servicio-dir.page';

@Component({
  selector: 'app-orden-servicio-detail',
  templateUrl: './orden-servicio-detail.page.html',
  styleUrls: ['./orden-servicio-detail.page.scss'],
})
export class OrdenServicioDetailPage implements OnInit {

  id: any;
  profesionalId: number;
  metodoPagoClienteId: any;
  hayTareas: any;
  ordenServicio: any = {
    id: 0,
    cantidadProfesionales: 0,
    nombre: '',
    apellido: '',
    estatus: 0,
    dia: '',
    mes: '',
    anio: '',
    hora: '',
    meridiano: '',
    direccion: '',
    longitud: '',
    latitud: '',
    monto: 0,
    porcentajeBackup: null,
    montoEfectivo: 0,
    metodoPago: '',
    metodoPagoId: 0,
    requiereVuelto: null,
    numeroTarjeta: null,
    servicio: '',
    sistemaTipo: 0,
    titulo: '',
    descripcion: '',
    observacion: '',
    telCliente: '',
    telProfesional: '',
    fotos: 0,
  };

  role: string;
  tipoListado: string;
  pinAzul: string = "assets/icons/locate-azul.png";

  tareas: any[] = [];
  tareasProfesional: any[] = [];
  tareasProfesionalFiltradas: any[] = [];
  profesionalesODS: any[] = [];
  tareasServicio: any;
  totalMonto: number;
  sistemaTipo: number;
  btnIniciar: boolean = false;
  estatusOrdenProfesional: number;
  fechaHoraActual: any;
  fechaHoraInicio: any;
  nombreProfesional: string;

  token: any;
  verTareasActualizar: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private appInsights: ApplicationInsightsService,
    private ls: LocalStorageService,
    private modalCtrl: ModalController,
    private ordenServicioProfesionalService: OrdenServicioProfesionalService,
    private ordenServicioService: OrdenServicioService,
    private ordesServicioTareaService: OrdenServicioTareaService,
    private profesionalTarea: ProfesionalTareaService,
    private servicioService: ServicioService,
    public alertCtrl: AlertController,
    public globalServ: GlobalService,
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.tipoListado = params['tipoListado'];
      this.profesionalId = params['profesionalId'];
    });
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('ordenservicio_detail');

    // cargar datos
    this.cargarProfesionales(this.id);
    this.obtenerOrdenServicio();
    this.listarTareas();
    this.obtenerRol();
    this.obtenerTelefonosClienteAfiliado();
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('ordenservicio_detail');
  }

  async abrirModal() {
    const modal = await this.modalCtrl.create({
      component: OrdenServicioDirPage,
      componentProps: {
        longitud: this.ordenServicio.longitud,
        latitud: this.ordenServicio.latitud,
        direccion: this.ordenServicio.direccion
      }
    });
    await modal.present();
  }

  listarTareas() {
    this.totalMonto = 0;
    this.tareas = [];

    this.ordesServicioTareaService.list(this.id).subscribe((respuesta: any) => {
      this.globalServ.dismissLoader();
      for (const tarea in respuesta.data) {
        if (respuesta.data.hasOwnProperty(tarea)) {
          const element = respuesta.data[tarea];
          this.tareas.push({
            id: element.id,
            nombre: element.tarea.nombre,
            monto: element.monto * element.cantidad,
            cantidad: element.cantidad,
            estatus: element.estatus
          });
          this.totalMonto += (element.monto * element.cantidad);
        }
      }
    });
  }

  async cargarTareas() {

    this.tareasServicio.forEach(element => {
      var tarea = element;
      var tareaExiste = 0;
      var precioTarea = 0;

      this.profesionalesODS.forEach(pro => {

        if (pro.tarea.id == tarea.id) {
          tareaExiste++;
          precioTarea += pro.precio;
        }

        if (tareaExiste == this.ordenServicio.cantidadProfesionales) {
          tareaExiste = 0;
          this.tareasProfesional.push({
            id: pro.tarea.id,
            isChecked: false,
            nombre: pro.tarea.nombre,
            cantidad: 1,
            descripcion: pro.tarea.descripcion,
            precio: precioTarea,
            totalPrecio: precioTarea
          });
        }
      });
    });
  }

  actualizaMonto(e: any, i) {
    if (e.target.value < 1) return false;

    this.tareasProfesional[i].cantidad = e.target.value;
    this.tareasProfesional[i].totalPrecio = this.tareasProfesional[i].precio * e.target.value;
  }

  async agregarTarea() {

    this.verTareasActualizar = !this.verTareasActualizar;

  }

  async guardarTareas() {
    await this.tareasProfesional.forEach(element => {

      console.log("datos de profesional : ", element);

      if (element.isChecked) {

        let tareasObj = {
          orden_servicio_id: this.id,
          tarea_id: element.id,
          cantidad: element.cantidad
        }

        this.ordesServicioTareaService.create(tareasObj).subscribe((respuesta: any) => {
          alertTarea.present();
        }, (err: any) => {
          console.error(err.error.message);
          let errorMsg = '<H5>' + err.error.message + '</H5>';
          this.presentAlert(errorMsg, "none");
        });
      }
    });

    const alertTarea = await this.alertCtrl.create({
      header: "Actualizado",
      message: "<h5>Tareas agregadas exitosamente</h5>",
      mode: "ios",
      buttons: [
        {
          text: 'Cancel',
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
            this.tareas = [];
            this.globalServ.loadingCustom('actualizando orden de servicio...');
            this.obtenerOrdenServicio();
            this.listarTareas();
          }
        }
      ]
    });
  }

  obtenerRol() {
    this.ls.getActiveUser().then((usuario: any) => {
      this.role = usuario.roles[0];
    });
  }

  obtenerOrdenServicio() {
    this.globalServ.loadingCustom("Cargado Información...", 99999);

    this.ordenServicioService.detail(this.id).subscribe((resp: any) => {
      this.globalServ.dismissLoader();
      console.log("Datos de ODS : ", resp.data);
      if (resp.status == 200 || resp.code == 200) {
        this.ordenServicio = { ...this.ordenServicio, ...resp.data };
        this.metodoPagoClienteId = this.ordenServicio.clienteTarjeta;
      }
      var fechaHora = resp.data.fecha_hora || resp.data.fechaHora;

      var dia: any = moment.parseZone(fechaHora).format('DD');
      var mes: any = moment.parseZone(fechaHora).format('MMMM');
      var anio: any = moment.parseZone(fechaHora).format('YYYY');
      var hora: any = moment.parseZone(fechaHora).format('HH:mm');
      var horaCompleta: any = moment.parseZone(fechaHora).format('HH:mm');

      var meridiano = parseInt(hora) >= 12 ? 'PM' : 'AM';

      this.ordenServicio.id = resp.data.id;

      this.cargarTareasServicio(resp.data.servicio.id);

      //if( ordenServicio.data.servicio.sistemaTipo == 1 ) {
      this.buscarDatosProfesional(this.ordenServicio.id);
      //}       

      //this.ordenServicio.profesional_id = ordenServicio.data.profesional.id;
      this.sistemaTipo = resp.data.servicio.sistemaTipo;

      //if( this.tipoListado == 'cliente' ) {
      //this.cargarTareas(this.ordenServicio.id);
      //} else {
      this.ordenServicio.nombre = resp.data.user.name;
      //} 

      this.ordenServicio.estatus = resp.data.estatus;
      //si estatus es 4 (iniciada) validar cuanto falta para que se cumpla la hora de la orden para mostrar boton de iniciar orden
      if (this.ordenServicio.estatus == 2 || this.ordenServicio.estatus == 4) {
        var actual = moment(new Date());
        this.fechaHoraActual = actual;
        var diff = moment.duration(actual.diff(fechaHora));
        var diffRound = Math.round(diff.asMinutes());

        console.log("Diferencia de minutos : ", diffRound);
        if (diffRound > -15 && diffRound < 15) {
          this.btnIniciar = true;
        }
      }

      this.ordenServicio.titulo = resp.data.titulo;
      this.ordenServicio.dia = dia;
      this.ordenServicio.mes = mes;
      this.ordenServicio.anio = anio;
      this.ordenServicio.hora = horaCompleta;
      this.ordenServicio.meridiano = meridiano;
      this.ordenServicio.direccion = resp.data.direccion;
      this.ordenServicio.latitud = resp.data.latitud;
      this.ordenServicio.longitud = resp.data.longitud;
      this.ordenServicio.monto = resp.data.monto;
      this.ordenServicio.porcentajeBackup = resp.data.porcentajeBackup;
      this.ordenServicio.montoEfectivo = resp.data.montoEfectivo;
      this.ordenServicio.metodoPago = resp.data.metodoPago.nombre;
      this.ordenServicio.metodoPagoId = resp.data.metodoPago.id;
      this.ordenServicio.requiereVuelto = resp.data.metodoPago.requiereVuelto;
      this.ordenServicio.servicio = resp.data.servicio.nombre;
      this.ordenServicio.sistemaTipo = resp.data.servicio.sistemaTipo;
      this.ordenServicio.descripcion = resp.data.descripcion;
      this.ordenServicio.observacion = resp.data.observacion;
      this.ordenServicio.cantidadProfesionales = resp.data.cantidadProfesionales;

      this.ordenServicioService.listFotos(resp.data.id).subscribe((data: any) => {
        this.ordenServicio.fotos = data.data.length;
      });
    });
  }

  cargarProfesionales(ordenId: number) {
    this.ordenServicioProfesionalService.list(ordenId).subscribe((data: any) => {
      console.log("Datos Profesionales : ", data.data);
      var profesionales = data.data;
      this.cargarTareasProfesionales(profesionales);
    });
  }

  cargarTareasProfesionales(profesionales: any) {
    profesionales.forEach(element => {
      this.profesionalTarea.list(element.profesional.id).subscribe((data: any) => {
        var profesionalTarea = data.data;
        console.log("Profesional tarea : ", profesionalTarea);
        profesionalTarea.forEach(element => {
          this.profesionalesODS.push(element);
        });
      });
    });
  }

  cargarTareasServicio(servicioId: number) {
    this.servicioService.getTareas(servicioId).subscribe((data: any) => {
      var tareasServicio = data.data;
      this.tareasServicio = tareasServicio;
      this.cargarTareas();
    });
  }

  buscarDatosProfesional(ordenId: any) {
    console.log("Buscar datos de profesional : ", ordenId);
    this.ordenServicioProfesionalService.detail(ordenId).subscribe((data: any) => {
      var profesionales = data.data;
      const ODSprofesional = profesionales.find(element => element.profesional.id == this.profesionalId);
      if (ODSprofesional) {
        this.estatusOrdenProfesional = ODSprofesional.profesional.estatus;
        this.fechaHoraInicio = ODSprofesional.fechaHoraInicio;
        if (this.tipoListado == 'cliente') {
          this.nombreProfesional = ODSprofesional.profesional.nombreCompleto;
        }
      }
    });
  }

  /**
   * números de teléfono del contacto (Cliente/Afiliado/Profesional)
   **/
  obtenerTelefonosClienteAfiliado() {
    this.ordenServicioService.telefonos(this.id).subscribe((resTlfs: any) => {
      if (resTlfs.status == 200 || resTlfs.code == 200) {
        const clienteTlfs = resTlfs.data.cliente;
        const profesionalTlfs = resTlfs.data.profesional;
        this.ordenServicio.telCliente = clienteTlfs['tel1'] || clienteTlfs['tel2'];
        this.ordenServicio.telProfesional = profesionalTlfs['tel1'] || profesionalTlfs['tel2'];
      }
    });
  }

  llamarCliente() {
    document.getElementById("llamarCliente").click();
  }
  llamarProfesional() {
    document.getElementById("llamarProfesional").click();
  }

  ubicarDireccion() {
    this.ls.setStoreData("ordenServicioDetalle", this.ordenServicio);
    this.navCtrl.navigateForward('orden-servicio-map');
  }

  seleccionarProfesionales(estatus) {

    this.ls.setStoreData("idOds", this.id);
    this.ls.setStoreData("servicio", this.ordenServicio.servicio);
    this.globalServ.pageTransition();
    this.navCtrl.navigateForward("orden-servicio-select");
  }

  confirmar(estatus) {

    var profesional: any[] = [];

    //if( this.sistemaTipo == 2 ) {
    profesional.push({
      profesional_id: Number(this.profesionalId),
      estatus: '1',
      fechaHoraInicio: null
    });

    console.log("objeto profesional :  ", profesional);

    var data = {
      profesionales: profesional
    }

    this.ordenServicioProfesionalService.update(this.ordenServicio.id, data).subscribe((data: any) => {
      console.log("Data : ", data);

      if (data.code == 201) {
        this.globalServ.mensaje({ message: data.message, color: 'success', position: 'middle' });
        this.navCtrl.navigateForward("orden-servicio-list");
      } else {
        this.globalServ.mensaje({ message: data.error, color: 'danger', position: 'middle' });
      }
    });
    /*} else {
      let estatusOrden = {
        estatus: estatus
      }

      this.ordenServicioService.update(this.ordenServicio.id, estatusOrden).subscribe((res: any) => {
        if (res.data && res.data.estatus === 2) {
          this.ordenServicio.estatus = 2;
          this.globalServ.mensaje({ message: "¡Orden Confirmada con exito!" });
          this.obtenerOrdenServicio();          
        } else if (res.messsage) {
          this.globalServ.mensaje({ message: res.message });
        }
      }, (err: any) => {
        console.error('error de validacion', err.status);
      });
    }  */
  }

  iniciar() {

    var profesional: any[] = [];
    var fechaHoraInicio = moment(this.fechaHoraActual).format("YYYY-MM-DD HH:mm");

    //console.log("Formato de fecha inicio : ", fechaHoraInicio);

    profesional.push({
      profesional_id: Number(this.profesionalId),
      estatus: '1',
      fechaHoraInicio: fechaHoraInicio//Fecha y hora de inicio de orden por parte del profesional
    });

    var data = {
      profesionales: profesional
    }

    this.ordenServicioProfesionalService.update(this.ordenServicio.id, data).subscribe((data: any) => {
      if (data.code == 201) {
        this.globalServ.mensaje({ message: data.message, color: 'success', position: 'middle' });
        this.navCtrl.navigateForward("orden-servicio-list");
      } else {
        this.globalServ.mensaje({ message: data.error, color: 'danger', position: 'middle' });
      }
    }, (err: any) => {
      console.error('error de validacion', err.status);
    });
  }

  rechazar(estatus) {
    let estatusOrden = {
      estatus: estatus
    }

    this.ordenServicioService.update(this.ordenServicio.id, estatusOrden).subscribe((res: any) => {
      if (res.data && res.data.estatus === 3) {
        this.ordenServicio.estatus = 3;
        this.globalServ.mensaje({ message: "¡Orden Rechazada con exito!" });
        this.obtenerOrdenServicio();
      } else if (res.messsage) {
        this.globalServ.mensaje({ message: res.message });
      }
    }, (err: any) => {
      console.error('error de validacion', err.status);
    });
  }

  calificar() {
    var datosCalificacion = {
      ordenServicio_id: this.ordenServicio.id,
    }
    this.ls.setStoreData("datosCalificacion", datosCalificacion)
    this.navCtrl.navigateForward('calificacion');
  }

  finalizarOrden(estatus) {
    let estatusOrden = {
      estatus: estatus
    }
    this.ordenServicioService.update(this.ordenServicio.id, estatusOrden).subscribe((res: any) => {
      if (res.data && res.data.estatus === 7) {
        this.ordenServicio.estatus = 7;
        this.globalServ.mensaje({ message: "¡Orden Finalizada con exito!" });
        this.obtenerOrdenServicio();
      } else if (res.messsage) {
        this.globalServ.mensaje({ message: res.message });
      }
      console.log("Orden Finalizada");
    }, (err: any) => {
      console.error('error de validacion', err.status);
    });
  }

  //Metodo provisional
  pagar() {
    console.log("Datos de ODS : ", this.ordenServicio);

    var datosOds = {
      ordenId: this.ordenServicio.id,
      profesionalId: this.profesionalId,
      tareas: this.tareas
    }

    this.ls.setStoreData("datosOds", datosOds);

    this.globalServ.pageTransition();
    this.navCtrl.navigateForward('servicio-pago-detalle');
  }
  /////////////////////////////

  actualizarTarea(estatus) {
    const estatusObj = {
      rechazar: estatus
    }
    const tareasXActualizar = this.tareas.filter(tarea => tarea.estatus == 2);

    console.log("Tareas a actualizar : ", tareasXActualizar);
    let header = "";

    var cantidadTareas = tareasXActualizar.length;
    var contadorTareas = 0;

    for (const tarea in tareasXActualizar) {

      if (tareasXActualizar.hasOwnProperty(tarea)) {
        const element = tareasXActualizar[tarea];

        this.ordesServicioTareaService.update(element.id, estatusObj).subscribe((data: any) => {
          if (data.code == 200) {
            contadorTareas++;
            if (cantidadTareas == contadorTareas) {
              let msg = "<h5>" + data.message + "</h5>";
              this.presentAlert(header, msg);
            }
          }
        });
      }
    }
  }

  async cancelar(estatus: any) {
    let estatusOrden = {
      estatus: estatus
    };

    if (estatus == 0) {
      var msg = "<h5>¿Está seguro de cancelar la orden de Servicio?</h5>";
      var respuesta = '¡Orden Cancelada con exito!';
    } else {
      var msg = "<h5>¿Está seguro de rechazar la orden de Servicio?</h5>";
      var respuesta = '¡Orden Rechazada con exito!';
    }

    let aviso = await this.alertCtrl.create({
      header: 'Cancelar',
      mode: 'ios',
      message: msg,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'buttonOk',
          handler: (blah) => { }
        }, {
          text: 'Si',
          cssClass: 'buttonOk',
          handler: () => {
            this.globalServ.loadingCustom("Cancelando...", 5555);
            this.ordenServicioService.update(this.ordenServicio.id, estatusOrden).subscribe((res: any) => {
              if (res.data && res.data.estatus === estatusOrden.estatus) {
                this.ordenServicio.estatus = estatusOrden.estatus;
                this.globalServ.mensaje({ message: respuesta });
                this.obtenerOrdenServicio();
              } else if (res.messsage) {
                this.globalServ.mensaje({ message: res.message });
              }
            }, (err: any) => { console.error('error de validacion', err) });
          }
        }
      ]
    });

    await aviso.present();
  }

  async presentAlert(header: string, msg: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      mode: 'ios',
      message: msg,
      cssClass: 'alertText',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'buttonOk',
          handler: (blah) => {
            this.globalServ.pageTransition();
            this.navCtrl.navigateForward('orden-servicio-list');
          }
        }
      ]
    });

    await alert.present();
  }

  verFotos() {
    this.ls.setStoreData("ordenServicioDetalle", this.ordenServicio);
    this.navCtrl.navigateForward('orden-servicio-img');
  }

  irAtras() {
    this.globalServ.pageTransition();
  }
}
