import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {routing} from "./app.routing";
import {ReactiveFormsModule} from "@angular/forms";
import {ApiService} from "./service/api.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenInterceptor} from "./core/interceptor";

import { RegisterUserComponent } from './user/register-user/register-user.component';
import { LoginUserComponent } from './user/login-user/login-user.component';
import { DashboardUserComponent } from './user/dashboard-user/dashboard-user.component';
import { FindUserComponent } from './user/find-user/find-user.component';
import { InitiateTradeComponent } from './trade/initiate-trade/initiate-trade.component';
import { FindTradeComponent } from './trade/find-trade/find-trade.component';
import { ListBanksComponent } from './bank/list-banks/list-banks.component';
import { FindBankComponent } from './bank/find-bank/find-bank.component';
import { ListUsersComponent } from './user/list-users/list-users.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterUserComponent,
    LoginUserComponent,
    DashboardUserComponent,
    FindUserComponent,
    InitiateTradeComponent,
    FindTradeComponent,
    ListBanksComponent,
    FindBankComponent,
    ListUsersComponent
    
  ],
  imports: [
    BrowserModule,
    routing,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ApiService, {provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi : true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
