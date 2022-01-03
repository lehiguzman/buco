import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { DocumentoDetallePage } from './documento-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentoDetallePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,   
    RouterModule.forChild(routes) 
  ],
  declarations: [DocumentoDetallePage]
})
export class DocumentoDetallePageModule {}
