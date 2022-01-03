import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

import { GlobalService, LocalStorageService, ApplicationInsightsService, ArchivoPortafolioService, ProfesionalService } from '../../../providers/';

@Component({
  selector: 'app-portafolio-list',
  templateUrl: './portafolio-list.page.html',
  styleUrls: ['./portafolio-list.page.scss'],
})
export class PortafolioListPage implements OnInit {
 
  archivos: any[] = []; 
  habilitarRegistro: boolean = true;
  blockVideo: boolean = false;
  profesionalID: number;

  constructor( public globalServ: GlobalService,
               private appInsights: ApplicationInsightsService,
               private profesionalService: ProfesionalService,
               private navCtrl: NavController,
               private alertCtrl: AlertController,
               private lsServ: LocalStorageService,
               private archivoPortafolioService: ArchivoPortafolioService ) { }

  ngOnInit() { }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('portafolio_list');    
    this.listarArchivos();
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('portafolio_list');    
  }

  listarArchivos() {
    console.log("detalle nuevo");

    this.lsServ.getActiveUser().then( ( usuario: any ) => {
      this.profesionalService.userDetail( usuario.id ).subscribe((profesional: any) => {
        
        var profesional = profesional.data;                
        this.lsServ.setStoreData("profesionalID", profesional.id);
        this.archivoPortafolioService.detail( profesional.id ).subscribe( ( data: any ) => {      
          
          var archivos = data.data;
          this.archivos = archivos;

          var cantidadArchivos = archivos.length;
          
          if( cantidadArchivos < 9 ) {            
            this.habilitarRegistro = true;
          } else {
            this.habilitarRegistro = false;
          }
          var archivosVideo = this.archivos.filter( element => element.tipoArchivo == 3 );          
          if( archivosVideo.length >= 3 ) {
            this.blockVideo = true;            
          } else {
            this.blockVideo = false;
          }
          this.lsServ.setStoreData("blockVideo", this.blockVideo);
        });
      });
    });
  }

  agregarArchivo() {
    console.log("Bloquear videos : ", this.blockVideo);    
    this.globalServ.pageTransition();
    this.navCtrl.navigateForward('portafolio-add');
  }

  verDetalle(item) {
    this.lsServ.setStoreData("archivo", item);
    this.navCtrl.navigateForward('portafolio-detalle');
  }

  editar(item) {    
   
    var archivo = this.archivos.filter( element => element.id == item.id);
    
    this.lsServ.setStoreData("archivo", archivo[0]);  
    this.globalServ.pageTransition();
    this.navCtrl.navigateForward('portafolio-add');
  }

  async eliminar(item) {
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
                this.listarArchivos();
              }        
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
