import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PortafolioDetallePage } from './portafolio-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: PortafolioDetallePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PortafolioDetallePage]
})
export class PortafolioDetallePageModule {}
