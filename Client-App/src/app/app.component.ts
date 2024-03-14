import { Component, OnDestroy } from '@angular/core';
import { AuthService } from './auth/Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{
  title = 'Client-App';

  constructor(
    private authService : AuthService
  ){}

  ngOnDestroy(): void {
    this.authService.setStartProj(true);
  }
}
