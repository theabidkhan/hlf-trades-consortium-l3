import { RouterModule, Routes } from '@angular/router';

import { RegisterUserComponent } from './user/register-user/register-user.component';
import { LoginUserComponent } from './user/login-user/login-user.component';
import { DashboardUserComponent } from './user/dashboard-user/dashboard-user.component';
import { FindUserComponent } from './user/find-user/find-user.component';
import { InitiateTradeComponent } from './trade/initiate-trade/initiate-trade.component';
import { FindTradeComponent } from './trade/find-trade/find-trade.component';
import { ListBanksComponent } from './bank/list-banks/list-banks.component';
import { FindBankComponent } from './bank/find-bank/find-bank.component';
import { ListUsersComponent } from './user/list-users/list-users.component';




const routes: Routes = [
  {path : '', component : RegisterUserComponent},
  { path: 'register-user', component: RegisterUserComponent },
  { path: 'login-user', component: LoginUserComponent },
  { path: 'dashboard-user', component: DashboardUserComponent },
  { path: 'find-user', component: FindUserComponent },
  { path: 'list-users', component: ListUsersComponent },
  { path: 'initiate-trade', component: InitiateTradeComponent },
  { path: 'find-trade', component: FindTradeComponent },
  { path: 'list-banks', component: ListBanksComponent },
  { path: 'find-bank', component: FindBankComponent }
];

export const routing = RouterModule.forRoot(routes);
