import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
// Services
import {
  GlobalService, LocalStorageService,
  ProfesionalService, DocumentoService,
  ApplicationInsightsService
} from '../../../providers/';

@Component({
  selector: 'app-documento-list',
  templateUrl: './documento-list.page.html',
  styleUrls: ['./documento-list.page.scss'],
})
export class DocumentoListPage implements OnInit {

  documentos: any;
  usuario: any;

  constructor(
    private alertCtrl: AlertController,
    private appInsights: ApplicationInsightsService,
    private documentoService: DocumentoService,
    private lsServ: LocalStorageService,
    private navCtrl: NavController,
    private profesionalService: ProfesionalService,
    public globalServ: GlobalService,
  ) { }

  ngOnInit() { }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('documentos_list');

    // AQUI COMIENZA LA CARGA DE DATOS
    this.lsServ.getActiveUser().then((usuario: any) => {
      if (usuario && usuario.id) {
        this.usuario = usuario;
        this.globalServ.loadingCustom("Cargando documentos...", 9999);
        this.listarDocumentos();
      }
    });
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('documentos_list');
  }

  listarDocumentos() {
    if (this.globalServ.UsuarioTipo == 'profesional') {
      this.profesionalService.userDetail(this.usuario.id).subscribe((profesional: any) => {
        this.documentoService.list(profesional.data.id).subscribe((data: any) => {

          console.log("Datos de documento : ", data.data);
          this.documentos = data.data;
          this.globalServ.dismissLoader();
        });
      });
    } else {
      this.lsServ.getStoreData("preRegistro_documentos").then((documentos: any) => {
        if (documentos) this.documentos = documentos;
        this.globalServ.dismissLoader();
      });
    }
  }

  agregarDocumento() {
    this.globalServ.pageTransition();
    this.navCtrl.navigateForward('documento-add');
  }

  verDetalle() {
    this.globalServ.loadingCustom("Descargando documento...");
  }

  editar(item, indice) {
    if (this.globalServ.UsuarioTipo == 'profesional') {
      this.documentos.find(element => {
        if (element.id == item.id) {
          this.lsServ.setStoreData("documento", element);
        }
      });
    } else {
      item.indice = indice;
      this.lsServ.setStoreData("documento", item);
    }

    this.globalServ.pageTransition();
    this.navCtrl.navigateForward('documento-add');
  }

  async eliminar(item, index) {
    let aviso = await this.alertCtrl.create({
      header: 'Confirmar',
      mode: 'ios',
      message: '<h5>¿Desea eliminar este documento?</h5>',
      buttons: [
        {
          text: 'No',
          cssClass: 'buttonCancel',
          role: 'cancel',
          handler: (blah) => {
            console.info('Cancelado');
          }
        }, {
          text: 'Si',
          cssClass: 'buttonConfirm',
          handler: () => {
            this.documentoService.remove(item).subscribe((data: any) => {

              this.documentos.splice(index, 1);
              this.lsServ.deleteStoreData("preRegistro_documentos")
              this.lsServ.setStoreData("preRegistro_documentos", this.documentos);
              this.listarDocumentos();

            }, (err: any) => {

              let errorMsg = '<H5>' + err.error.message + '</H5>';
              this.presentAlert(errorMsg, "none");

            });

          }
        }
      ]
    });

    await aviso.present();
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
          console.info("Ok")
        }
      }]
    });

    await alert.present();
  }

}
