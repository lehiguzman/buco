import { Component, OnInit } from '@angular/core';
import { NavController, Platform, MenuController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import {
  GlobalService, LocalStorageService,
  ProfesionalService,
  DireccionService,
  ClienteTarjetaService,
  OrdenServicioService,
  OrdenServicioProfesionalService,
  ApplicationInsightsService
} from '../../../providers/';
import * as moment from 'moment';

@Component({
  selector: 'app-orden-servicio-list',
  templateUrl: './orden-servicio-list.page.html',
  styleUrls: ['./orden-servicio-list.page.scss'],
})

export class OrdenServicioListPage implements OnInit {

  backUnable: any;
  column: string = 'nombre';
  direction: number = 1;
  foto: string;
  hayRegistros: boolean = false;
  ordenesServicio: any = [];
  ordenesServicioFiltrados: any = [];
  primerApellido: string;
  primerNombre: string;
  profesionalId: any = 0;
  role: any;
  sistemaTipo: number = 0;
  textoBuscar: string = '';
  tipoListado: string;
  userId: any;

  constructor(
    private appInsights: ApplicationInsightsService,
    private direccionService: DireccionService,
    private ls: LocalStorageService,
    private menuCtrl: MenuController,
    private tarjetasApi: ClienteTarjetaService,
    private navCtrl: NavController,
    private ordenServicioService: OrdenServicioService,
    private ordenServicioProfesionalService: OrdenServicioProfesionalService,
    private platform: Platform,
    private profesionalService: ProfesionalService,
    public globalServ: GlobalService,
  ) {
    this.menuCtrl.enable(true);
  }

  ngOnInit() { }
  ionViewWillEnter() {
    //console.clear();
    moment.locale('es');
    this.globalServ.loadingCustom();
    this.filtrarLista(0);
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('ordenservicio_list');
    this.backUnable = this.platform.backButton.subscribeWithPriority(9999, () => {
      this.navCtrl.navigateBack('home');
    });
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('ordenservicio_list');
    this.backUnable.unsubscribe();
    this.ordenesServicio = [];
  }

  async filtrarLista(lista: any) {
    this.ordenesServicio = [];
    this.ordenesServicioFiltrados = [];

    this.ls.getActiveUser().then((usuario: any) => {           

      console.log("Profesional : ", usuario.profesional);
      if (this.globalServ.UsuarioTipo === 'profesional' && (usuario.profesional && usuario.profesional.id)) {
        console.log("Lista de ordenes profesional");
        this.cargarMetodosPago();
        this.cargarDirecciones(usuario.id);
        this.listarOrdenesProfesional(usuario);
      }

      if (this.globalServ.UsuarioTipo === 'cliente') {
        console.log("Lista de ordenes cliente");
        this.listarOrdenesUsuario(usuario);
      }
    });
  }

  listarOrdenesProfesional(usuario) {
    this.globalServ.loadingCustom("Cargando Órdenes de Servicios...", 9999);
    this.userId = usuario.id;
    this.profesionalId = usuario.profesional.id;
    this.tipoListado = 'profesional';
    this.ordenesServicio = [];
    this.ordenesServicioFiltrados = [];

    this.ordenServicioService.list(this.profesionalId).subscribe((ordenes: any) => {
      this.globalServ.dismissLoader();
      console.log("Lista PROFESIONAL : ", ordenes);

      for (const orden in ordenes.data) {
        this.globalServ.dismissLoader();
        if (ordenes.data.hasOwnProperty(orden)) {
          const element = ordenes.data[orden];
                    
          //Extaer fecha y hora separados del campo fecha_hora
          let fecha = moment.parseZone(element.ordenServicio.fechaHora).format('DD/MM/YYYY');
          let hora = parseInt(moment.parseZone(element.ordenServicio.fechaHora).format('HH'));         

          //formato para mostrar en la vista
          let meridiano = hora >= 12 ? 'PM' : 'AM';
          let horaVista = hora > 12 ? hora - 12 : hora;

          this.ordenesServicio.push({
            id: element.ordenServicio.id,
            foto: element.profesional.user.foto,
            nombreCliente: element.ordenServicio.user.name,
            servicio: element.profesional.servicio.nombre,
            estatus: element.ordenServicio.estatus,
            estatusTexto: element.ordenServicio.estatusTexto,
            estatusProfesional: element.estatus,
            fechaHoraInicio: element.fechaHoraInicio,
            fecha: fecha,
            hora: horaVista,
            meridiano: meridiano
          });
        }
      }

      this.ordenesServicioFiltrados = this.ordenesServicio;
      if (this.ordenesServicioFiltrados.length == 0) {
        this.hayRegistros = false;
      } else {
        this.hayRegistros = true;
      }
    });
  }

  listarOrdenesUsuario(usuario) {
    this.globalServ.loadingCustom("Cargando Órdenes de Servicios...", 9999);
    this.userId = usuario.id;
    this.tipoListado = 'cliente';
    this.ordenesServicio = [];
    this.ordenesServicioFiltrados = [];

    this.ordenServicioService.listUser(this.userId).subscribe((ordenes: any) => {
      this.globalServ.dismissLoader();
      console.log("Ordenes CLIENTE : ", ordenes);

      var ods = ordenes.data.sort(function (a, b) {
        if (a.id < b.id) { return 1 }
        if (a.id > b.id) { return -1 }
        if (a.id == b.id) { return 0 }
      });

      for (const orden in ods) {
        if (ods.hasOwnProperty(orden)) {
          const element = ods[orden];
          const fechaHora = element.fechaHora ? element.fechaHora : element.fecha_hora;

          this.primerNombre = "";
          this.primerApellido = "";
          this.sistemaTipo = element.servicio.sistemaTipo;

          //if( this.sistemaTipo == 1 ) {
          this.cargarDatosProfesional(element.id);
          //}

          //Extaer fecha y hora separados del campo fecha_hora
          let fecha = moment.parseZone(fechaHora).format('DD/MM/YYYY');
          let hora = parseInt(moment.parseZone(fechaHora).format('HH'));

          //formato para mostrar en la vista
          let meridiano = hora >= 12 ? 'PM' : 'AM';
          let horaVista = hora > 12 ? hora - 12 : hora;

          console.log("Elemento : ", element);

          this.ordenesServicio.push({
            id: element.id,
            //foto: foto,
            //nombre: primerNombre,
            //apellido: primerApellido,
            servicio: element.servicio.nombre,
            estatus: element.estatus,
            cantidadProfesionales: element.cantidadProfesionales,
            rol_profesional: this.role,
            fecha: fecha,
            hora: horaVista,
            meridiano: meridiano
          });
        }
      }

      this.ordenesServicioFiltrados = this.ordenesServicio;
      if (this.ordenesServicioFiltrados.length == 0) {
        this.hayRegistros = false;
      } else {
        this.hayRegistros = true;
      }
    });
  }

  cargarDatosProfesional(id: any) {
    //Solo se toma el primer nombre y primer apellido para la vista          
    this.ordenServicioProfesionalService.listOrdenes(id).subscribe((data: any) => {
      console.log("Datos de profesionales: ", data.data[0].profesional);
      var profesional = data.data[0].profesional;
      this.profesionalId = profesional.id;
      this.primerNombre = profesional.nombre.split(' ')[0];
      this.primerApellido = profesional.apellido.split(' ')[0];
      this.foto = profesional.user.foto;
    });
  }

  cargarMetodosPago() {
    this.tarjetasApi.list().subscribe((metodosPago: any) => {
      this.ls.setStoreData("metodosPago", metodosPago);
    });
  }

  cargarDirecciones(userId: any) {
    this.direccionService.list(userId).subscribe((direcciones: any) => {
      console.log("Direcciones : ", direcciones);
      this.ls.setStoreData("direcciones", direcciones);
    });
  }

  irAFiltro() {
    this.globalServ.pageTransition();
    this.navCtrl.navigateForward('orden-servicio-filter');
  }

  detalle(id) {
    this.globalServ.loadingCustom();
    //console.log("Tipo de lista : ", this.tipoListado);
    console.log("Id de orden : ", id);

    let datosOrden: NavigationExtras = {
      queryParams: {
        id: id,
        profesionalId: this.profesionalId,
        tipoListado: this.tipoListado,
      }
    };
    this.globalServ.pageTransition();
    this.ordenesServicio = [];
    this.navCtrl.navigateForward('orden-servicio-detail', datosOrden);

  }

  buscarOrdenServicio(event) {
    this.textoBuscar = event.detail.value;

    this.ordenesServicioFiltrados = this.ordenesServicio.filter(item => {
      return item['servicio'].toLowerCase().
        includes(this.textoBuscar.toLowerCase());
    });

    if (this.ordenesServicioFiltrados.length == 0) {
      this.hayRegistros = false;
    } else {
      this.hayRegistros = true;
    }
  }

}
