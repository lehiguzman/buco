import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrdenServicioSelectPage } from './orden-servicio-select.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenServicioSelectPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,  
    RouterModule.forChild(routes)
  ],
  declarations: [OrdenServicioSelectPage]
})
export class OrdenServicioSelectPageModule {}
