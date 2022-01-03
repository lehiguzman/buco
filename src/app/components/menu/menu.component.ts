import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { NavController, MenuController, AlertController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard';
// Servicios
import { FirebaseAuthService, GlobalService, LocalStorageService, AuthService } from '../../providers';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private fireAuthServ: FirebaseAuthService,
    private authService: AuthService,
    public globalServ: GlobalService,
    private lsServ: LocalStorageService,
    private keyboard: Keyboard,
    private menuCtrl: MenuController,
    private nav: NavController,
    private route: Router,
  ) { }

  userId: any;
  estatusProfesional: any;

  @Input() usuarioTipo;

  //Rutas en las cuales se debe confirmar para salir por menu o tabs
  arrayUrls = [
    "/servicio-req",
    "/servicio-pago",
    "/servicio-dir",
    "/servicio-con",
    "/servicio-foto",
  ];

  ngOnInit() {
    this.keyboard.hide();
  }

  home() {
    this.activarAnimacion('aHome');
    setTimeout(() => {
      this.globalServ.pageTransition();
      console.log("PerfilProfesional : ", this.globalServ.UsuarioTipo);
      if (this.globalServ.UsuarioTipo == 'profesional') {
        this.irAUrl('orden-servicio-list');
      } else {
        this.irAUrl('home');
      }

      this.menuCtrl.close();
    }, 500);
  }

  portafolio() {
    this.activarAnimacion('aPort');
    setTimeout(() => {
      this.globalServ.pageTransition();
      this.irAUrl('portafolio-list');
      this.menuCtrl.close();
    }, 500);
  }

  metodoPago() {
    this.activarAnimacion('aMPago');
    setTimeout(() => {
      this.globalServ.pageTransition();
      this.irAUrl('metodo-pago-list');
      this.menuCtrl.close();
    }, 500);
  }

  tareas() {
    this.activarAnimacion('aTask');
    setTimeout(() => {
      this.globalServ.pageTransition();
      this.irAUrl('tarea-list');
      this.menuCtrl.close();
    }, 500);
  }

  favorito() {
    this.activarAnimacion('aFav');
    setTimeout(() => {
      this.globalServ.pageTransition();
      this.irAUrl('profesional-favorito');
      this.menuCtrl.close();
    }, 500);
  }

  perfil() {
    this.activarAnimacion('aPerfil');
    setTimeout(() => {
      this.globalServ.pageTransition();
      this.irAUrl('perfil');
      this.menuCtrl.close();
    }, 500);
  }

  ordenServicio() {
    this.activarAnimacion('aServ');
    setTimeout(() => {
      this.globalServ.pageTransition();
      this.irAUrl('orden-servicio-list');
      this.menuCtrl.close();
    }, 500);
  }

  documentos() {
    this.activarAnimacion('aDoc');
    setTimeout(() => {
      this.globalServ.pageTransition();
      this.irAUrl('documento-list');
      this.menuCtrl.close();
    }, 500);
  }

  direccion() {
    this.lsServ.deleteStoreData("esPreregistro");
    this.activarAnimacion('aDir');
    setTimeout(() => {
      this.globalServ.pageTransition();
      this.irAUrl('direcciones');
      this.menuCtrl.close();
    }, 500);
  }

  private activarAnimacion(opcAct: string) {
    const btn = document.querySelector(`.${opcAct}`);
    btn.classList.remove('animate')
    setTimeout(() => btn.classList.add('animate'), 100);
  }

  logout() {
    this.menuCtrl.close();

    if (this.globalServ.UsuarioTipo == 'profesional') {
      /*this.authService.logoutProfesional().subscribe((data: any) => {
        console.log("Data : ", data);
      });*/
    } else {
      this.irAUrl('home');
    }

    this.cerrarSesion();
  }

  irAUrl(url: any) {
    //Busco en arreglo de urls la ruta si tiene que ser confirmada al salir
    let urlFound = this.arrayUrls.find(
      (element) => element == this.route["routerState"].snapshot.url
    );
    this.globalServ.pageTransition();
    if (urlFound) {
      //Se confirma la salida de la ruta
      this.confirmacion(url);
    } else {
      //Sale sin confirmar
      if (url == "login") {
        this.logout();
      } else {
        this.route.navigateByUrl(url);
      }
    }
  }

  preRegistro() {
    this.globalServ.pageTransition();
    this.irAUrl('preregistro-home');
    this.menuCtrl.close();
  }

  private cerrarSesion() {
    this.globalServ.loadingCustom();
    this.fireAuthServ.logout().finally(() => {
      this.lsServ.deleteAllStoreData();
      this.nav.navigateRoot("/login");
    })
  }

  async confirmacion(url: any) {
    let aviso = await this.alertCtrl.create({
      header: "¿Está seguro de salir?",
      mode: "ios",
      message: "<h5>La información se perderá</h5>",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "buttonCancel",
          handler: (blah) => {
            console.log("Cancelado");
            //this.showMenu = false;
          },
        },
        {
          text: "Si",
          cssClass: "buttonConfirm",
          handler: () => {
            console.log("Salio a ", url);
            if (url == "/login") {
              this.logout();
            } else {
              this.route.navigateByUrl(url);
            }
          },
        },
      ],
    });

    await aviso.present();
  }
}
