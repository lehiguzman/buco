import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader';

import { GlobalService,
         LocalStorageService,
         ApplicationInsightsService,
         ArchivoPortafolioService,
         ProfesionalService } from '../../../providers/';

import { File } from '@ionic-native/file';
import * as moment from 'moment';

@Component({
  selector: 'app-portafolio-detalle',
  templateUrl: './portafolio-detalle.page.html',
  styleUrls: ['./portafolio-detalle.page.scss'],
})
export class PortafolioDetallePage implements OnInit {

  archivo = {
    id: 0,
    nombre: '',
    fechaCreacion: '',
    tipoArchivo: 0, 
    ruta: ''
  }
  directorio: any;
  nombreArchivo: string;

  constructor( public globalServ: GlobalService,
               private appInsights: ApplicationInsightsService,               
               private archivoPortafolioService: ArchivoPortafolioService,
               private downloader: Downloader,
               private navCtrl: NavController,
               private alertCtrl: AlertController,
               private lsServ: LocalStorageService ) { }

  ngOnInit() {  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('portafolio_detalle');
    this.lsServ.getStoreData("archivo").then( ( archivo: any ) => {
      console.log("Archivo : ", archivo);
      var fechaCreacion = archivo.fechaCreacion | archivo.fecha_creacion;

      this.archivo.id = archivo.id;
      this.archivo.nombre = archivo.nombre;
      this.archivo.fechaCreacion = moment(fechaCreacion).format('DD-MM-YYYY');
      this.archivo.tipoArchivo = archivo.tipoArchivo;
      this.archivo.ruta = archivo.ruta;

      const ruta          = this.archivo.ruta;    
      const ruta_dividida = ruta.split('.');
      const extension     = ruta_dividida.pop();
      this.nombreArchivo  = this.archivo.nombre+'.'+extension;

    });  
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('portafolio_detalle');     
  }

  editar() {
    console.log("Editar");
  
    this.globalServ.pageTransition();
    this.navCtrl.navigateForward('portafolio-add');
  }

  async eliminar(item) {
    console.log("Eliminar : ", item);
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
            this.archivoPortafolioService.remove(item).subscribe( ( data: any ) => {
              console.log("Data : ", data);
              if( data.code == 200 ) {
                var msg = "Registro eliminado con exito";
                this.globalServ.mensaje({ message: msg, color: 'success', position: 'middle' });
                this.lsServ.deleteStoreData("archivo");
                this.navCtrl.navigateForward('portafolio-list');
              }        
            });
          }
        }
      ]
    });

    await aviso.present();
  }

  descargarArchivo() {   
    
    console.log("Archivo : ", this.nombreArchivo);

    const request: DownloadRequest = {
      uri: this.archivo.ruta,
      title: this.nombreArchivo,
      description: 'Fecha Creacion : '+ this.archivo.fechaCreacion,
      mimeType: '',
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
        dirType: 'downloads',
        subPath: this.nombreArchivo
      }
    };

    this.downloader.download(request).then( (location: string) => {
      const mensaje = "Archivo descargado en : "+ location;
      this.globalServ.mensaje({ message: mensaje });
    }).catch((error: any) => this.globalServ.mensaje({ message: error }));
  }  

  irAtras() {
    console.log("Atras");
  }

}
