import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrdenServicioImgPage } from './orden-servicio-img.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenServicioImgPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrdenServicioImgPage]
})
export class OrdenServicioImgPageModule {}
