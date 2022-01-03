import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MetodoPagoListPage } from './metodo-pago-list.page';

const routes: Routes = [
  {
    path: '',
    component: MetodoPagoListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MetodoPagoListPage]
})
export class MetodoPagoListPageModule {}
