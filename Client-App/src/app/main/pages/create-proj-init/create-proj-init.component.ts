import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/Services/auth.service';

@Component({
  selector: 'app-create-proj-init',
  templateUrl: './create-proj-init.component.html',
  styleUrls: ['./create-proj-init.component.scss']
})
export class CreateProjInitComponent {
  constructor (
    private router : Router
  ) {}

  navigate(){
    this.router.navigate(['/main/project-Form'])
  }

}
