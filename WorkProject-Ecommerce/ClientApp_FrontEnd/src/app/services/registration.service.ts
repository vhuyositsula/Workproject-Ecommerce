import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";
import { decode } from 'punycode';

/*
 * The @Injectable decorator has been applied to the AccountService class. 
 * This decorator is used to tell Angular that this class will be used as a service,  
 * by doing this other classes are allowed to access the functionality of our account service class through a feature called dependency injection. 
*/ 

@Injectable({
  providedIn: 'root'
})

 export class RegistrationService {

    // Need HttpClient to communicate over HTTP with Web API
    constructor(private http : HttpClient, private router : Router) { }

    // Url to access our Web API’s
    private baseUrlLogin : string = "https://localhost:44342/api/Account/Login";

    private baseUrlRegister : string = "https://localhost:44342/api/Account/Register";

    // User related properties
    private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
    private UserName    = new BehaviorSubject<string>(localStorage.getItem('username'));
    private UserRole    = new BehaviorSubject<string>(localStorage.getItem('userRole'));
    private UserId  =new BehaviorSubject<string>(localStorage.getItem('userId'));
    private Email    = new BehaviorSubject<string>(localStorage.getItem('email'));
    private Phone   = new BehaviorSubject<string>(localStorage.getItem('phone'));
    // Register Method

    register(username: string, firstname: string, surname: string, password: string, email : string, phone : string ) 
    {
        return this.http.post<any>(this.baseUrlRegister, {username,firstname, surname, email, phone, password}).pipe(map(result => {
            //registration was successful
            return result;
        
        }, error => 
        {
            return error;
        }));
    }


    //Login Method
    login(username: string, password: string) 
    {
        // pipe() let you combine multiple functions into a single function. 
        // pipe() runs the composed functions in sequence.
        return this.http.post<any>(this.baseUrlLogin, {username, password}).pipe(


            map(result => {

                // login successful if there's a jwt token in the response
                if(result && result.token) 
                {
                      // store user details and jwt token in local storage to keep user logged in between page refreshes

                    this.loginStatus.next(true);
                    localStorage.setItem('loginStatus', '1');
                    localStorage.setItem('jwt', result.token);
                    localStorage.setItem('username', result.userName);
                    localStorage.setItem('expiration', result.expiration);
                    localStorage.setItem('userRole', result.userRole);
                    localStorage.setItem('userId',result.userId);
                    localStorage.setItem('email',result.email);
                    localStorage.setItem('phone',result.phone);
                    this.UserName.next(localStorage.getItem('username'));
                    this.UserRole.next(localStorage.getItem('userRole'));
                    this.UserId.next(localStorage.getItem('userId'));
                    this.Email.next(localStorage.getItem('email'));
                    this.Phone.next(localStorage.getItem('phone'));


                }

                 return result;

            })
              
            );
    }

    logout() 
    {
        // Set Loginstatus to false and delete saved jwt cookie
        this.loginStatus.next(false);
        localStorage.removeItem('jwt');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('expiration');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        localStorage.setItem('loginStatus', '0');
        this.router.navigate(['/login']);
        console.log("Logged Out Successfully");

    }




    checkLoginStatus() : boolean 
    {
      
        var loginCookie = localStorage.getItem("loginStatus");

        if(loginCookie == "1") 
        {
            if(localStorage.getItem('jwt') === null || localStorage.getItem('jwt') === undefined) 
            {
                return false;
            }

             // Get and Decode the Token
             const token = localStorage.getItem('jwt');
             const decoded = jwt_decode(token);
            // Check if the cookie is valid

            if(decoded.exp === undefined) 
            {
                return false;
            }

            // Get Current Date Time
            const date = new Date(0);

             // Convert EXp Time to UTC
            let tokenExpDate = date.setUTCSeconds(decoded.exp);

            // If Value of Token time greter than 

            if(tokenExpDate.valueOf() > new Date().valueOf()) 
            {
                return true;
            }

            console.log("NEW DATE " + new Date().valueOf());
            console.log("Token DATE " + tokenExpDate.valueOf());

            return false;
          
        }
        return false;
    }




    get isLoggesIn() 
    {
        return this.loginStatus.asObservable();
    }

    get currentUserName() 
    {
        return this.UserName.asObservable();
    }

   get currentUserRole() 
    {
        return this.UserRole.asObservable();
    }
    
    get currentUserid()
    {
        return this.UserId.asObservable();
    }

    get currentUserEmail()
    {
        return this.Email.asObservable();
    }

    get currentUserPhone()
    {
        return this.Phone.asObservable();
    }

}
