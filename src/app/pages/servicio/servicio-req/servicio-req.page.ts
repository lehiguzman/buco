import { Component, OnInit } from '@angular/core';
import { NavController, IonSlides, AlertController } from '@ionic/angular';
import { NavigationExtras, ActivatedRoute } from '@angular/router';
import { GlobalService, 
         LocalStorageService, 
         ProfesionalService, 
         OrdenServicioProfesionalService,
         ApplicationInsightsService } from '../../../providers';

import * as moment from 'moment';

@Component({
  selector: 'app-servicio-req',
  templateUrl: './servicio-req.page.html',
  styleUrls: ['./servicio-req.page.scss'],
})

export class ServicioReqPage implements OnInit {

  slideOpts = {
    slidesPerView: 8,
  };

  meses: any = [];
  mes: any;
  diaInicial: any;
  inicioMes: any;
  diaFinal: any;
  finMes: any;
  dia: any;
  dias: any[] = [];
  diaActual: string;
  mesActual: number;
  mesSiguiente: number;

  diaSeleccion: any;
  mesSeleccion: any;
  anioSeleccion: any;

  hora: any = 0;
  horaVista: any = '00';
  horaActual: string = null;  
  horaCompleta: string = null;

  meridiano: any = 'AM';
  titulo: string;
  descripcion: any;

  idSistema: number;

  currentIndex: any;
  aprobado: boolean = false;

  longitud: any;
  latitud: any;
  direccion: any;
  profesionalesODS: any[] = [];
  cantidadProfesionales: number = 1;
  porcentajeBackup: number = null;
  pagoLinea: any;
  metodoPagoId: any;
  metodoPagoClienteId: any;
  tareas: any;
  montoEfectivo: any;

  profesional = {
    id: 0,
    nombre: '',
    apellido: '',
    foto: '',
    servicio: ''
  }

  constructor(public activatedRoute: ActivatedRoute,
              private globalService: GlobalService,
              private appInsights: ApplicationInsightsService,
              private ls: LocalStorageService,
              private profesionalService: ProfesionalService,
              private ordenServicioProfesionalService: OrdenServicioProfesionalService,
              private navCtrl: NavController,
              private alertCtrl: AlertController) { }

  ngOnInit() {

    console.clear();
    moment.locale('es');   
    this.horaActual = moment().format('LT');
    this.globalService.loadingCustom();
    this.slideOpts;

    this.ls.getStoreData("idSistema").then((idSistema: any) => {
      console.log("Id sistema : ", idSistema);
      this.idSistema = idSistema;      
    });

    this.ls.getStoreData("ods").then( ( ods: any ) => {

      console.log("Datos de ODS : ", ods);
      this.longitud = ods.longitud;
      this.latitud = ods.latitud;
      this.direccion = ods.direccion;
      this.profesionalesODS = ods.profesionalesODS;
      this.cantidadProfesionales = ods.cantidadProfesionales;
      this.porcentajeBackup = ods.porcentajeBackup;
      this.pagoLinea = ods.pagoLinea;
      this.metodoPagoId = ods.metodoPagoId;
      this.metodoPagoClienteId = ods.metodoPagoClienteId;
      this.montoEfectivo = ods.montoEfectivo,
      this.tareas = ods.tareas;

      this.obtenerProfesional();
      this.cargarMeses();
    });    
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('servicio_req');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('servicio_req');
  } 

  obtenerProfesional() {    
    this.profesionalService.detail( this.profesionalesODS[0].id ).subscribe((profesional: any) => {
      console.log("Profesional : ", profesional);
      let cortarNombre = profesional.data.nombre.split(' ');
      let primerNombre = cortarNombre[0];

      let cortarApellido = profesional.data.apellido.split(' ');
      let primerApellido = cortarApellido[0];

      this.profesional.id = profesional.data.id;
      this.profesional.nombre = primerNombre;
      this.profesional.apellido = primerApellido;
      this.profesional.foto = profesional.data.user.foto;
      this.profesional.servicio = profesional.data.servicio.nombre;

      this.globalService.dismissLoader();

    });    
  }

  cargarMeses() {    
    
    for (let index = 0; index < 12; index++) {
      this.mes = new Date(2021, index);
      this.meses[index] = moment(this.mes).format('MMMM');
    }
  }

  slidesDidLoad(slider: IonSlides) {   
    
    var mesActual = Number(moment().format('M')) - 1;     
    
    slider.slideTo(mesActual); 
    this.asignarDias(slider);
  }

  slides2DidLoad(slider2: IonSlides) {
    this.diaActual = moment().format('DD');    
    this.seleccionarDia(this.diaActual);
    slider2.slideTo(Number(this.diaActual)-4);    
  }

