import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

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
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})


export class ForgotPasswordComponent implements OnInit{
  loading : boolean = false;
  hide: boolean = true;
  hideIt : boolean = true;
  submitted : boolean = false;
  error : string = '';
  token : string = '';
  changed : boolean = false;

  constructor (
    private fb: FormBuilder,
    private route : ActivatedRoute,
    private authService : AuthService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((res) => {
      console.log(res);
      this.token = res['token'];
    })
  }

  get f (){
    return this.passwordForm.controls;
  }

  passwordForm = this.fb.group({
    password : ['', [Validators.required, passwordValidator()]],
    confirmPassword : ['', [Validators.required, passwordValidator()]]
  })

  submit(){
    this.loading = true;
    this.submitted = true;
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.loading = false;
      return;
    }
    const newPass = this.f.password.value as string;
    const confirmPass = this.f.confirmPassword.value as string;

    if(newPass !== confirmPass){
      this.error = `Passwords doesn't match!!`;
      this.loading = false;
      return;
    }

    this.authService.resetPassword(newPass, this.token)
      .subscribe({
        next : (response) => {
          console.log(response);
          this.loading =false;
          this.changed = true;
        },
        error : (error) => {
          console.log(error);
          this.loading =false;
        },
        complete : () => {

        }
      })
  }

  navigate(){
    this.router.navigate(["/auth/login"]);
  }
}
