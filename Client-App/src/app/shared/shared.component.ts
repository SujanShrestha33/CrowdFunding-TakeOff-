import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/Services/auth.service';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.scss']
})
export class SharedComponent implements OnInit {
  loginDetails : any = {};
  loggedIn : boolean = false;

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
  }

}
