import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DatosMetodosPagoPage } from './datos-metodos-pago.page';

const routes: Routes = [
  {
    path: '',
    component: DatosMetodosPagoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)    
  ],
  declarations: [DatosMetodosPagoPage]
})
export class DatosMetodosPagoPageModule {}
