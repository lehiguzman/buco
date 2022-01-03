import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TareaListPageRoutingModule } from './tarea-list-routing.module';

import { TareaListPage } from './tarea-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TareaListPageRoutingModule
  ],
  declarations: [TareaListPage]
})
export class TareaListPageModule { }
