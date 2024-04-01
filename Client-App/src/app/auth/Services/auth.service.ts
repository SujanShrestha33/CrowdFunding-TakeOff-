import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, tap } from 'rxjs';
import { ReturnUser } from 'src/app/Models/returnUser';
import { User } from 'src/app/Models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  baseUrl: string = environment.baseUrl;
  private refreshTokenTimeout : any;
  public currentUserSubject = new BehaviorSubject<ReturnUser | null>(null);
  currentUser = this.currentUserSubject.asObservable();
  loggedIn : boolean = false;
  startProj : boolean= true;
  userId : string = '';
  currentEmail : string = '';
  userRole : string = '';

  constructor(private http: HttpClient, private router : Router) {
    const storedUserString = localStorage.getItem('ReturnUser');
    const storedStartProj = localStorage.getItem('startProj');


  if (storedUserString) {
    const storedUser: ReturnUser = JSON.parse(storedUserString);
    console.log(storedUser);
    this.currentUserSubject.next(storedUser);
    console.log(this.currentUserSubject);
    this.userId = storedUser.userId;
    this.currentEmail = localStorage.getItem('email')!;
    this.userRole = storedUser.userRole;
    console.log(this.userRole);
    this.loggedIn = true;
    console.log(this.userId)
    console.log(this.loggedIn);
    console.log(this.userId)
  }else{
    this.loggedIn = false;
    console.log(this.loggedIn);
  }

  if (storedStartProj) {
    this.startProj = JSON.parse(storedStartProj);
  }
  // this.startRefreshTokenTimer();
  }

  setStartProj(value: boolean) {
    this.startProj = value;
    localStorage.setItem('startProj', JSON.stringify(value));
  }

  login(email: string, password: string) {
    const loginData = { email: email, password: password };
    return this.http.post(`${this.baseUrl}login`, loginData).pipe(
      map((response: any) => {
        console.log(response);
        const returnUser: ReturnUser = response as ReturnUser;
        console.log(returnUser);
        this.currentUserSubject.next(returnUser);
        console.log(this.currentUserSubject);
        localStorage.setItem('ReturnUser', JSON.stringify(returnUser));
        localStorage.setItem('email', email);
        this.userId = returnUser.userId;
        this.loggedIn = true;
        this.userRole = returnUser.userRole;
        this.currentEmail = email;

        return returnUser; // You can choose to return the modified object if needed
      })
    );
  }


  signUp(user: User) {
    return this.http.post(`${this.baseUrl}signup`, user);
  }

  verifyOtp(body : any){
    return this.http.post(`${this.baseUrl}verify`, body);
  }

  logout(){
    localStorage.clear();
    localStorage.removeItem('ReturnUser');
    this.currentUserSubject.next(null);
    this.stopRefreshTokenTimer();
    this.router.navigate(['']);
    this.userId = '';
    this.currentEmail = '';
    this.loggedIn = false;
  }

  sendForVerification(verifyEmail : string){
    const body = {
      email : verifyEmail
    }
    return this.http.post<any>(`${this.baseUrl}getOtp`, body);
  }

  forgotPassword(email : string){
    const body = {
      email : email
    }
    console.log(body);
    return this.http.post<any>(`${this.baseUrl}forgotPassword`, body);
  }

  resetPassword(password : string, token : string){
    const body = {
      token : token,
      newPassword : password
    }
    return this.http.post<any>(`${this.baseUrl}resetPassword`, body);

  }

  public get CurrentUserValue(): ReturnUser | null {
    return this.currentUserSubject.value;
  }

  googleSignIn(){
    console.log(`${this.baseUrl}auth/google`);
    return this.http.get<any>(`${this.baseUrl}auth/google`);
  }

  refreshToken(){
    return this.http.get<any>(`${this.baseUrl}refreshToken`)
    .pipe(
      map((response: any) => {
        console.log(response);
        const returnUser: ReturnUser = response as ReturnUser;
        this.currentUserSubject.next(returnUser);
        console.log(this.currentUserSubject);
        localStorage.setItem('ReturnUser', JSON.stringify(returnUser));
        return returnUser; // You can choose to return the modified object if needed
      }, error => {
        this.logout();
      })
    );
  }

  startRefreshTokenTimer(){
    clearTimeout(this.refreshTokenTimeout);
    console.log(this.CurrentUserValue?.accessExpiresIn);
    console.log(this.currentUserSubject.value!.accessExpiresIn)
    const expires = new Date(this.currentUserSubject.value!.accessExpiresIn)
    console.log(expires);
    const timeout = expires.getTime() - Date.now() - (120 * 1000);

  }

  private stopRefreshTokenTimer(){
    clearTimeout(this.refreshTokenTimeout);
  }

  sessionExpire(){
    if(localStorage.getItem('returnUser') == null){
      this.router.navigate(['auth/login']);
    }
  }
}
