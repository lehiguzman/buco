import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PreRegistroHomePage } from './preregistro-home.page';

const routes: Routes = [
  {
    path: '',
    component: PreRegistroHomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PreRegistroHomePage]
})
export class PreRegistroHomePageModule { }
