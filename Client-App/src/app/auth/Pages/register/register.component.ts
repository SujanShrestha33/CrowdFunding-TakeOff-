import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  hide: boolean = true;
  hideIt : boolean = true;
  returnUrl: string = '';
  submitted: boolean = false;
  loading: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService : AuthService,
  ) {}

  ngOnInit(): void {

  }

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstname : ['', [Validators.required]],
    lastname : ['', [Validators.required]],
    name : ['', [Validators.required]],
    username : ['', [Validators.required]],
    phoneNumber : ['', [Validators.required]],
    address : ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword : ['', [Validators.required]],
    // firstname : ['', [Validators.required]],
  });

  get f() {
    return this.signupForm.controls;
  }

  submit() {
    this.loading = true;
    this.submitted = true;

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.loading = false;
      return;
    }

    const email = this.f.email.value as string;  // Ensure non-null value
    const password = this.f.password.value as string;  // Ensure non-null value

    if (email && password) {
      this.authService.login(email, password)
        .subscribe({
          next: (response) => {
            // Handle successful login, e.g., redirect to returnUrl
            this.router.navigate([this.returnUrl]);
          },
          error: (error) => {
            // Handle login error, display appropriate messages
            console.error('Login failed:', error);
            this.error = 'Incorrect email or password.';
            // You can update the loading and handle other error-related logic here
            this.loading = false;
          },
          complete: () => {
            // Handle completion if needed
          }
        });
    } else {
      // Handle the case where email or password is null
      console.error('Email or password is null.');
      this.loading = false;
    }
  }

}
