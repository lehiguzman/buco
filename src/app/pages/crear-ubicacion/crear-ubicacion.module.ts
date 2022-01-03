import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CrearUbicacionPage } from './crear-ubicacion.page';

const routes: Routes = [
  {
    path: '',
    component: CrearUbicacionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CrearUbicacionPage]
})
export class CrearUbicacionPageModule {}
