import { Injectable } from '@angular/core';
//can take token via http request
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Product } from '../interfaces/product';
import { flatMap, first, shareReplay, map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})


    export class ProductService {

    constructor(private http : HttpClient) { }

    private baseUrl: string = "https://localhost:44342/api/Product/GetProducts";

    private productUrl : string = "https://localhost:44342/api/Product/AddProduct";

    private deleteUrl: string = "https://localhost:44342/api/Product/DeleteProduct/";

    private updateUrl: string = "https://localhost:44342/api/Product/UpdateProduct/";

    private product$: Observable<Product[]>;


//deepcart
    getAllProducts() 
    {
        return this.http.get(this.baseUrl)
        .pipe(
          map(res => res),
           catchError( this.errorHandler)
          );

    }
    
    getProducts() : Observable<Product[]> 
    {
        if (!this.product$) 
        {
            this.product$ = this.http.get<Product[]>(this.baseUrl).pipe(shareReplay());
        }

         // if products cache exists return it
        return this.product$;

    }

    // Get Product by its ID
    getProductById(id: number) : Observable<Product> 
    {
        return this.getProducts().pipe(flatMap(result => result), first(product => product.productId == id));
    }

    // Insert the Product
    insertProduct(newProduct : Product) :  Observable<Product> 
    {
        return this.http.post<Product>(this.productUrl, newProduct);
    }

    // Update the Product

    updateProduct(id: number, editProduct : Product) : Observable<Product>
    {
        return this.http.put<Product>(this.updateUrl + id, editProduct);
    }

    // Delete Product

    deleteProduct(id: number) : Observable<any>
    {
        return this.http.delete(this.deleteUrl + id);
    }


    // Clear Cache
    clearCache() 
    {
        this.product$ = null;
    }
 
  addProductToTrolley(prodcuts: any) {
    localStorage.setItem("product", JSON.stringify(prodcuts));
  }
  getProductFromTrolley() {
    //return localStorage.getItem("product");
    return JSON.parse(localStorage.getItem('product'));
  }
  
  removeAllProductFromTrolley() {
    return localStorage.removeItem("product");
  }
  errorHandler(error: Response) {  
    console.log(error);  
    return throwError(error);  
} 
}
