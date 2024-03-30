import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrl: string = environment.baseUrl;

  constructor(
    private http : HttpClient
  ) { }

  getProfile(){
    return this.http.get(`${this.baseUrl}profile/my`);
  }

  editProfile(body : any){
    return this.http.post(`${this.baseUrl}profile/my/update`, body);
  }


}
