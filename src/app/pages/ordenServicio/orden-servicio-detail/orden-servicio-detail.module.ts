import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrdenServicioDetailPage } from './orden-servicio-detail.page';

import { OrdenServicioDirPage } from '../orden-servicio-dir/orden-servicio-dir.page';
import { OrdenServicioDirPageModule } from '../orden-servicio-dir/orden-servicio-dir.module';


const routes: Routes = [
  {
    path: '',
    component: OrdenServicioDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdenServicioDirPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrdenServicioDetailPage],
  entryComponents: [OrdenServicioDirPage]
})
export class OrdenServicioDetailPageModule { }
