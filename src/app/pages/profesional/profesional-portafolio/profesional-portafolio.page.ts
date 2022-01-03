import { Component, OnInit } from '@angular/core';

import { GlobalService, ApplicationInsightsService, LocalStorageService } from '../../../providers';

import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader';

import * as moment from 'moment';

@Component({
  selector: 'app-profesional-portafolio',
  templateUrl: './profesional-portafolio.page.html',
  styleUrls: ['./profesional-portafolio.page.scss'],
})
export class ProfesionalPortafolioPage implements OnInit {

  profesional: any = [];
  portafolio: any = [];
  archivos: any[] = [];
  nombreArchivo: string;

  constructor( private globalService: GlobalService, 
               private ls: LocalStorageService, 
               private downloader: Downloader,
               private appInsights: ApplicationInsightsService ) { }

  ngOnInit() {
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('profesional_list');
    this.ls.getStoreData("profesional").then( ( profesional: any ) => {     
      console.log("Profesional portafoilo : ", profesional);
      this.profesional = {
        nombre: profesional.nombre,
        apellido: profesional.apellido,
        foto: profesional.foto,
        servicio: profesional.servicio
      }
      
      profesional.portafolio.forEach(element => {
        const fechaCreacion = moment(element.fechaCreacion).format('DD-MM-YYYY');

        const ruta          = element.ruta;    
        const ruta_dividida = ruta.split('.');
        const extension     = ruta_dividida.pop();
        this.nombreArchivo  = element.nombre+'.'+extension;

        this.portafolio.push({
          id: element.id,
          nombre: this.nombreArchivo,
          ruta: element.ruta,
          tipoArchivoTexto: element.tipoArchivoTexto,
          tipoArchivo: element.tipoArchivo,
          fechaCreacion: fechaCreacion
        });
      });      
            
      function comparar ( a, b ){ return a.tipoArchivo - b.tipoArchivo; }
        this.portafolio.sort( comparar ); 

      console.log("Portafolio :", this.portafolio);
      
    });
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('profesional_list');
  } 

  descargarArchivo(archivo) {   
    
    console.log("Archivo : ", archivo);

    const request: DownloadRequest = {
      uri: archivo.ruta,
      title: archivo.nombre,
      description: 'Fecha Creacion : '+ archivo.fechaCreacion,
      mimeType: '',
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
        dirType: 'downloads',
        subPath: archivo.nombre
      }
    };

    this.downloader.download(request).then( (location: string) => {
      const mensaje = "Archivo descargado en : "+ location;
      this.globalService.mensaje({ message: mensaje });
    }).catch((error: any) => this.globalService.mensaje({ message: error }));
  }  


  irAtras() {    
    this.globalService.pageTransition();
  }

}
