import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/Services/auth.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AuthService){}

 intercept(
    request: HttpRequest<any>,
    next: HttpHandler
    ): Observable<HttpEvent<any>> {

      const token = this.accountService.currentUser.subscribe((res) => {
        return res?.accessToken;
      });

      // console.log(token);
      if(token){
        request = request.clone({
          setHeaders :{
            Authorization:`Bearer ${token}`
          }
        })
      }
      // console.log(request);
     return next.handle(request);
 }
}
