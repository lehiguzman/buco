import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ServicioPagoConfirmPage } from './servicio-pago-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: ServicioPagoConfirmPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ServicioPagoConfirmPage]
})
export class ServicioPagoConfirmPageModule {}
