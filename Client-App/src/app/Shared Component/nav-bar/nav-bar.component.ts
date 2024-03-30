import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/Services/auth.service';
import {faUser, faPowerOff} from "@fortawesome/free-solid-svg-icons"
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/shared/Services/product.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit{
  loginDetails : any = {};
  loggedIn : boolean = false;
  faUser = faUser;
  faOff = faPowerOff;
  token : any;
  // startView : boolean = true;

  onHidden(): void {
    console.log('Dropdown is hidden');
  }
  onShown(): void {
    console.log('Dropdown is shown');
  }
  isOpenChange(): void {
    console.log('Dropdown state is changed');
  }

  constructor(public authService : AuthService, private router : Router, private rpute : ActivatedRoute, private projectService : ProductService) {

  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((res) => {
      this.loginDetails = res;
      console.log(res);
    })
    if(this.loginDetails){
      this.loggedIn = true;
      this.getMyToken();
    }else {
      this.loggedIn = false;
    }
    console.log(this.loggedIn);
    console.log(this.authService.startProj);
    // if(this.authService.startProj){
    //   this.startView = true;
    //   console.log(this.startView)
    // }else{
    //   this.startView = false;
    //   console.log(this.startView)

    // }
  }

  logout(){
    this.authService.logout();
    this.loggedIn = false;
  }

  startProj(){
    // this.authService.startProj = false;
    this.authService.setStartProj(false);
    this.router.navigate(['/main/init-proj'])
  }

  getMyToken(){
    this.projectService.getMyToken()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.token = res['data'].token;

        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {}
      })
  }
}
