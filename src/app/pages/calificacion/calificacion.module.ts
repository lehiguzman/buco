import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CalificacionPage } from './calificacion.page';
import { StarRatingModule } from 'ionic4-star-rating';

const routes: Routes = [
  {
    path: '',
    component: CalificacionPage
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
  declarations: [CalificacionPage]
})
export class CalificacionPageModule {}
