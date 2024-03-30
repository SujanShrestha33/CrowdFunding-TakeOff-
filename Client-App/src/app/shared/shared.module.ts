import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';

import { SharedRoutingModule } from './shared-routing.module';
import { ProjectsComponent } from './Pages/projects/projects.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { ProjectViewComponent } from './Pages/projects/project-view/project-view.component';
import {MatTabsModule} from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { InvestmentSuccessComponent } from './Pages/investment-success/investment-success.component';


@NgModule({
  declarations: [


    ProjectsComponent,
        DashboardComponent,
        ProjectViewComponent,
        InvestmentSuccessComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FontAwesomeModule,
    MatTabsModule,
    FormsModule,
    CarouselModule
  ]
})
export class SharedModule { }
