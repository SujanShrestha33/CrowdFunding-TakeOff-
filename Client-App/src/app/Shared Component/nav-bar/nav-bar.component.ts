import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/Services/auth.service';
import {faUser, faPowerOff} from "@fortawesome/free-solid-svg-icons"
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  loginDetails : any = {};
  loggedIn : boolean = false;
  faUser = faUser;
  faOff = faPowerOff;
  startView : boolean = true;

  onHidden(): void {
    console.log('Dropdown is hidden');
  }
  onShown(): void {
    console.log('Dropdown is shown');
  }
  isOpenChange(): void {
    console.log('Dropdown state is changed');
  }

  constructor(private authService : AuthService, private router : Router) {

  }

  ngOnInit(): void {
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
    console.log(this.authService.startProj);
    if(this.authService.startProj){
      this.startView = true;
      console.log(this.startView)
    }else{
      this.startView = false;
      console.log(this.startView)

    }
  }

  logout(){
    this.authService.logout();
    this.loggedIn = false;
  }

  startProj(){
    this.authService.startProj = false;
    this.router.navigate(['/main/init-proj'])
  }

}
