import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProjInitComponent } from './pages/create-proj-init/create-proj-init.component';
import { ProjectFormComponent } from './pages/create-proj-init/project-form/project-form.component';

const routes: Routes = [
  {path : 'init-proj', component: CreateProjInitComponent},
  {path : 'project-Form', component : ProjectFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
