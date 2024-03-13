import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { CreateProjInitComponent } from './pages/create-proj-init/create-proj-init.component';


@NgModule({
  declarations: [
    CreateProjInitComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
