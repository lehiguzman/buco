import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, Platform } from '@ionic/angular';
// Services
import {
  GlobalService, LocalStorageService,
  ProfesionalService, ApplicationInsightsService
} from '../../providers/';
import { PopoverPerfilComponent } from '../../components/popover-perfil/popover-perfil.component';
import * as moment from 'moment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  backUnable: any;
  perfilProfesional: boolean = false;
  profesional: any = null;
  rating: number = 0;
  usuario: any = {
    username: "",
    email: "",
    nombre: "",
    apellido: "",
    estatus: 0,
    estatusTexto: "",
    identificacion: "",
    nacionalidad: "",
    genero: "",
    generoTexto: "",
    fechaNacimiento: "",
    telefono: "",
    vehiculo: "",
    foto: "",
    direccion: "",
    aniosExperiencia: "",
    radioCobertura: "",
    destrezaDetalle: "",
    redesSociales: {
      fb: "",
      ig: "",
      in: "",
      tw: "",
    },
    promedio: {
      puntualidad: 0,
      servicio: 0,
      presencia: 0,
      conocimiento: 0,
      recomendado: 0,
    },
    servicio: null,
    user: null,
  };
  esProfesional: boolean = false;

  constructor(
    private appInsights: ApplicationInsightsService,
    private lsServ: LocalStorageService,
    private navCtrl: NavController,
    private platform: Platform,
    private popoverCtrl: PopoverController,
    private profesionalService: ProfesionalService,
    public globalServ: GlobalService,
  ) {
    //this.esProfesional = this.globalServ.UsuarioTipo === 'profesional' ? true : false;
    this.perfilProfesional = this.globalServ.UsuarioTipo === 'profesional' ? true : false;
  }

  ngOnInit() { }
  ionViewDidEnter() {
    // Application Insights ::: iniciar track
    this.appInsights.startTrackPage('perfil');
    this.backUnable = this.platform.backButton.subscribeWithPriority(9999, () => {
      this.navCtrl.navigateBack('home');
    });

    // AQUI COMIENZA LA CARGA DE DATOS
    this.cargarPerfil();

  }
  ionViewDidLeave() {
    // Application Insights ::: detener track
    this.appInsights.stopTrackPage('perfil');
    this.backUnable.unsubscribe();
  }

  cargarPerfil() {

    this.perfilProfesional = ( this.globalServ.UsuarioTipo == 'profesional' ) ? true : false;
    this.lsServ.getActiveUser().then((usuario: any) => {
      console.log("Datos de usuario : ", usuario);
      if (usuario) {
        this.usuario = { ...this.usuario, ...usuario };
        this.usuario.nombre = usuario.name ? usuario.name : "";
        if (usuario.fechaNacimiento) this.usuario.fechaNacimiento = moment(usuario.fechaNacimiento).format("DD/MM/YYYY");
        if (usuario.profesional) {
          //this.esProfesional = false;         
          this.profesional = usuario.profesional;          
          const {
            nombre, apellido, email, telefono, identificacion, nacionalidad, vehiculo,
            direccion, destrezaDetalle, redesSociales, aniosExperiencia, radioCobertura
          } = this.profesional;

          //if (nombre && apellido) {
            //this.usuario.nombre = nombre;
            //this.usuario.apellido = apellido;
            //this.usuario.name = nombre + " " + apellido;
          //}
          this.usuario.email = email ? email : "";
          this.usuario.telefono = telefono ? telefono : "";
          this.usuario.identificacion = identificacion ? identificacion : "";
          this.usuario.nacionalidad = nacionalidad ? nacionalidad : "";
          this.usuario.vehiculo = vehiculo ? vehiculo : "";
          this.usuario.direccion = direccion ? direccion : "";
          this.usuario.destrezaDetalle = destrezaDetalle ? destrezaDetalle : "";
          this.usuario.redesSociales = redesSociales ? redesSociales : "";
          this.usuario.aniosExperiencia = aniosExperiencia ? aniosExperiencia : "";
          this.usuario.radioCobertura = radioCobertura ? radioCobertura : "";

          this.actualizarEstatus(this.profesional.id);

        }
      }
    });
  }

  verCalificaciones() {

    this.lsServ.setStoreData("profesionalId", this.profesional.id);

    this.globalServ.pageTransition();
    this.navCtrl.navigateForward("calificacion-list");
  }

  actualizarEstatus(id: number) {
    this.profesionalService.detail(id).subscribe((data: any) => {
      console.log("Datos de consulta : ", data);
      var profesional = data.data;
      const {
        estatus, estatusTexto, promedioConocimiento, promedioPresencia, promedioPuntualidad, promedioRecomendado, promedioServicio
      } = profesional;

      this.usuario.estatus = estatus;
      this.usuario.estatusTexto = estatusTexto;

      this.usuario.promedio.conocimiento = promedioConocimiento ? promedioConocimiento : 0;
      this.usuario.promedio.presencia = promedioPresencia ? promedioPresencia : 0;
      this.usuario.promedio.puntualidad = promedioPuntualidad ? promedioPuntualidad : 0;
      this.usuario.promedio.recomendado = promedioRecomendado ? promedioRecomendado : 0;
      this.usuario.promedio.servicio = promedioServicio ? promedioServicio : 0;

      this.rating = (
        this.usuario.promedio.conocimiento +
        this.usuario.promedio.presencia +
        this.usuario.promedio.puntualidad +
        this.usuario.promedio.recomendado +
        this.usuario.promedio.servicio
      ) / 5;
    });
  }

  async verPopoverPerfil(e) {   

    const popover = await this.popoverCtrl.create({
      component: PopoverPerfilComponent,
      componentProps: {
        profesional: this.profesional,        
        email: this.usuario.email
      },
      event: e,
      mode: 'ios'
    });

    await popover.present();
  }

  notificaciones() {
    this.globalServ.pageTransition();
    this.navCtrl.navigateForward('notificacion-list');
  }

  irAtras() {
    this.globalServ.pageTransition();
    var url = this.perfilProfesional ? 'orden-servicio-list' : 'home';
    this.navCtrl.navigateBack(url);
  }

  cambiarPerfil(e: any) {
    this.perfilProfesional = e.detail.checked;
    this.globalServ.UsuarioTipo = e.detail.checked ? "profesional" : "cliente";
    this.lsServ.setStoreData("perfilProfesional", this.perfilProfesional);
  }
}
