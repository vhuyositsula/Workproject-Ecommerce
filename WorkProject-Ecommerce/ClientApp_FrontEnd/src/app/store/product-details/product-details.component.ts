import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { Observable } from 'rxjs';
import { RegistrationService } from 'src/app/services/registration.service';



@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})

export class ProductDetailsComponent implements OnInit {
     
  onLogout() 
  {
      // this.productservice.clearCache();
        this.acct.logout();
   }
   
    @Input() product : Product;

    constructor(private acct: RegistrationService,
                 private route: ActivatedRoute, 
                 private router : Router, 
                  private productservice: ProductService, ) { }

   LoginStatus$ : Observable<boolean>;
   UserName$ : Observable<string>;            
   
   backToStore() 
   {
     this.router.navigateByUrl("/products");
   }

    ngOnInit() {
    
    this.LoginStatus$ = this.acct.isLoggesIn;
    this.UserName$ = this.acct.currentUserName;

    let id = + this.route.snapshot.params['id'];

    this.productservice.getProductById(id).subscribe(result => this.product = result);
  }

}
