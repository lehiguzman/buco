import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PortafolioAddPage } from './portafolio-add.page';

const routes: Routes = [
  {
    path: '',
    component: PortafolioAddPage
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
  declarations: [PortafolioAddPage]
})
export class PortafolioAddPageModule {}
