import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from '../../../node_modules/ngx-bootstrap/modal';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',

})



export class RegistrationComponent implements OnInit {

    constructor(
          private fb: FormBuilder,
          private acct: RegistrationService,
          private router: Router,
          private modalService : BsModalService
          ) { }

    // Properties
    insertForm: FormGroup;
    username: FormControl;
    firstname: FormControl;
    surname: FormControl;
    email: FormControl;
    phone: FormControl;
    password: FormControl;
    cpassword: FormControl;
    modalRef : BsModalRef;
    errorList: string[];
    modalMessage : string;
    regodal: boolean;   
    

    test: any[] = [];

    
  @ViewChild('template', {static:false}) modal : TemplateRef<any>;

    onSubmit() 
    {

        let userDetails = this.insertForm.value;

        this.acct.register(userDetails.username,userDetails.firstname, userDetails.surname, userDetails.password,userDetails.email, userDetails.phone).subscribe(result => 
        {
            this.router.navigate(['/login']);
        }, error => 
        {
           
            this.errorList = [];

            for(var i = 0; i < error.error.value.length; i++) 
            {
              this.errorList.push(error.error.value[i]);
              //console.log(error.error.value[i]);
            }

            console.log(error)
            this.modalMessage = "Your Registration Was Unsuccessful";
           this.modalRef =  this.modalService.show(this.modal)
        });




    }

    // Custom Validator

    MustMatch(passwordControl : AbstractControl) : ValidatorFn
    {
        return (cpasswordControl : AbstractControl) : {[key: string] : boolean } | null   => 
        {
            // return null if controls haven't initialised yet
            if(!passwordControl && !cpasswordControl) 
            {
                return null;
          }

            // return null if another validator has already found an error on the matchingControl
            if (cpasswordControl.hasError && !passwordControl.hasError) 
            {
                return null;
            } 
            // set error on matchingControl if validation fails
            if(passwordControl.value !== cpasswordControl.value) 
            {
                return { 'mustMatch': true };
            }
            else {
                return null;
            }

        }
        

    }


    ngOnInit() {

         this.username = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
         this.firstname = new FormControl('',[Validators.required]);
         this.surname = new FormControl('',[Validators.required]);
         this.password = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
         this.cpassword = new FormControl('',[Validators.required, this.MustMatch(this.password)]);
         this.email = new FormControl('', [Validators.required, Validators.email]);
         this.phone = new FormControl('',[Validators.required]);
         this.errorList = [];


        this.insertForm = this.fb.group(
        {
                'username': this.username,
                'firstname' : this.firstname,
                'surname' : this.surname,
                'email': this.email,
                'phone' : this.phone,
                'password': this.password,
                'cpassword': this.cpassword
                
        });
  }


     
}
