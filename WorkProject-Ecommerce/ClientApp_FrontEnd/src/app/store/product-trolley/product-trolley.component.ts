import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RegistrationService } from 'src/app/services/registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Observable } from 'rxjs';
import  {Product } from '../../interfaces/product';
import { Ialert } from '../../interfaces/ialert';
import {AuthGuardService } from '../../services/auth-guard.service'
import { OrderService } from 'src/app/services/order.service';
import { OrderDetail } from 'src/app/interfaces/order-detail';
import { OrderItem } from 'src/app/interfaces/order-item';


@Component({
  selector: 'app-product-trolley',
  templateUrl: './product-trolley.component.html',
  styleUrls: ['./product-trolley.component.css']
})

export class ProductTrolleyComponent implements OnInit {
  dafualtQuantity:number=1;
  productAddedToTrolley:Product[];
  allTotal:number;
  //currentUser: Registration[];
  orderDetail:OrderDetail;
  orderItem:OrderItem[];

  public globalResponse: any;
  public alerts: Array<Ialert> = [];

  deliveryForm:FormGroup;



  onLogout() 
  {
      // this.productservice.clearCache();
        this.acct.logout();
   }

  constructor(private acct: RegistrationService,
              private router : Router, 
              private productservice: ProductService,
              private fb: FormBuilder,
              private authService:AuthGuardService,
              private orderService:OrderService) { }

   LoginStatus$ : Observable<boolean>;
   UserName$ : Observable<string>;  

   backToStore() 
   {
     this.router.navigateByUrl("/products");
   }

  ngOnInit() {

    this.LoginStatus$ = this.acct.isLoggesIn;
    this.UserName$ = this.acct.currentUserName;

    this.productAddedToTrolley=this.productservice.getProductFromTrolley();
    for (let i in this.productAddedToTrolley) {
           this.productAddedToTrolley[i].quantity=1;
   }

   this.productservice.removeAllProductFromTrolley();
   this.productservice.addProductToTrolley(this.productAddedToTrolley);
   this.calculteAllTotal(this.productAddedToTrolley);
   
   this.deliveryForm = this.fb.group({
    UserName:  ['', [Validators.required]],
    DeliveryAddress:['',[Validators.required]],
    Phone:['',[Validators.required]],
    Email:['',[Validators.required]],
    Message:['',[]],
    Amount:['',[Validators.required]],

  });

  
  this.deliveryForm.controls['Amount'].setValue(this.allTotal);
   
  }

  onAddQuantity(product:Product)
  {
    //Get Product
    this.productAddedToTrolley=this.productservice.getProductFromTrolley();
    this.productAddedToTrolley.find(p=>p.productId==product.productId).quantity = product.quantity+1;
    this.productservice.removeAllProductFromTrolley();
    this.productservice.addProductToTrolley(this.productAddedToTrolley);
    this.calculteAllTotal(this.productAddedToTrolley);
    this.deliveryForm.controls['Amount'].setValue(this.allTotal);
   
  }

  onRemoveQuantity(product:Product)
  {
    this.productAddedToTrolley=this.productservice.getProductFromTrolley();
    this.productAddedToTrolley.find(p=>p.productId==product.productId).quantity = product.quantity-1;
    this.productservice.removeAllProductFromTrolley();
    this.productservice.addProductToTrolley(this.productAddedToTrolley);
    this.calculteAllTotal(this.productAddedToTrolley);
    this.deliveryForm.controls['Amount'].setValue(this.allTotal);

  }

  calculteAllTotal(allItems:Product[])
  {
    let total=0;
    for (let i in allItems) {
      total= total+(allItems[i].quantity *allItems[i].price);
   }
   this.allTotal=total;
  }

  ConfirmOrder()
  {
    const date: Date = new Date();
    var id=this.acct.currentUserid;
    var name=this.deliveryForm.controls['UserName'].value;
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var minutes = date.getMinutes();
    var hours = date.getHours();
    var seconds = date.getSeconds();
    var dateTimeStamp=day.toString()+monthIndex.toString()+year.toString()+minutes.toString()+hours.toString()+seconds.toString();
    let orderDetail:any={};
    
    //Orderdetail is object which hold all the value, which needs to be saved into database
    
    orderDetail.CustomerName=this.deliveryForm.controls['UserName'].value;
    orderDetail.DeliveryAddress=this.deliveryForm.controls['DeliveryAddress'].value;
    orderDetail.Phone=this.deliveryForm.controls['Phone'].value;

    orderDetail.PaymentRefrenceId=id+"-"+name+dateTimeStamp;
    orderDetail.OrderPayMethod="Cash On Delivery";
    
    //Assigning the ordered item details
    this.orderItem=[];
    for (let i in this.productAddedToTrolley) {
      this.orderItem.push({
        ID:0,
        ProductID:this.productAddedToTrolley[i].productId,
        ProductName:this.productAddedToTrolley[i].name,
        OrderedQuantity:this.productAddedToTrolley[i].quantity,
        PerUnitPrice:this.productAddedToTrolley[i].price,
        OrderID:0,
      }) ;
   }
     
    orderDetail.OrderItems=this.orderItem;

    this.orderService.PlaceOrder(orderDetail)
            .subscribe((result) => {
              this.globalResponse = result;              
            },
            error => { //This is error part
              console.log(error.message);
              this.alerts.push({
                id: 2,
                type: 'danger',
                message: 'Something went wrong while placing the order, Please try after sometime.'
              });
            },
            () => {
                //  This is Success part
                //console.log(this.globalResponse);
                this.alerts.push({
                  id: 1,
                  type: 'success',
                  message: 'Order has been placed succesfully.',
                });
                
                }
              )

  }
  public closeAlert(alert: Ialert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
} 

}
