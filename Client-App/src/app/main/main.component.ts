import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/Services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy{
  constructor (
    private authService : AuthService
    ) {
    }

    ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.authService.setStartProj(true);
  }
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event) {
    // This will also be called before the window/tab is closed.
    this.authService.setStartProj(true);
  }
}
