import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/Services/auth.service';

@Component({
  selector: 'app-create-proj-init',
  templateUrl: './create-proj-init.component.html',
  styleUrls: ['./create-proj-init.component.scss']
})
export class CreateProjInitComponent implements OnInit, OnDestroy {

  constructor (
    private authService : AuthService
    ) {
    }

    ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.authService.startProj = true;
  }

}
