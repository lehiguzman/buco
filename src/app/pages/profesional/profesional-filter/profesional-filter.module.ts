import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { StarRatingModule } from 'ionic4-star-rating';

import { ProfesionalFilterPage } from './profesional-filter.page';

const routes: Routes = [
  {
    path: '',
    component: ProfesionalFilterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StarRatingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfesionalFilterPage]
})
export class ProfesionalFilterPageModule {}
