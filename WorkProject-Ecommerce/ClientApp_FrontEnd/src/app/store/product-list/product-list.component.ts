import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Product } from '../../interfaces/product';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { SharedService } from '../../services/shared.service';
import { Ialert } from '../../interfaces/ialert';
import { ProductDisplay } from 'src/app/interfaces/product-display';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers:[ProductService]
})
    export class ProductListComponent implements OnInit, OnDestroy{
        
      public alerts: Array<Ialert> = [];
      trolleyItemCount: number = 0;
      @Output() cartEvent = new EventEmitter<number>();
      public globalResponse: any;
      yourByteArray:any;
      allProducts: ProductDisplay[];
      productAddedToTrolley:Product[];

        onLogout() 
        {
          // this.productservice.clearCache();
           this.acct.logout();
        }

    // For the FormControl - Adding products
    insertForm: FormGroup;
    name: FormControl;
    price: FormControl;
    description: FormControl;
    imgUrl:  FormControl;
    quantity: FormControl;

    // Updating the Product
     updateForm: FormGroup;
    _name: FormControl;
    _price: FormControl;
    _description: FormControl;
    _imgUrl:  FormControl;
    _id: FormControl;
    _quantity: FormControl;


    // Add Modal
    @ViewChild('template',{static:true}) modal : TemplateRef<any>;

    // Update Modal
    @ViewChild('editTemplate',{static:false}) editmodal : TemplateRef<any>;


    // Modal properties
    modalMessage : string;
    modalRef : BsModalRef;
    selectedProduct : Product;
    products$ : Observable<Product[]>;
    products : Product[] = [];
    userRoleStatus : string;


    // Datatables Properties
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    @ViewChild(DataTableDirective,{static:true}) dtElement: DataTableDirective;




    constructor(private productservice : ProductService,
        private modalService: BsModalService,
        private fb: FormBuilder,
        private chRef : ChangeDetectorRef,
        private router: Router,
        private acct: RegistrationService,
        private sharedService : SharedService) { }

    LoginStatus$ : Observable<boolean>;

    UserName$ : Observable<string>;

    /// Load Add New product Modal
    onAddProduct() 
    {
        this.modalRef = this.modalService.show(this.modal);
    }

      // Method to Add new Product
    onSubmit() 
    {
        let newProduct = this.insertForm.value;

        this.productservice.insertProduct(newProduct).subscribe(
            result => 
            {
                this.productservice.clearCache();
                this.products$ = this.productservice.getProducts();

                    this.products$.subscribe(newlist => {
                    this.products = newlist;
                    this.modalRef.hide();
                    this.insertForm.reset();
                   // this.rerender();
                
                    });
                console.log("New Product added");

            },
            error => console.log('Could not add Product')
              
            )

    }

    // We will use this method to destroy old table and re-render new table

    /*rerender() 
    {
        this.dtElement.dtInstance.then((dtInstance : DataTables.Api) => 
        {
            // Destroy the table first in the current context
            dtInstance.destroy();

            // Call the dtTrigger to rerender again
           this.dtTrigger.next();

        });
    }*/

    // Update an Existing Product
    onUpdate() 
    {
        let editProduct = this.updateForm.value;
        this.productservice.updateProduct(editProduct.id, editProduct).subscribe(
        result => 
        {
            console.log('Product Updated');
            this.productservice.clearCache();
            this.products$ = this.productservice.getProducts();
            this.products$.subscribe(updatedlist => 
             { 
                this.products = updatedlist; 
 
                  this.modalRef.hide();
                  //this.rerender();
            });
        },
            error => console.log('Could Not Update Product')
        )
    }

    // Load the update Modal

    onUpdateModal(productEdit: Product) : void
    {
        this._id.setValue(productEdit.productId);
        this._name.setValue(productEdit.name);
        this._price.setValue(productEdit.price);
        this._description.setValue(productEdit.description);
        this._imgUrl.setValue(productEdit.imgUrl);
        this._quantity.setValue(productEdit.quantity);

        this.updateForm.setValue({
            'id' : this._id.value,
            'name' : this._name.value,
            'price' :  this._price.value,
            'description' : this._description.value,
            'imgUrl' : this._imgUrl.value,
            'outOfStock' : true,
            'quantity' : this._quantity
         });

        this.modalRef = this.modalService.show(this.editmodal);

    }

    // Method to Delete the product
    onDelete(product : Product) : void
    {
        this.productservice.deleteProduct(product.productId).subscribe(result => 
        {
            this.productservice.clearCache();
            this.products$ = this.productservice.getProducts();
            this.products$.subscribe(newlist => 
            {
                this.products = newlist;

               //this.rerender();
            })
        })
    }

    //Add to Trolley method 

    onSelect(product: Product) : void 
    {
       this.selectedProduct = product;

       this.router.navigateByUrl("/products/" + product.productId);
    }
    onTrolley() 
    {
       this.router.navigateByUrl("/trolley");
    }
    
 
   
    ngOnInit() {

        this.LoginStatus$ = this.acct.isLoggesIn;

        this.UserName$ = this.acct.currentUserName;

        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 9,
            autoWidth: true,
            order: [[0, 'desc']]
            };

        this.products$ = this.productservice.getProducts();

        this.products$.subscribe(result => { 
            this.products = result; 

            this.chRef.detectChanges();

            this.dtTrigger.next();
        });
        

        //deppcart
        this.sharedService.currentMessage.subscribe(msg => this.trolleyItemCount = msg);

        this.productservice.getAllProducts()
        .subscribe((result) => {
          this.globalResponse = result;              
        },
        error => { //This is error part
          console.log(error.message);
        },
        () => {
            //  This is Success part
            console.log("Product fetched sucssesfully.");
            //console.log(this.globalResponse);
            this.allProducts=this.globalResponse;
            }
          )

       this.acct.currentUserRole.subscribe(result => {this.userRoleStatus = result});


        // Modal Message
        this.modalMessage = "All Fields Are Mandatory";

        // Initializing Add product properties

        //let validateImgUrl: string = '^(https?:\/\/.*\.(?:png|jpg))$';

        this.name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
        this.price = new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]);
        this.description = new FormControl('', [Validators.required, Validators.maxLength(150)]);
        this.imgUrl = new FormControl();
        this.quantity = new FormControl();
        
        this.insertForm = this.fb.group({

                'name' : this.name,
                'price' : this.price,
                'description' : this.description,
                'imgUrl' : this.imgUrl,
                'outOfStock' : true,
                'quantity' : this.quantity
        
                });

        // Initializing Update Product properties
        this._name = new FormControl('',[Validators.required, Validators.maxLength(50)]); 
        this._price = new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]);
        this._description = new FormControl('', [Validators.required, Validators.maxLength(150)]);
        this._imgUrl = new FormControl();
        this._id = new FormControl();
        this._quantity = new FormControl();

        this.updateForm = this.fb.group(
            {
                'id' : this._id,
                'name' : this._name,
                'price' : this._price,
                'description' : this._description,
                'imgUrl' : this._imgUrl,
                'outOfStock' : true,
                'quantity': this._quantity

            });


    }
    OnAddTrolley(product:Product)
    {
      console.log(product);
      
      this.productAddedToTrolley=this.productservice.getProductFromTrolley();
      if(this.productAddedToTrolley==null)
      {
        this.productAddedToTrolley=[];
        this.productAddedToTrolley.push(product);
        this.productservice.addProductToTrolley(this.productAddedToTrolley);
        this.alerts.push({
          id: 1,
          type: 'success',
          message: 'Product added to cart.'
        });
        setTimeout(()=>{   
          this.closeAlert(this.alerts);
     }, 3000);

      }
      else
      {
        let tempProduct=this.productAddedToTrolley.find(p=>p.productId==product.productId);
        if(tempProduct==null)
        {
          this.productAddedToTrolley.push(product);
          this.productservice.addProductToTrolley(this.productAddedToTrolley);
          this.alerts.push({
            id: 1,
            type: 'success',
            message: 'Product added to cart.'
          });
          //setTimeout(function(){ }, 2000);
          setTimeout(()=>{   
            this.closeAlert(this.alerts);
       }, 3000);
        }
        else
        {
          this.alerts.push({
            id: 2,
            type: 'warning',
            message: 'Product already exist in cart.'
          });
          setTimeout(()=>{   
            this.closeAlert(this.alerts);
       }, 3000);
        }
        
      }
      console.log(this.trolleyItemCount);
      this.trolleyItemCount=this.productAddedToTrolley.length;
      // this.cartEvent.emit(this.cartItemCount);
      this.sharedService.updateTrolleyCount(this.trolleyItemCount);
    }
    public closeAlert(alert:any) {
      const index: number = this.alerts.indexOf(alert);
      this.alerts.splice(index, 1);
  }   
     ngOnDestroy() 
    {
        // Do not forget to unsubscribe
        this.dtTrigger.unsubscribe();
    }

}
