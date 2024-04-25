import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable, Query } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
// import { UrlService } from './url.service';
import { state } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/Services/auth.service';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
  modifiedError : any;
  _state: RouterStateSnapshot;
  constructor(
    private router: Router,
    private toastr : ToastrService,
    private authService : AuthService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if(this.authService.loggedIn){

        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login'], { queryParams: { returnUrl: window.location.href.substring(2) } });
        }
      }
      // console.log(error);
      return throwError(err);
    }));
  }
}
