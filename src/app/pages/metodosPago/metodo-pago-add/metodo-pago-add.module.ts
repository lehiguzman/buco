import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MetodoPagoAddPage } from './metodo-pago-add.page';

const routes: Routes = [
  {
    path: '',
    component: MetodoPagoAddPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MetodoPagoAddPage]
})
export class MetodoPagoAddPageModule { }
