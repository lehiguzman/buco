import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { GlobalService, ArchivoPortafolioService, ApplicationInsightsService, LocalStorageService } from '../../../providers/';

@Component({
  selector: 'app-portafolio-add',
  templateUrl: './portafolio-add.page.html',
  styleUrls: ['./portafolio-add.page.scss'],
})
export class PortafolioAddPage implements OnInit {

  registroForm: FormGroup;
  habilitarTipoArc: boolean = false;
  tipoDoc: string;
  profesionalID: any;
  archivo_id: number;
  archivo: any;
  extension: string;
  tipoArchivoTexto: string = "Archivo";
  blockVideo: boolean = false;

  tipoArchivoActual: number;
  
  accion: string = "Registrar";

  constructor( private appInsights: ApplicationInsightsService,
               public globalServ: GlobalService,
               private navCtrl: NavController,
               private archivoPortafolioService: ArchivoPortafolioService,
               private lsServ: LocalStorageService,
               private formBuilder: FormBuilder ) { }

  ngOnInit() {
    
    this.lsServ.getStoreData("blockVideo").then( ( blockVideo: any ) => {
      console.log("block : ", blockVideo)    
      if( blockVideo ) this.blockVideo = blockVideo;  
    })    

    this.lsServ.getStoreData("archivo").then( ( archivo: any ) => {

      if( archivo ) {
        var tipoArchivo = archivo.tipoArchivo || archivo.tipo_archivo;

        this.registroForm.setValue({          
          nombre: archivo.nombre,
          tipo_archivo: String(tipoArchivo),
          ruta: '',
          archivo: ''
        });
        this.archivo_id = archivo.id;
        this.tipoArchivoActual = tipoArchivo;

        this.habilitarTipoArc = true;
        this.accion = "Actualizar";
        if( tipoArchivo == 1 ) { this.tipoDoc = "application/pdf"; this.tipoArchivoTexto = "Documento"; }
        if( tipoArchivo == 2 ) { this.tipoDoc = "image/png, image/jpeg";  this.tipoArchivoTexto = "Imagen";  }
        if( tipoArchivo == 3 ) { this.tipoDoc = "video/*"; this.tipoArchivoTexto = "Video"; }
      } else {
        this.accion = "Registrar";
      }
    });

    this.lsServ.getStoreData("profesionalID").then( ( profesionalID: any ) => {
      this.profesionalID = profesionalID;
    });

    this.registroForm = this.formBuilder.group({      
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      tipo_archivo: ['', [Validators.required]],
      ruta: ['', [Validators.required]],
      archivo: ['', [Validators.required]],

    });

  }

  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('portafolio_add');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('portafolio_add');        
  }

  verificarNombre( e: any ) {    

    if( e.target.value == "" ) {
      this.habilitarTipoArc = false;
    } else {
      this.habilitarTipoArc = true;
    }  
  }

  verificarTipo( e: any ) {    
    if( e.detail.value == 1 ) { this.tipoDoc = "application/pdf"; this.tipoArchivoTexto = "Documento"; }
    if( e.detail.value == 2 ) { this.tipoDoc = "image/png, image/jpeg";  this.tipoArchivoTexto = "Imagen";  }
    if( e.detail.value == 3 ) { this.tipoDoc = "video/*"; this.tipoArchivoTexto = "Video"; }
  }

  transformarArchivo(e: any) {
    var fileReader = new FileReader();
    var extension = e.target.files[0].name.split('.').pop().toLowerCase();
    
    this.extension = extension;

    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = () => {
      this.globalServ.loadingCustom("cargando...").then( () => {
        this.archivo = fileReader.result;
      });      
    }
  }

  registro() {
    console.log("Datos de formulario : ", this.registroForm.value);

    let form = this.registroForm.value;
    form.profesional = this.profesionalID;
    form.archivo = String(this.archivo);   
    form.extension = this.extension;

    if( this.accion == "Registrar" ) {

      if( !this.archivo ) {
        var mensaje = "Debe agregar un archivo";          
        this.globalServ.mensaje({ message: mensaje, color: 'warning', position: 'middle' });
        return false;   
      }  

      this.archivoPortafolioService.create( form ).subscribe( ( data: any ) => {      
        if( data.code == '201' ) {
          this.globalServ.mensaje({ message: data.message, color: 'success', position: 'middle' });
          this.lsServ.deleteStoreData("archivo");
          this.navCtrl.navigateForward('portafolio-list');
        }
      });  
    } else {
      console.log("Ruta : ", form.ruta);
      if( form.tipo_archivo != this.tipoArchivoActual ) {        
        if( !this.archivo ) {
          var mensaje = "Debe agregar un archivo";          
          this.globalServ.mensaje({ message: mensaje, color: 'warning', position: 'middle' });
          return false;   
        }       
      } 

      this.archivoPortafolioService.update( this.archivo_id, form ).subscribe( ( data: any ) => {          
        if( data.code == '200' ) {
          this.globalServ.mensaje({ message: data.message, color: 'success', position: 'middle' });
          this.lsServ.deleteStoreData("archivo");
          this.navCtrl.navigateForward('portafolio-list');
        }
      });  
    }    
  }

}
