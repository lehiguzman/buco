import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
// Services
import {
  GlobalService, LocalStorageService,
  ServicioTipoDocumentoService,
  ProfesionalPreRegistroService,
  ApplicationInsightsService
} from '../../../providers';
import * as moment from 'moment';

@Component({
  selector: 'app-preregistro-home',
  templateUrl: './preregistro-home.page.html',
  styleUrls: ['./preregistro-home.page.scss'],
})
export class PreRegistroHomePage implements OnInit {

  checkDatosBasicos: boolean = false;
  checkDatosEspecificos: boolean = false;
  checkMetodosPago: boolean = false;
  checkDireccion: boolean = false;
  checkDocumentos: boolean = false;
  checkTareasTarifas: boolean = false;
  ocultaLista: boolean = true;
  ocultaOpciones: boolean = true;
  resultados: any[] = [];
  serviciosTiposDoc: any[] = [];
  textoServicio: any;
  alertaMensaje = "Por favor llene primero el formulario de datos básicos.";
  alertaMensaje2 = "El Pre-Registro ya esta completado. Por favor espere por la Aprobación del Administrador.";
  estado: number = 0;

  constructor(
    private appInsights: ApplicationInsightsService,
    private lsServ: LocalStorageService,
    private navCtrl: NavController,
    private preRegistroApi: ProfesionalPreRegistroService,
    private servicioTipoDocumentoService: ServicioTipoDocumentoService,
    public globalServ: GlobalService,
  ) { }

  ngOnInit() {
    //console.clear();

    this.globalServ.loadingCustom("Cargando Información...", 9999);
    this.listarServicios();

    // cargar información desde el servidor
    this.preRegistroApi.detail().subscribe((resp: any) => {
      console.log("Datos de preregistro : ", resp.data);
      if (resp.code === 200 || resp.status === 200) {
        this.globalServ.dismissLoader();
        const preRegistro: any = resp.data;
        if (preRegistro) {
          this.estado = preRegistro.estado;
          this.checkDatosBasicos = false;
          this.checkDatosEspecificos = false;
          this.checkDireccion = false;
          this.checkTareasTarifas = false;
          this.checkDocumentos = false;
          this.globalServ.mensaje({
            message: `El estado actual de su Pre-Registro es "${preRegistro.estadoTexto}".`,
            position: "top", color: "light"
          });

          if (preRegistro.servicio) {
            const servicioPostular = preRegistro.servicio;
            this.lsServ.setStoreData("preRegistro_servicioPostular", servicioPostular)
              .then(() => {
                this.textoServicio = servicioPostular.nombre;
                this.ocultaOpciones = false;
              });
          }

          const fechaNacimiento = moment(preRegistro.fechaNacimiento).format("YYYY-MM-DD");
          let datosBasicos: any = {
            nombre: preRegistro.nombreCompleto || null,
            genero: preRegistro.genero === 'femenino' ? 1 : 2,
            fechaNacimiento: moment(fechaNacimiento).isValid() ? fechaNacimiento : null,
            identificacion: preRegistro.cedula || null,
            nacionalidad: preRegistro.nacionalidad || null,
            celular: preRegistro.tlfCelular || null,
            email: preRegistro.correo || null,
            radioCobertura: preRegistro.areaCobertura || null,
            aniosExperiencia: preRegistro.aniosExperiencia || null,
            auto: preRegistro.vehiculo === 'si' ? "1" : "2",
            ctaTwitter: preRegistro.redesSociales['tw'] || null,
            ctaFacebook: preRegistro.redesSociales['fb'] || null,
            ctaLinkedin: preRegistro.redesSociales['in'] || null,
            ctaInstagram: preRegistro.redesSociales['ig'] || null,
            destrezaDetalle: preRegistro.especialidad || null,
          };
          this.lsServ.setStoreData("preRegistro_datosBasicos", datosBasicos)
            .then(() => { this.checkDatosBasicos = true });

          if (preRegistro.camposEspecificos && Object.keys(preRegistro.camposEspecificos)) {
            let camposEspecificos: any = [];
            const claveCampEsp = Object.keys(preRegistro.camposEspecificos);
            const campEspTemp = Object.values(preRegistro.camposEspecificos);
            campEspTemp.forEach((element: any, i) => {
              camposEspecificos.push({ ...element, ...{ clave: claveCampEsp[i] } });
            });
            this.lsServ.setStoreData("preRegistro_datosEspecificos", camposEspecificos)
              .then(() => this.checkDatosEspecificos = true);
          } else {
            this.lsServ.setStoreData("preRegistro_datosEspecificos", null);
          }

          if (preRegistro.direccion) {
            const direccionID = preRegistro.direccion.id;
            this.lsServ.setStoreData("preRegistro_direccionID", direccionID)
              .then(() => { this.checkDireccion = true });
          }

          if (preRegistro.tareasTarifas && (Array.isArray(preRegistro.tareasTarifas) && preRegistro.tareasTarifas.length > 0)) {
            this.lsServ.setStoreData("preRegistro_tareasTarifas", preRegistro.tareasTarifas)
              .then(() => this.checkTareasTarifas = true);
          } else {
            this.lsServ.setStoreData("preRegistro_tareasTarifas", null);
          }

          if (preRegistro.documentos && (Array.isArray(preRegistro.documentos) && preRegistro.documentos.length > 0)) {
            this.lsServ.setStoreData("preRegistro_documentos", preRegistro.documentos)
              .then(() => this.checkDocumentos = true);
          } else {
            this.lsServ.setStoreData("preRegistro_documentos", null);
          }
        } else {
          this.globalServ.mensaje({
            message: `No se ha encontrado un Pre-Registro. Por favor indique un Servicio y/o ingrese la información solicitada.`,
            position: "top", color: "light", duration: 6666
          });
        }
      }
    });
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('preregistro_home');
    this.lsServ.setStoreData("esPreregistro", false);

    this.checkDatosBasicos = false;
    this.checkDatosEspecificos = false;
    this.checkDireccion = false;
    this.checkTareasTarifas = false;
    this.checkDocumentos = false;

    let p0 = this.lsServ.getStoreData("preRegistro_servicioPostular");
    let p1 = this.lsServ.getStoreData("preRegistro_datosBasicos");
    let p2 = this.lsServ.getStoreData("preRegistro_datosEspecificos");
    let p3 = this.lsServ.getStoreData("preRegistro_metodosPago");    
    let p4 = this.lsServ.getStoreData("preRegistro_direccionID");
    let p5 = this.lsServ.getStoreData("preRegistro_tareasTarifas");
    let p6 = this.lsServ.getStoreData("preRegistro_documentos");    
    Promise.all([p0, p1, p2, p3, p4, p5, p6]).then((values: any) => {
      console.log("storage preRegistro", values)
      const formDatosBasicos = values[1];
      const formDatosEspecificos = values[2];
      const formMetodosPago = values[3];
      const formDireccion = values[4];
      const formTareasTarifas = values[5];
      const formDocumentos = values[6];
      this.ocultaOpciones = true;
      if (values[0]) {
        this.textoServicio = values[0].nombre;
        this.ocultaOpciones = false;
      }
      if (formDatosBasicos) {
        this.checkDatosBasicos = true;
      }
      if (formDatosEspecificos && Object.keys(formDatosEspecificos)) {
        this.checkDatosEspecificos = true;
      }
      if (formMetodosPago) {
        this.checkMetodosPago = true;
      }
      if (formDireccion) {
        this.checkDireccion = true;
      }
      if ((Array.isArray(formTareasTarifas) && formTareasTarifas.length > 0)) {
        this.checkTareasTarifas = true;
      }
      if ((Array.isArray(formDocumentos) && formDocumentos.length > 0)) {
        this.checkDocumentos = true;
      }
    });
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('preregistro_home');
  }

