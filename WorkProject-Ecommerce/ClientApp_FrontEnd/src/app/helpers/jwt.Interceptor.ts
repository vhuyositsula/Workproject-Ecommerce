import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { RegistrationService } from '../services/registration.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class JwtInterceptor implements HttpInterceptor {

    constructor (private acct : RegistrationService) {}

    intercept(request : HttpRequest<any>, next : HttpHandler): Observable<HttpEvent<any>> 
    {
        // add authorization header with jwt token if available
        let currentuser = this.acct.isLoggesIn;
        let token = localStorage.getItem('jwt');

        if (currentuser && token !== undefined) 
        {
            request = request.clone({
                setHeaders: 
                {
                     Authorization: `Bearer ${token}` 
                    
                }
            });
        }

        return next.handle(request);
    }
}