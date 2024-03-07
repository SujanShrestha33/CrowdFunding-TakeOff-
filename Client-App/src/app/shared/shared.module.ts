import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';

import { SharedRoutingModule } from './shared-routing.module';
import { ProjectsComponent } from './Pages/projects/projects.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';



@NgModule({
  declarations: [


    ProjectsComponent,
        DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FontAwesomeModule,
  ]
})
export class SharedModule { }
