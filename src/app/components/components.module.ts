import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { PopoverPerfilComponent } from './popover-perfil/popover-perfil.component';
import { MapaComponent } from './mapa/mapa.component';

@NgModule({
  declarations: [
    MenuComponent,
    PopoverPerfilComponent,    
    MapaComponent
  ],
  exports: [
    MenuComponent,
    PopoverPerfilComponent,
    MapaComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
})
export class ComponentsModule { }
