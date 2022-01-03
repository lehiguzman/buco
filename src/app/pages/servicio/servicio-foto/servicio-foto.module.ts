import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ServicioFotoPage } from './servicio-foto.page';


const routes: Routes = [
  {
    path: '',
    component: ServicioFotoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes) 
  ],
  declarations: [ServicioFotoPage]
})
export class ServicioFotoPageModule {}
