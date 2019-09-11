import { Injectable } from '@angular/core';

import { AuthGuardService } from './auth-guard.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { OrderDetail } from '../interfaces/order-detail';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public apiURL:string="https://localhost:44342/api/OrderDetails/PostOrderDetail";
  constructor(private httpClient:HttpClient,private http : HttpClient) { }

  PlaceOrder (orderDetail:OrderDetail)
  {
    
    return this.http.post<OrderDetail>(this.apiURL, orderDetail).pipe(
      map(res => res),
        catchError( this.errorHandler)
     );

  }
 
  errorHandler(error: Response) {  
    console.log(error);  
    return throwError(error);  
} 
}