  buscarServicio(e: any) {
    this.ocultaLista = false;
    this.resultados = [];
    this.textoServicio = e.target.value;

    if (this.textoServicio == "") {
      this.ocultaLista = true;
      this.ocultaOpciones = true;
    } else {
      this.resultados = this.serviciosTiposDoc.filter(servicioTipoDoc => servicioTipoDoc.servicio.nombre.toLowerCase().search(this.textoServicio.toLowerCase()) > -1);
    }
  }

  listarServicios() {
    this.servicioTipoDocumentoService.listAll().subscribe((serviciosTiposDoc: any) => {
      console.log("Servicios : ", serviciosTiposDoc);
      this.serviciosTiposDoc = serviciosTiposDoc.data;
    });
  }

  seleccionaServicio(servicio: any) {
    this.lsServ.setStoreData("preRegistro_servicioPostular", servicio);
    this.ocultaLista = true;
    this.ocultaOpciones = false;
    this.resultados = [];
    this.textoServicio = servicio.nombre;
  }

  irADatosBasicos() {
    if (this.estado == 2) {
      this.globalServ.mensaje({ message: this.alertaMensaje2 })
    } else {
      this.navCtrl.navigateForward('preregistro-datosbasicos');
    }
  }

  irADatosEspecificos() {
    if (this.estado == 2) {
      this.globalServ.mensaje({ message: this.alertaMensaje2 })
    } else if (this.checkDatosBasicos) {
      this.navCtrl.navigateForward('preregistro-datosespecificos');
    } else {
      this.globalServ.mensaje({ message: this.alertaMensaje })
    }
  }

  irAMetodosPago() {
    if (this.estado == 2) {
      this.globalServ.mensaje({ message: this.alertaMensaje2 })
    } else if (this.checkDatosBasicos) {
      this.lsServ.setStoreData("esPreregistro", true).then(() => this.navCtrl.navigateForward('datos-metodos-pago'));
    } else {
      this.globalServ.mensaje({ message: this.alertaMensaje })
    }
  }

  irADirecciones() {
    if (this.estado == 2) {
      this.globalServ.mensaje({ message: this.alertaMensaje2 })
    } else if (this.checkDatosBasicos) {
      this.lsServ.setStoreData("esPreregistro", true).then(() => this.navCtrl.navigateForward('direcciones'));
    } else {
      this.globalServ.mensaje({ message: this.alertaMensaje })
    }
  }

  irATareasTarifas() {
    if (this.estado == 2) {
      this.globalServ.mensaje({ message: this.alertaMensaje2 })
    } else if (this.checkDatosBasicos) {
      this.navCtrl.navigateForward('preregistro-datostareastarifas');
    } else {
      this.globalServ.mensaje({ message: this.alertaMensaje })
    }
  }

  irADocumentos() {
    if (this.estado == 2) {
      this.globalServ.mensaje({ message: this.alertaMensaje2 })
    } else if (this.checkDatosBasicos) {
      this.lsServ.setStoreData("esPreregistro", true).then(() => this.navCtrl.navigateForward('documento-list'));
    } else {
      this.globalServ.mensaje({ message: this.alertaMensaje })
    }
  }
}
