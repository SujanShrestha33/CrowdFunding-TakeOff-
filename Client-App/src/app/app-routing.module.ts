import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { SharedComponent } from './shared/shared.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path : 'auth',
    component : AuthComponent,
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path : '',
    component : SharedComponent,
    loadChildren: () =>
      import('./shared/shared.module').then((m) => m.SharedModule)
  },
  {
     path : 'main',
     component : MainComponent,
     loadChildren: () =>
     import('./main/main.module').then((m) => m.MainModule)
  },
  {
    path : '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
