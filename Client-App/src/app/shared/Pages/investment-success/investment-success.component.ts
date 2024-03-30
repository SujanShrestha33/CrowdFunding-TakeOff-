import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/Services/auth.service';

@Component({
  selector: 'app-investment-success',
  templateUrl: './investment-success.component.html',
  styleUrls: ['./investment-success.component.scss']
})
export class InvestmentSuccessComponent implements OnInit{

  constructor(
      private router : Router, private authService : AuthService
    ) { }

    ngOnInit(): void {
      if(!this.authService.loggedIn){
        this.router.navigate(['/auth/login']);
    }
    }

    navigate(){
      this.router.navigate(['/discover/new/All']);
    }


}
