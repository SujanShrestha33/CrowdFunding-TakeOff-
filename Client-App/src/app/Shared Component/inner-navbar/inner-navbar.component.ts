import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inner-navbar',
  templateUrl: './inner-navbar.component.html',
  styleUrls: ['./inner-navbar.component.scss']
})
export class InnerNavbarComponent {

  constructor (
    private router : Router
  ) {}


  navigate(type : string){
    this.router.navigate([`/discover`]);
  }

}
