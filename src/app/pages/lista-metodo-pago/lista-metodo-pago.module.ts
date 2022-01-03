import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaMetodoPagoPage } from './lista-metodo-pago.page';

const routes: Routes = [
  {
    path: '',
    component: ListaMetodoPagoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaMetodoPagoPage]
})
export class ListaMetodoPagoPageModule {}
