import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { CreateProjInitComponent } from './pages/create-proj-init/create-proj-init.component';
import { ProjectFormComponent } from './pages/create-proj-init/project-form/project-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CreateProjInitComponent,
    ProjectFormComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    NgSelectModule,
    FormsModule
  ]
})
export class MainModule { }
