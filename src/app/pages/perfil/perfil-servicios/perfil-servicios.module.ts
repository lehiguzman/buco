import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PerfilServiciosPage } from './perfil-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilServiciosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)    
  ],
  declarations: [PerfilServiciosPage]
})
export class PerfilServiciosPageModule {}
