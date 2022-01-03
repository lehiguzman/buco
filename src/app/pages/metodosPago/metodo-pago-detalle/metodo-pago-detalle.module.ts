import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MetodoPagoDetallePage } from './metodo-pago-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: MetodoPagoDetallePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,    
    RouterModule.forChild(routes)
  ],
  providers: [ DatePipe ],
  declarations: [MetodoPagoDetallePage]
})
export class MetodoPagoDetallePageModule {}
