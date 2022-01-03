import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AgregarDireccionPage } from './agregar-direccion.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarDireccionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AgregarDireccionPage]
})
export class AgregarDireccionPageModule {}
