import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
// Services
import {
  GlobalService, LocalStorageService,
  ProfesionalTareaService, ApplicationInsightsService, ProfesionalServicioService
} from '../../../providers/';

@Component({
  selector: 'app-tarea-list',
  templateUrl: './tarea-list.page.html',
  styleUrls: ['./tarea-list.page.scss'],
})
export class TareaListPage implements OnInit {

  tareas: any = [];
  tareasCopia: any = [];
  usuario: any = {};
  profesional: any = {
    servicio: null
  };

  servicios: any = [];
  /*{
    nombre: null,
    descripcion: null,
    tareas: []
  };*/

  constructor(
    private appInsights: ApplicationInsightsService,
    private lsServ: LocalStorageService,
    private navCtrl: NavController,
    private profeTareasApi: ProfesionalTareaService,
    private profesionalServicioService: ProfesionalServicioService,
    public globalServ: GlobalService,
  ) { }

  ngOnInit() { }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('tareas_list');

    // AQUI COMIENZA LA CARGA DE DATOS
    this.lsServ.getActiveUser().then((usuario: any) => {
      if (usuario && usuario.profesional) {
        this.usuario = usuario;
        this.profesional = usuario.profesional;
        this.listarTareas();
      } else {
        this.globalServ.mensaje({ message: "No se pudo obtener los datos. Por favor, vuelva a iniciar la sesión." });
        this.globalServ.pageTransition();
        this.navCtrl.navigateForward('home');
      }
    });
  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('tareas_list');
  }

  listarTareas() {
    /*if (this.globalServ.UsuarioTipo == 'profesional') {
      this.globalServ.loadingCustom("Cargando Tareas...", 99999);
      this.profeTareasApi.list(this.profesional.id).subscribe((resp: any) => {
        this.globalServ.dismissLoader();
        this.tareas = resp.data;
      });
    } else {
      this.globalServ.mensaje({ message: "Usted no es un Profesional" });
      this.globalServ.pageTransition();
      this.navCtrl.navigateForward('home');
    }*/

    //Trae los servicios del profesional
    this.profesionalServicioService.list(this.profesional.id).subscribe( data => {
      const profesionalServicio : any = data;      

      //Recorre los servicios
      profesionalServicio.data.forEach(element => {        
        var idProfesional = element.profesional.id;
        var idServicio = element.servicio.id;
        var nombre = element.servicio.nombre;
        var descripcion = element.servicio.descripcion;       

        //Consulta las tareas del profesional y cada servicio        
        this.profeTareasApi.listXServicio( idProfesional, idServicio ).subscribe( (data: any) => {          
          var servicioTareas = data.data;         

          //Objeto con los datos ordenados por servicio y respectivas tareas
          var objTareaServicio = {
            nombre: nombre,
            descripcion: descripcion,
            servicioTareas: servicioTareas,
          }         

          this.servicios.push(objTareaServicio);
        });
      });
    });
  }

  formInValido() {
    let invalido = true;
    this.tareas.forEach(ele => {
      const montoCorrecto = (parseInt(ele.precio) >= ele.tarea.tarifaMinima && parseInt(ele.precio) <= ele.tarea.tarifaMaxima);
      if (invalido && montoCorrecto) {
        invalido = false;
      }
    });

    return invalido;
  }

  inputChange(event: any, campo: any, i: any) {
    const value = event.detail.value;
    if (value) this.tareas[i].precio = value;
  }

  actualizar() {
    this.tareas.forEach(ele => {
      let tarea: any = this.tareasCopia.filter(item => item.tarea.id === ele.tarea.id);
      if (ele.precio !== tarea.precio) {
        let datos = {
          profesional_id: this.profesional.id,
          tarea_id: ele.tarea.id,
          precio: ele.precio
        };
        this.globalServ.loadingCustom("Actualizando Información...", 9999);
        this.profeTareasApi.updateTarea(datos).subscribe(() => {
          this.globalServ.dismissLoader();
        });
      }
    });
  }

}
