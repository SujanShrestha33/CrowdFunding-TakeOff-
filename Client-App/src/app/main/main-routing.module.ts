import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProjInitComponent } from './pages/create-proj-init/create-proj-init.component';
import { ProjectFormComponent } from './pages/create-proj-init/project-form/project-form.component';
import { RewardFormComponent } from './pages/create-proj-init/reward-form/reward-form.component';
import { InvestComponent } from './pages/invest/invest.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {path : 'init-proj', component: CreateProjInitComponent},
  {path : 'project-Form', component : ProjectFormComponent},
  {path: 'reward-from/:id', component: RewardFormComponent},
  {path: 'invest/:id', component: InvestComponent},
  {path: 'profile', component : ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
