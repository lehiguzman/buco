import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DatosTareasTarifasPage } from './datos-tareas-tarifas.page';

const routes: Routes = [
  {
    path: '',
    component: DatosTareasTarifasPage
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
  declarations: [DatosTareasTarifasPage]
})
export class DatosTareasTarifasPageModule {}
