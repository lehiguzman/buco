import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrdenServicioResultPage } from './orden-servicio-result.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenServicioResultPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrdenServicioResultPage]
})
export class OrdenServicioResultPageModule {}
