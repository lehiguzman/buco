import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';

import { GlobalService } from '../../../providers';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.page.html',
  styleUrls: ['./mensaje.page.scss'],
})
export class MensajePage implements OnInit {

  constructor( private globalService: GlobalService, private navCtrl: NavController ) { }

  ngOnInit() {
  }

  irARenovar() {
    
    this.globalService.pageTransition();
    this.navCtrl.navigateForward('renovar');

  }

}
