import { Component, OnInit } from '@angular/core';

import { LocalStorageService, GlobalService } from '../../../providers';
import { NavController } from '@ionic/angular';

import { Camera, CameraOptions } from "@ionic-native/camera";

@Component({
  selector: 'app-servicio-foto',
  templateUrl: './servicio-foto.page.html',
  styleUrls: ['./servicio-foto.page.scss'],
})
export class ServicioFotoPage implements OnInit {

  public foto: string = "assets/icons/Outline.png";
  public foto1: string = "assets/icons/Outline.png";
  public foto2: string = "assets/icons/Outline.png";
  public foto3: string = "assets/icons/Outline.png";

  public fotos: any[] = [];
  private imagenes: any[] = [];

  constructor( private ls: LocalStorageService,
               private camera: Camera, 
               private navCtrl: NavController,
               private globalService: GlobalService ) { }

  ngOnInit() {

    this.ls.getStoreData("ods").then( ( ods: any ) => {
      console.log("Datos de ods : ", ods );
    });   

  }

  tomarFoto() {

    const options: CameraOptions = {
      quality: 40,
      targetWidth: 480,
      targetHeight: 480,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    
    this.camera.getPicture(options).then( (ImageData) => {
        console.log(ImageData)
      //this.mifoto1 = `data:image/jpg;base64,${ImageData}`;     
      //this.imagen1 = ImageData;

      var img = (<any>window).Ionic.WebView.convertFileSrc(ImageData); 

      this.fotos.push(img);      
      this.imagenes.push(ImageData);

      },    
      (error) => {
        this.globalService.mensaje({ message: error, color: 'danger', position: 'middle' } );
        console.error(error);        
      }
    );
  }

  quitarFoto( indice: number ) {
    this.fotos.splice( indice, 1);
    this.imagenes.splice( indice, 1);
  }

  continuar() {

    this.ls.setStoreData("imagenes", this.imagenes);

    this.globalService.pageTransition();
    this.navCtrl.navigateForward('servicio-con');
  }
}
