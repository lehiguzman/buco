import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { NavController, AlertController } from '@ionic/angular';

import { GlobalService, 
         LocalStorageService, 
         ProfesionalService, 
         FavoritoService, 
         ProfesionalTareaService,          
         ApplicationInsightsService } from '../../../providers';

@Component({
  selector: 'app-profesional-detail',
  templateUrl: './profesional-detail.page.html',
  styleUrls: ['./profesional-detail.page.scss'],
})
export class ProfesionalDetailPage implements OnInit {

  id: any;
  ubicacion: any;

  profesional = {
    id: '',
    nombre: '',
    apellido: '',
    foto: '',
    destreza: '',
    distancia: 0,
    servicio: '',
    odsFinalizadas: 0,
    tareas: [],
    tarifaMinima: 0,
    aniosExperiencia: 0
  }
  profesionalesODS: any[] = [];

  favoritoObj = {
    user: '',
    profesional: ''
  }

  favorito: boolean = false;
  favoritoId: number;

  tareas: any[] = [];
  tareasSel: any = [];
  totalPrecio: number = 0; 
  tarifaMinima: number;
  //ordenesfinalizadas: number = 0;
  idSistema: number;
  cantidadProfesionales: number = 1;
  porcentajeBackup: number = null;

  constructor(private activatedRoute: ActivatedRoute,
    private appInsights: ApplicationInsightsService,
    private globalService: GlobalService,
    private profesionalService: ProfesionalService,
    private profesionalTareaService: ProfesionalTareaService,    
    private favoritoService: FavoritoService,    
    private ls: LocalStorageService,
    private navCtrl: NavController,
    private alertCtrl: AlertController) { }

  ngOnInit() {

    //this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.globalService.loadingCustom();
    this.ls.getStoreData("idSistema").then((idSistema: any) => {
      console.log("Id sistema : ", idSistema);
      this.idSistema = idSistema;      
    });

    this.listarProfesional();
    
    this.esFavorito();    
  }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('profesional_detail');
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.ls.deleteStoreData("profesionalesODS");
    this.appInsights.stopTrackPage('profesional_detail');
  }  

  listarProfesional() {

    this.ls.getStoreData("profesionalesODS").then( ( profesionalesODS: any ) => { 
      console.log("Profesionales de ODS : ", profesionalesODS);
      this.profesionalesODS = profesionalesODS;
      this.cantidadProfesionales = profesionalesODS.length;

      //this.listarTareas();
    });
    
    this.ls.getStoreData("profesional").then( ( profesional: any ) => {
      console.log("prof : ", profesional);

      this.profesional.id = profesional.id;
      this.profesional.nombre = profesional.nombre
      this.profesional.apellido = profesional.apellido;
      this.profesional.foto = profesional.foto;
      this.profesional.destreza = profesional.destreza_detalle;
      this.profesional.distancia = profesional.distancia;
      this.profesional.servicio = profesional.servicio;
      this.profesional.odsFinalizadas = profesional.odsFinalizadas;
      this.profesional.tarifaMinima = profesional.tarifaMinima;
      this.profesional.distancia = profesional.distancia;
      this.profesional.aniosExperiencia = profesional.aniosExperiencia;

      this.listarTareas( profesional.tareas );
      this.globalService.dismissLoader();
    });    
  }

  cambiarFavorito(action) {
    if (action == 'favorito') {
      this.favorito = true;
      this.agregarFavorito();

    } else if (action == 'noFavorito') {
      this.favorito = false;
      this.eliminarFavorito();
    }
  }

  agregarFavorito() {
    this.ls.getStoreData("usuario").then((usuario: any) => {
      this.favoritoObj.user = usuario.data.id;
      this.favoritoObj.profesional = this.profesional.id;
      this.favoritoService.create(this.favoritoObj).subscribe((respuesta: any) => {
        this.esFavorito();
      });
    });
  }

  eliminarFavorito() {    
    this.favoritoService.remove(this.favoritoId).subscribe((respuesta: any) => {
      console.log("Resp : ", respuesta);
    });    
  }

  esFavorito() {    
    
    this.ls.getActiveUser().then((usuario: any) => {      
      this.favoritoService.list(usuario.id).subscribe((favoritos: any) => {
        for (const favorito in favoritos.data) {
          if (favoritos.data.hasOwnProperty(favorito)) {
            const element = favoritos.data[favorito];            
            if (element.profesional.id == this.id) {
              this.favoritoId = element.id;
              this.favorito = true;
            }
          }
        }
      }), (err: any) => {
        console.log("Error vacio: ", err.message.status);
      };
    });    
  }

  listarTareas( tareas: any ) {               
    var array = [];

    tareas.forEach(element => {
      var tarea = element.tarea;
      var tareaExiste = 0;
      var precioTarea = 0;

      this.profesionalesODS.forEach( element => {
        var res = element.tareas.find( element => element.tarea.id == tarea.id );          
        
        if( res ) {
          tareaExiste++;          
          precioTarea += res.precio;           
          
          if( tareaExiste == this.profesionalesODS.length ) {
            this.tareas.push({
              id: res.tarea.id,
              isChecked: false,
              nombre: res.tarea.nombre,
              cantidad: 1,
              descripcion: res.tarea.descripcion,
              precio: precioTarea,
              totalPrecio: precioTarea
            });
          }
        }        
      });      
    });    
  }    

  seleccionaTarea(e: any) {

    let tareaCheck = e.target.checked;
    let tarea = e.target.value;    

    if (tareaCheck) {
      this.tareasSel.push(tarea);      
    } else {

      let index = this.tareasSel.indexOf(tarea);

      if (index > -1) {
        this.tareasSel.splice(index, 1);
      }
    }
  }

  actualizaMonto( e: any, i ) {    
    if( e.target.value < 1 ) return false;

    this.tareas[i].cantidad = e.target.value;
    this.tareas[i].totalPrecio = this.tareas[i].precio * e.target.value;
  }  

  solicitarServicio() {

    if( this.cantidadProfesionales < this.profesionalesODS.length ) {
      let msg = "<h5>La cantidad de profesionales no puede ser menor que los profesionales seleccionados<h5>";
      this.presentAlert(msg, "none");
      return false;
    }

    if (this.tareasSel == 0) {
      let msg = "<h5>Debe seleccionar al menos una tarea<h5>";
      this.presentAlert(msg, "none");
    } else {      

      var ods = {
        profesionalesODS: this.profesionalesODS,
        cantidadProfesionales: this.cantidadProfesionales,
        porcentajeBackup: this.porcentajeBackup,
        tareas: this.tareasSel
      }

      console.log("tareas : ", this.tareasSel);

      this.ls.setStoreData("ods", ods);      

      this.globalService.pageTransition();
      this.navCtrl.navigateForward('servicio-dir');
    }
  }

  irAtras() {    
    this.globalService.pageTransition();
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
          alert.dismiss().then(() => {
            if (ruta != "none") {
              this.globalService.pageTransition();
              this.navCtrl.navigateForward([ruta]);
            }
          })
        }
      }]
    });
    await alert.present();
  }
}
