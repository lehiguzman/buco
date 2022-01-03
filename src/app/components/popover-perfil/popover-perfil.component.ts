import { Component, OnInit, Input } from '@angular/core';

import { NavController, PopoverController } from '@ionic/angular';

import { LocalStorageService, GlobalService } from '../../providers/';

@Component({
  selector: 'app-popover-perfil',
  templateUrl: './popover-perfil.component.html',
  styleUrls: ['./popover-perfil.component.scss'],
})
export class PopoverPerfilComponent implements OnInit {

  @Input() profesional;
  @Input() email;

  constructor( private navCtrl: NavController,
               public globalServ: GlobalService,
               private popoverCtrl: PopoverController,
               private ls: LocalStorageService ) { }

  ngOnInit() { }

  irADatosBasicos() {

    const urlDatos = ( this.globalServ.UsuarioTipo == 'profesional' ) ? 'preregistro-datosbasicos' : 'perfil-edit';
    
    this.ls.setStoreData("profesional", this.profesional);
    this.navCtrl.navigateForward( urlDatos );
    this.popoverCtrl.dismiss();
  }

  irASolicitud() {    

    if ( this.email ) {
      this.ls.setStoreData("emailSolicitud", this.email);
      this.navCtrl.navigateForward( "solicitar" );
    } else {
      const msg = "El usuario no cuenta con correo electronico registrado";
      this.globalServ.mensaje({mensaje: msg, color: 'warning', position: 'middle' });
    }
    
    this.popoverCtrl.dismiss();
  }  

  irAServicios() {       
      console.log("Servicios");
    this.ls.setStoreData("profesional", this.profesional);
    this.navCtrl.navigateForward( "perfil-servicios" );    
    this.popoverCtrl.dismiss();
    
  }  
}
