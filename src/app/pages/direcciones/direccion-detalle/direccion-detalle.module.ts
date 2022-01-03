import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DireccionDetallePage } from './direccion-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: DireccionDetallePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DireccionDetallePage]
})
export class DireccionDetallePageModule {}
