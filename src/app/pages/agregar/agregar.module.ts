import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AgregarPage } from './agregar.page';
import { ComponentsModule } from 'src/app/components/components.module';



const routes: Routes = [
  {
    path: '',
    component: AgregarPage
  }
];

@NgModule({
  providers:[
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [AgregarPage]
})
export class AgregarPageModule {}
