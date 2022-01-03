import { Component, OnInit } from '@angular/core';

import { GlobalService, LocalStorageService, OrdenServicioProfesionalService } from '../../../providers';

import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-orden-servicio-select',
  templateUrl: './orden-servicio-select.page.html',
  styleUrls: ['./orden-servicio-select.page.scss'],
})
export class OrdenServicioSelectPage implements OnInit {

  idOds: number;
  servicio: string;
  profesionales: any[] = [];
  check: any;  

  constructor( private globalService: GlobalService,
               private ls: LocalStorageService, 
               private navCtrl: NavController,
               private alertCtrl: AlertController,
               private ordenServicioProfesionalService: OrdenServicioProfesionalService ) { }

  ngOnInit() {

    this.ls.getStoreData("idOds").then( ( idOds: any ) => {
      console.log("odsId select : ", idOds);

      this.idOds = idOds;

      this.ordenServicioProfesionalService.list( idOds ).subscribe( (data: any) => {        
        var odsprofesionales = data.data;    
        
        odsprofesionales.forEach(element => {
          
          if( element.estatus == 1 ) {
            var profesional = { 
              orden_servicio_id: element.ordenServicio.id,
              profesional_id: element.profesional.id,
              foto: element.profesional.foto,
              nombre: element.profesional.nombre,
              apellido: element.profesional.apellido,
              fechaHoraInicio: null,
              estatus: 0
            }

            this.profesionales.push(profesional);
          }
        });

        console.log("profesional : ", this.profesionales);
      })
    });

    this.ls.getStoreData("servicio").then( ( servicio: any ) => {
      this.servicio = servicio;
    })
  }

  confirmarSeleccion() {

    var profesionalPrincipal = this.profesionales.filter( element => element.estatus == 2 );    

    if( profesionalPrincipal.length == 0 ) {
      var msg = "<h5>Debe seleccionar al menos 1 profesional principal</h5>";
      this.presentAlert(msg);
      return false;
    }

    var profesionalNoSeleccionado = this.profesionales.filter( element => element.estatus == null );    
    
    if( profesionalNoSeleccionado.length > 0 ) {
      var msg = "<h5>Debe asignar un valor a todos los profesionales</h5>";
      this.presentAlert(msg);
      return false;
    }

    var data = {
      profesionales: this.profesionales
    }

    this.ordenServicioProfesionalService.update( this.idOds, data).subscribe( ( data: any ) => {
      console.log("Data : ", data);

      if(data.code == 201) {
        this.globalService.mensaje({ message: data.message, color: 'success', position: 'middle' });
        this.ls.deleteStoreData("idOds");
        this.navCtrl.navigateForward("orden-servicio-list");
      }
    });
  }

  irAtras() {
    this.globalService.pageTransition();
  }

  async presentAlert(msg: any) {
    const alert = await this.alertCtrl.create({
      //header: '',  
      mode: 'ios',
      message: msg,
      buttons: [{
        text: 'OK',
        cssClass: 'buttonOk',
        handler: () => {
          alert.dismiss().then(() => {                       
            console.log("dismissed");           
          })
        }
      }]
    });
    await alert.present();
  }

}
