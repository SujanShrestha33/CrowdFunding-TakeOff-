import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './Pages/projects/projects.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { ProjectViewComponent } from './Pages/projects/project-view/project-view.component';
import { InvestmentSuccessComponent } from './Pages/investment-success/investment-success.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path : 'discover/:type', component: ProjectsComponent},
  {path : 'project-view/:id/:type', component : ProjectViewComponent},
  {path : "investment-success", component : InvestmentSuccessComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
