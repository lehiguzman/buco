import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrdenServicioMapPage } from './orden-servicio-map.page';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: OrdenServicioMapPage
  }
];

@NgModule({
  imports: [    
    CommonModule,
    FormsModule,
    IonicModule,   
    ComponentsModule, 
    [RouterModule.forChild(routes)],
  ],
  declarations: [OrdenServicioMapPage]
})
export class OrdenServicioMapPageModule {}
