import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../Services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  returnUrl: string = '';
  submitted: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  get f() {
    return this.loginForm.controls;
  }

  submit() {
    this.loading = true;
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loading = false;
      return;
    }

    const email = this.f.email.value as string; // Ensure non-null value
    const password = this.f.password.value as string; // Ensure non-null value

    if (email && password) {
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log(response);
          this.loading = false;
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.error = 'Incorrect email or password, Please Try Again!';

          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      // Handle the case where email or password is null
      console.error('Email or password is null.');
      this.loading = false;
    }
  }
}
