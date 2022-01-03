import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CalificacionListPage } from './calificacion-list.page';

import { StarRatingModule } from 'ionic4-star-rating';

const routes: Routes = [
  {
    path: '',
    component: CalificacionListPage
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
  declarations: [CalificacionListPage]
})
export class CalificacionListPageModule {}
