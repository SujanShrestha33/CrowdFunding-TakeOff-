import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProjInitComponent } from './pages/create-proj-init/create-proj-init.component';

const routes: Routes = [
  {path : 'init-proj', component: CreateProjInitComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
