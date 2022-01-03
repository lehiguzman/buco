import { Component, OnInit } from '@angular/core';
// Services
import { GlobalService } from '../../providers';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  mensaje: string = "Buco aun no esta disponible al público";

  constructor(public globalServ: GlobalService) {
    this.globalServ.dismissLoader();
  }

  ngOnInit() {
    setTimeout(() => {
      this.globalServ.mensaje({ mensaje: this.mensaje, duration: 4444, position: "top" });
      this.globalServ.mensaje({ mensaje: this.mensaje, duration: 55555, position: "bottom" });
    }, 19999);
  }

}
