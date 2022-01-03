import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { StarRatingModule } from 'ionic4-star-rating';

import { IonicModule } from '@ionic/angular';

import { PerfilPage } from './perfil.page';
import { PopoverPerfilComponent } from 'src/app/components/popover-perfil/popover-perfil.component';
import { ComponentsModule } from '../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: PerfilPage
  }
];

@NgModule({
  entryComponents: [
    PopoverPerfilComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StarRatingModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [PerfilPage]
})
export class PerfilPageModule {}
