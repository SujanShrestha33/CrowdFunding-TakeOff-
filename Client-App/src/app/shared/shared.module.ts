import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';

import { SharedRoutingModule } from './shared-routing.module';
import { ProjectsComponent } from './Pages/projects/projects.component';



@NgModule({
  declarations: [

  
    ProjectsComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ]
})
export class SharedModule { }