  horaSelect(e: any) {      
    
    const fechaFormateada = new Date(this.anioSeleccion, this.mesActual, this.diaSeleccion);
    const fechaSolicitud = moment(fechaFormateada).format('YYYY-MM-DD');

    this.horaCompleta = e.target.value;     
    
    this.hora = moment(e.target.value, 'HH').format('HH');        

    const fechaDesde = fechaSolicitud + ' ' +(Number(this.hora)-1) + ':00';
    const fechaHasta = fechaSolicitud + ' ' +(Number(this.hora)+1) + ':00';

    console.log("Fecha desde : ", fechaDesde );
    console.log("Fecha hasta : ", fechaHasta );

    this.ordenServicioProfesionalService
      .listOrdenesRangoFecha( this.profesional.id, fechaDesde, fechaHasta)
      .subscribe( (data: any) => {
        
        const respuesta = data.data;
        if( respuesta ) {
          this.aprobado = false;
          const msg = 'El afiliado ' + respuesta.profesional.nombreCompleto + 
                      ' no esta disponible en: <br> <b> Fecha </b>' + fechaSolicitud + '<br> <b> Hora: </b> ' + this.horaCompleta + 
                      ' ' + this.meridiano + ' <br> Te invitamos a solicitar su servicio en otra fecha u hora';
          
          this.presentAlert(msg, 'none');          
        } else {
          this.aprobado = true;
        }
      } );
    
    this.horaVista = this.hora > 12 ? this.hora - 12 : this.hora;    

    this.meridiano = this.hora >= 12 ? 'PM' : 'AM';
  }

  asignarDias(slider: IonSlides) {

    this.dias = [];

    slider.getActiveIndex().then((index: number) => {

      this.mesActual = index;      

      const anio = moment().format('YYYY');

      //indice de dia incicial del mes, es el seleccionado en el slide de meses        
      this.inicioMes = new Date(Number(anio), this.mesActual, 1);
      this.diaInicial = this.inicioMes.getDate();

      //indice de dia final del mes, se busca el dia 0 del mes siguiente
      this.mesSiguiente = this.mesActual + 1;
      this.finMes = new Date(Number(anio), this.mesSiguiente, 0);
      this.diaFinal = this.finMes.getDate();

      this.anioSeleccion = moment(this.inicioMes).format('YYYY');
      this.mesSeleccion = moment(this.inicioMes).format('MM');

      for (let index = 1; index <= this.diaFinal; index++) {

        this.dia = new Date(Number(anio), this.mesActual, index);       

        this.dias.push({
          numeroDia: moment(this.dia).format('DD'),
          dia: moment(this.dia).format('ddd')          
        });
      }
    });
  }

  seleccionarDia(numeroDia) {      
    this.diaSeleccion = numeroDia;
  }

  slidePrev(slider: IonSlides) {
    slider.slidePrev();
    this.asignarDias(slider)
  }
  slideNext(slider: IonSlides) {
    slider.slideNext();
    this.asignarDias(slider)
  }

  irAConfirmacion() {
      
    let fechaFormateada = new Date(this.anioSeleccion, this.mesActual, this.diaSeleccion, this.hora);
    let fechaSolicitud = moment(fechaFormateada).format('YYYY-MM-DD');
    let fechaActual = moment().format('YYYY-MM-DD');
    let horaSolicitud = moment(fechaFormateada).format('HH');
    let horaActual = moment().format('HH');

    console.log("Fecha formateada : ", )

    if (!this.diaSeleccion) {
      let msg = "<h5>Debe seleccionar un día</h5>";
      this.presentAlert(msg, 'none');
      return false;
    }

    if (this.hora == 0) {
      let msg = "<h5>Debe seleccionar hora</h5>";
      this.presentAlert(msg, 'none');
      return false;
    }       

    if (fechaSolicitud == fechaActual && horaActual >= horaSolicitud) {

      let msg = "<h5>La hora de solicitud es menor a la hora actual</h5>";
      this.presentAlert(msg, 'none');
      return false;

    }

    if (fechaSolicitud < fechaActual) {
      let msg = "<h5>La fecha de solicitud es menor a la fecha actual</h5>";
      this.presentAlert(msg, 'none');
    }

    if(this.idSistema == 2 && !this.titulo) {

      let msg = "<h5>Debe indicar titulo de la Orden</h5>";      
      this.presentAlert(msg, 'none');
      return false;

    }

    if (fechaSolicitud >= fechaActual) {

      var ods = {
          longitud: this.longitud,
          latitud: this.latitud,
          direccion: this.direccion,
          profesionalesODS: this.profesionalesODS,
          cantidadProfesionales: this.cantidadProfesionales,
          porcentajeBackup: this.porcentajeBackup,
          titulo: this.titulo,
          mes: this.mesSeleccion,
          anio: this.anioSeleccion,
          dia: this.diaSeleccion,
          hora: this.horaCompleta,
          pagoLinea: this.pagoLinea,
          metodoPagoId: this.metodoPagoId,
          metodoPagoClienteId: this.metodoPagoClienteId,
          montoEfectivo: this.montoEfectivo,
          descripcion: this.descripcion,
          tareas: this.tareas
        }        
      
      this.ls.setStoreData("ods", ods);

      this.globalService.pageTransition();
      //this.navCtrl.navigateForward( 'servicio-con' );
      this.navCtrl.navigateForward( 'servicio-foto' );

    }
  }

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
              this.globalService.pageTransition();
              this.navCtrl.navigateForward([ruta]);
            }
          })
        }
      }]
    });

    await alert.present();
  }

  irAtras() {
    this.globalService.pageTransition();
  }

}
