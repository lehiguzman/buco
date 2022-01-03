import { NgModule } from '@angular/core';
import { FiltroPipe } from './filtro.pipe';
import { OrderByPipe } from './order-by.pipe';

@NgModule({
  declarations: [FiltroPipe, OrderByPipe],
  exports: [ FiltroPipe, OrderByPipe ]
})
export class PipesModule { }
