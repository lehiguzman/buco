import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
// Services
import {
  GlobalService, LocalStorageService, ApplicationInsightsService,
  DocumentoService, ProfesionalService, ServicioTipoDocumentoService,
  ProfesionalPreRegistroService
} from '../../../providers/';

@Component({
  selector: 'app-documento-add',
  templateUrl: './documento-add.page.html',
  styleUrls: ['./documento-add.page.scss'],
})
export class DocumentoAddPage implements OnInit {

  registroForm: FormGroup;
  nombre: string;
  tipoDoc: string;
  ruta: string;
  usuario: any;
  returnPath: string;
  nativePath: any;
  tipos: any[] = [];
  token: any;
  editarDocumento: boolean = false;

  documentoId: 0;
  archivo: any;
  nombreArchivo: string;
  documentos: any[] = [];
  indice: number;

  constructor(
    private appInsights: ApplicationInsightsService,
    private documentoService: DocumentoService,
    private formBuilder: FormBuilder,
    private lsServ: LocalStorageService,
    private navCtrl: NavController,
    private preRegistroApi: ProfesionalPreRegistroService,
    private profesionalService: ProfesionalService,
    private servicioTipoDocumentoService: ServicioTipoDocumentoService,
    public globalServ: GlobalService,
  ) { }

  ngOnInit() {
    this.lsServ.getStoreData("usuario").then((usuario: any) => {
      console.log("Datos de usuario : ", usuario);
      this.usuario = usuario.data;
      this.listarTipoDoc();
    });

    this.lsServ.getStoreData("documento").then((documento: any) => {      
      if (documento && this.globalServ.UsuarioTipo == 'profesional') {
        this.editarDocumento = true;
        this.documentoId = documento.id;
        this.registroForm.setValue({
          nombre: documento.nombre,
          tipo_documento: documento.tipoDocumento.id.toString(),
          ruta: '',
          archivo: ''
        });
      } else if (documento && this.globalServ.UsuarioTipo == 'cliente') {
        this.editarDocumento = true;
        this.indice = documento.indice;
        this.registroForm.setValue({
          nombre: documento.nombre,
          tipo_documento: documento.tipo_documento,
          ruta: '',
          archivo: ''
        });
      }
    });

    this.registroForm = this.formBuilder.group({

      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      tipo_documento: ['', [Validators.required]],
      ruta: ['', [Validators.required]],
      archivo: ['', [Validators.required]],

    });

  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('documentos_add');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('documentos_add');
    this.registroForm.reset();
  }

  listarTipoDoc() {
    if (this.globalServ.UsuarioTipo == 'profesional') {
      this.profesionalService.userDetail(this.usuario.id).subscribe((profesional: any) => {
        let servicioId = profesional.data.servicio.id
        this.servicioTipoDocumentoService.list(servicioId).subscribe((tipo: any) => {
          this.tipos = tipo.data;
        }, (err: any) => {
          console.error("Error : ", err.error.message);
        });
      });
    } else {
      this.lsServ.getStoreData("preRegistro_servicioPostular").then((servicio: any) => {
        if (servicio) {
          this.servicioTipoDocumentoService.list(servicio.id).subscribe((tipo: any) => {
            this.tipos = tipo.data;
          });
        }
      });
    }
  }

  registro() {
    let form = this.registroForm.value;
    form.archivo = String(this.archivo);
    form.nombre = this.nombreArchivo;

    if (this.globalServ.UsuarioTipo == 'profesional') {
      this.profesionalService.userDetail(this.usuario.id).subscribe((profesional: any) => {

        form.profesional = profesional.data.id;

        this.documentoService.create(form).subscribe((respuesta: any) => {
          if (respuesta.code == 201) {
            this.globalServ.mensaje({ message: message, color: 'success', position: 'middle' });
            this.navCtrl.navigateForward("documento-list");
          }
        }, (err: any) => {
          console.error("Error : ", err.error.message);
          //this.presentAlert(err.error.message, "");
        });
      });
    } else {
      var message = "Información almacenada"
      this.documentos.push(form);
      this.globalServ.loadingCustom("Guardando Documento...", 9999);

      console.log("Documento : ", this.documentos);
      this.lsServ.getStoreData("preRegistro_servicioPostular").then((servicio: any) => {
        if (servicio) {
          this.preRegistroApi.create({ documentos: this.documentos, servicioID: servicio.id }).subscribe((resp: any) => {
            console.log("Lsita de documentos guardados : ", resp.data.documentos);
            this.lsServ.setStoreData("preRegistro_documentos", resp.data.documentos).then(() => {
              this.globalServ.mensaje({ message: message, color: 'success', position: 'middle' });
              this.globalServ.dismissLoader();
              this.navCtrl.navigateForward("preregistro-home");
            });
          });
        }
      });
    }
  }

  transformarArchivo(e: any) {       

    this.nombreArchivo = e.target.files[0].name;

    var fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = () => {
      this.archivo = fileReader.result;
    }
  }

  editar() {
    let form = this.registroForm.value;
    form.nombre = this.nombreArchivo;
    form.archivo = String(this.archivo);

    if (this.globalServ.UsuarioTipo == 'profesional') {
      this.documentoService.update(this.documentoId, form).subscribe((respuesta: any) => {
        this.globalServ.mensaje({ message: respuesta.message, color: 'success', position: 'middle' });
        this.lsServ.deleteStoreData("documento");
        this.navCtrl.navigateForward("documento-list");
      });
    } else {
      this.documentos.splice(this.indice, 1);
      this.documentos.push(form);
      this.lsServ.setStoreData("preRegistro_documentos", this.documentos);
      this.navCtrl.navigateForward("documento-list");
    }
  }
}
