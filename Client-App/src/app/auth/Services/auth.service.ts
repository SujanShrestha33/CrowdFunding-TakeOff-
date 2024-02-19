import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/Models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const loginData = { email: email, password: password };
    return this.http.post(`${this.baseUrl}login`, loginData);
  }

  signUp(user: User) {
    return this.http.post(`${this.baseUrl}signup`, user);
  }
}
