import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons"
import { last } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value || '';
    const errors: ValidationErrors = {};
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!hasUpperCase) {
      errors['uppercase'] = true;
    }

    if (!hasLowerCase) {
      errors['lowercase'] = true;
    }

    if (!hasNumber) {
      errors['number'] = true;
    }

    if (!hasSpecialChar) {
      errors['specialChar'] = true;
    }

    // Check if the password meets all the criteria
    const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    // Return validation result with specific error messages
    return isValid ? null : { invalidPassword: errors };
  };
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {
  hide: boolean = true;
  hideIt : boolean = true;
  returnUrl: string = '/auth/login';
  submitted: boolean = false;
  loading: boolean = false;
  // isLoading: boolean = false;
  error: string | null = null;
  arrowLeft = faArrowLeft;
  modalRef?: BsModalRef;
  @ViewChild('template') template!: TemplateRef<void>;
  verifyCode : string = "";
  isVerified : boolean = false;
  innerLoading : boolean = false;
  verificationError : string| null = null;
  isVerifying : boolean = false;
  emailForVerification : string = '';
  alreadyExistsError : string = '';


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService : AuthService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {

  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
  }

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstname : ['', [Validators.required]],
    lastname : ['', [Validators.required]],
    // name : ['', [Validators.required]],
    username : ['', [Validators.required]],
    phoneNumber : ['', [Validators.required]],
    address : ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8), passwordValidator()]],
    confirmPassword : ['', [Validators.required, Validators.minLength(8)]],
  });

  get f() {
    return this.signupForm.controls;
  }

  submit() {
    if(this.f.password.value !== this.f.confirmPassword.value){
      this.error = 'Password and Confirm Password do not match';
      return;
    }
    this.verificationError = '';
    this.loading = true;
    this.submitted = true;
    console.log(this.signupForm.invalid);
    if (this.signupForm.invalid) {
      console.log('here');
      this.signupForm.markAllAsTouched();
      this.loading = false;
      return;
    }

    const email = this.f.email.value as string;
    const firstname = this.f.firstname.value as string;
    const lastname = this.f.lastname.value as string;
    const username= this.f.username.value as string;
    const phoneNumber = this.f.phoneNumber.value as string;
    const address = this.f.address.value as string;
    const password = this.f.password.value as string;
    const confirmPassword = this.f.confirmPassword.value as string;
    console.log('here2')
    const body = {
      email : email,
      firstName : firstname,
      lastName : lastname,
      username : username,
      phoneNumber : phoneNumber,
      address : address,
      password : password
    }
    console.log(body)
      this.authService.signUp(body)
        .subscribe({
          next: (response) => {
            this.loading = false;
            console.log(response);
            localStorage.setItem('email', email);
            if (this.template) {
              this.openModal(this.template);
              this.signupForm.reset();
            } else {
              console.error('Template reference not found.');
            }
            // this.router.navigate([this.returnUrl]);
          },
          error: (error) => {
            console.error('Registeration failed:', error);
            this.error = error.error.message;
            this.loading = false;
          },
          complete: () => {
          }
        });

  }

  navigate() : void{
    this.router.navigate([''])
  }

  verifyOtp(){
    this.innerLoading = true;
    const email = localStorage.getItem('email');
    const body = {
      email : email,
      otp : this.verifyCode
    }
    console.log(body)
    this.authService.verifyOtp(body)
      .subscribe({
        next: (response) => {
          console.log(response);
            this.innerLoading = false;
            this.isVerified = true;
        },
        error : (error) => {
          console.error('Verification failed:', error);
            this.verificationError = error.error.message;
            this.innerLoading = false;
        },
        complete: () => {
        }
      });
      this.verifyCode = '';
  }

  verifyEmail(){
    this.isVerifying = true;
    this.alreadyExistsError = '';
  }

  sendForVerification(){
    this.innerLoading = true;
    console.log(this.innerLoading);
    this.authService.sendForVerification(this.emailForVerification)
    .subscribe({
      next : (responese) => {
        console.log(responese);
        this.isVerifying = false;
          this.innerLoading = false;
          this.isVerifying = false;
          this.isVerified = false;
        },
        error : (error) => {
          this.alreadyExistsError = error.error.message;
          this.isVerifying = true;
          this.innerLoading = false;
          console.log(error);
          console.log(this.alreadyExistsError);
          // this.verificationError = error.error.error;
        },
        complete : () => {
        }
      })
      this.emailForVerification = '';
  }

}
