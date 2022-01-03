import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrdenServicioListPage } from './orden-servicio-list.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenServicioListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,    
    RouterModule.forChild(routes)
  ],
  declarations: [OrdenServicioListPage]
})
export class OrdenServicioListPageModule {}
