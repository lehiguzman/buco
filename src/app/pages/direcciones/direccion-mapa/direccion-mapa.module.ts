import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DireccionMapaPage } from './direccion-mapa.page';

const routes: Routes = [
  {
    path: '',
    component: DireccionMapaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)    
  ],
  declarations: [DireccionMapaPage]
})
export class DireccionMapaPageModule {}
