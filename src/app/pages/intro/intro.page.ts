import { Component, OnInit } from '@angular/core';

import { NavController, IonSlides } from '@ionic/angular';
import { GlobalService } from '../../providers';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

slideOpts = {
    initialSlide: 0,
    speed: 400    
  };

  constructor( private nav: NavController, private globalService: GlobalService ) { }

  ngOnInit() {
  	this.slideOpts;
  }  

  

  slidesDidLoad(slides: IonSlides) {   	
    slides.startAutoplay();
  }

  login() {    
    this.globalService.pageTransition();
    this.nav.navigateForward('login');
  }

}
