import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/Services/auth.service';
import IdleTimer from '../shared/idle-timer.js';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.scss']
})
export class SharedComponent implements OnInit {
  loginDetails : any = {};
  loggedIn : boolean = false;
  timer = IdleTimer;


  constructor(
    private router : Router,
    private authService : AuthService
  ){}

  ngOnInit(): void {
    console.log(this.authService.currentUserSubject);
    this.authService.currentUser.subscribe((res) => {
      this.loginDetails = res;
      console.log(res);
    })
    if(this.loginDetails){
      this.loggedIn = true;
    }else {
      this.loggedIn = false;
    }
    console.log(this.loggedIn);

    if(this.loggedIn){
      this.idleTime();
      this.refreshTokenTimer();
    }
  }


  refreshTokenTimer() {
    this.authService.startRefreshTokenTimer()
  }

  idleTime() {
      this.timer = new IdleTimer({
          timeout: 2400, //expired after 40 min
          onTimeout: () => {
              this.authService.logout()
              this.timer.cleanUp();
              alert("You have been logged out for being inactive")
              const returnModule = location.hash.substring(2);
              this.router.navigate(['/'], { queryParams: { returnUrl: returnModule } });
          }
      });
  }

  // ngOnDestroy() {
  //   this.timer.cleanUp();
  // }
}
