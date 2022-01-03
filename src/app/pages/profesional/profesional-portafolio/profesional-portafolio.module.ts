import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfesionalPortafolioPage } from './profesional-portafolio.page';

const routes: Routes = [
  {
    path: '',
    component: ProfesionalPortafolioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfesionalPortafolioPage]
})
export class ProfesionalPortafolioPageModule {}
