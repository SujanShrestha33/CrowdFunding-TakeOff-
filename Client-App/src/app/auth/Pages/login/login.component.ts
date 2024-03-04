import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../Services/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  modalRef?: BsModalRef;
  emailForVerification: string = '';
  innerLoading: boolean = false;
  forgotPassError: string = '';
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {}

  openModal(template: TemplateRef<void>) {
    this.emailForVerification = '';
    this.message = '';
    this.forgotPassError = '';
    this.modalRef = this.modalService.show(template);
  }
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
        next: (responseponse) => {
          console.log(responseponse);
          this.loading = false;
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.error = error.error.error;

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

  sendForVerification() {
    console.log(this.emailForVerification);
    this.forgotPassError = '';
    this.innerLoading = true;
    this.authService.forgotPassword(this.emailForVerification).subscribe({
      next: (responseponse) => {
        this.message = `An email hase been sent to ${this.emailForVerification} with password responseet link. Please check your inbox.`;
        this.innerLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.forgotPassError = error.error.msg;
        this.innerLoading = false;
        this.emailForVerification = '';
      },
      complete: () => {},
    });
  }

  signInGoogle() {
    this.loading = true;
    this.authService.googleSignIn().subscribe({
      next: (response: any) => {
        console.log(response);
        console.log(response.status);

        // Handle the responseponse here, you might want to redirect the user or perform other actions
        // For example, you can check if the responseponse contains a redirect URL and navigate to it
        if (response && response.redirectUrl) {
          window.location.href = response.redirectUrl;
        }

        this.loading = false;
      },
      error: (error : any) => {
        console.log(error);
        this.loading = false;
      },
      complete: () => {},
    });
  }

}
