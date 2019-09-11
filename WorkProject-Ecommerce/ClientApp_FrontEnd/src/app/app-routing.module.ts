import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AccessDeniedComponent } from './errors/access-denied/access-denied.component';

import { AuthGuardService } from './services/auth-guard.service';
import { ProductTrolleyComponent } from './store/product-trolley/product-trolley.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
      {path: "home", component: HomeComponent},
      {path: '', component: HomeComponent, pathMatch: 'full'},
      {path: "products", loadChildren: './store/store.module#StoreModule'},
      {path: 'login', component: LoginComponent },
      {path: 'registration', component: RegistrationComponent },
      {path: 'access-denied', component: AccessDeniedComponent },
      {path: 'trolley', component: ProductTrolleyComponent },
      {path: '**', redirectTo: '/home'}
      ])],
 
  exports: [RouterModule]
})
export class AppRoutingModule { }
