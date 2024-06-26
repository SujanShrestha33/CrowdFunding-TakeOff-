import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalModule } from 'ngx-bootstrap/modal';
import { JwtInterceptor } from './Helper/jwt.interceptor';
import { SharedComponent } from './shared/shared.component';
import { NavBarComponent } from './Shared Component/nav-bar/nav-bar.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { InnerNavbarComponent } from './Shared Component/inner-navbar/inner-navbar.component';
import { MainComponent } from './main/main.component';
import { DatePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgChartsModule } from 'ng2-charts';
import { ErrorInterceptor } from './Helper/error.interceptor';
import { FooterComponent } from './Shared Component/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SharedComponent,
    NavBarComponent,
    InnerNavbarComponent,
    MainComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FontAwesomeModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgSelectModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right' // Configure toastr to appear at the bottom right
    }),
    CarouselModule,
    NgChartsModule,

  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },{
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  }, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
