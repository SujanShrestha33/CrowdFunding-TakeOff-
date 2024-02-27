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
  }
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
  }

  // refreshToken()

  // startRefreshTokenTimer(){
  //   let expires : any;
  //   let currentDate : any;

  //   clearTimeout(this.refreshTokenTimeout);

  //   if(this.currentUserSubject == null){
  //     // currentDate =
  //     expires = Date.now()
  //   }else{
  //     // currentDate =
  //     expires = Date.now()

  //   }
  //   const timeout = expires.getTime() - Date.now() - (120 * 1000);
  //   this.refreshTokenTimeout = setTimeout(() => this.refreshTokenTimeout().subscribe(), timeout)
  // }

  // private stopRefreshTokenTimer() {
  //   clearTimeout(this.refreshTokenTimeout);
  // }

  // sessionExpire() {
  //   if (localStorage.getItem("token") == null) {
  //     this.router.navigateByUrl("/");
  //   }
  //   // console.log('expired');
  // }

}
