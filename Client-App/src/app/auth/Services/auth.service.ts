import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, tap } from 'rxjs';
import { ReturnUser } from 'src/app/Models/returnUser';
import { User } from 'src/app/Models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = 'http://localhost:8080/';
  private refreshTokenTimeout : any;
  public currentUserSubject = new BehaviorSubject<ReturnUser | null>(null);
  currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router : Router) {
    const storedUserString = localStorage.getItem('ReturnUser');

  if (storedUserString) {
    const storedUser: ReturnUser = JSON.parse(storedUserString);
    console.log(storedUser);
    this.currentUserSubject.next(storedUser);
    console.log(this.currentUserSubject);
  }
  // this.startRefreshTokenTimer();
  }

  login(email: string, password: string) {
    const loginData = { email: email, password: password };
    return this.http.post(`${this.baseUrl}login`, loginData).pipe(
      map((response: any) => {
        console.log(response);
        const returnUser: ReturnUser = response as ReturnUser;
        this.currentUserSubject.next(returnUser);
        console.log(this.currentUserSubject);
        localStorage.setItem('ReturnUser', JSON.stringify(returnUser));
        localStorage.setItem('email', email);
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
    return this.http.post<any>(`${this.baseUrl}refresh-token`, this.CurrentUserValue)
    .pipe(
      map((response: any) => {
        console.log(response);
        const returnUser: ReturnUser = response as ReturnUser;
        this.currentUserSubject.next(returnUser);
        console.log(this.currentUserSubject);
        localStorage.setItem('ReturnUser', JSON.stringify(returnUser));
        return returnUser; // You can choose to return the modified object if needed
      })
    );
  }

  startRefreshTokenTimer(){
    clearTimeout(this.refreshTokenTimeout);
    console.log(this.CurrentUserValue?.expiresIn);
    console.log(this.currentUserSubject.value!.expiresIn)
    const expires = new Date(this.currentUserSubject.value!.expiresIn)
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
