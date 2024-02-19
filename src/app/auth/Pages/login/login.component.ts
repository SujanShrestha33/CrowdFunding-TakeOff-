import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  hide: boolean = true;
  returnUrl: string = '';
  submitted: boolean = false;
  loading: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    // private authService : AuthService,
  ) {}

  ngOnInit(): void {

  }



  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  get f() {
    return this.loginForm.controls;
  }


  //Login Method
  // submit() {
  //   var user = this.authService.currentUserSubject.value;
  //   // console.log(user);
  //   if (this.loginForm.invalid) {
  //     this.toastr.warning('Please Fill All Fields');
  //     return;
  //   }
  //   const username = this.loginForm.value.username as string;
  // const password = this.loginForm.value.password as string;
  //   this.isLoading = true;
  //   this.authService.login(username ,password)
  //     .subscribe((response: any) => {
  //       // console.log('Login successful:', response);
  //       this.isLoading = false;
  //       this.router.navigate(['/main/dashboard']);
  //     },
  //     (error) => {
  //       // console.log(error);
  //       this.isLoading = false;
  //       this.toastr.error(error.error.error.message);
  //     }
  //   );
  // }
}
