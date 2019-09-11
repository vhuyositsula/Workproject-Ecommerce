import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { AccessDeniedComponent } from './errors/access-denied/access-denied.component';
import { JwtInterceptor } from './helpers/jwt.Interceptor';
import { AuthGuardService } from './services/auth-guard.service';
import { ProductTrolleyComponent } from './store/product-trolley/product-trolley.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    AccessDeniedComponent,
    ProductTrolleyComponent 
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    DataTablesModule ,
    NgbModule
    
  ],
  providers: [
    AuthGuardService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
