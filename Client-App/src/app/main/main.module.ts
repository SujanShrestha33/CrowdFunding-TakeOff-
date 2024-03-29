import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { CreateProjInitComponent } from './pages/create-proj-init/create-proj-init.component';
import { ProjectFormComponent } from './pages/create-proj-init/project-form/project-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { RewardFormComponent } from './pages/create-proj-init/reward-form/reward-form.component';
import { InvestComponent } from './pages/invest/invest.component';
import { ProfileComponent } from './pages/profile/profile.component';


@NgModule({
  declarations: [
    CreateProjInitComponent,
    ProjectFormComponent,
    RewardFormComponent,
    InvestComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    NgSelectModule,
    FormsModule
  ]
})
export class MainModule { }
