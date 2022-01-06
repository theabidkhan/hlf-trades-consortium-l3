import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Event, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showLoadingIndicator=true;
  constructor(private formBuilder: FormBuilder,private router: Router) {   }
  appForm: FormGroup;
  title = 'Banks Consortium';
  
  
  logout(): void {
    
    if ( localStorage.getItem('currentUser')==null)
    {
      alert("Please login first");
      this.router.navigate(['login-user']);
    }
    else
    {
      alert("Logged Out Successfully.");
      localStorage.clear();
      this.router.navigate(['login-user']);
    }
   
  };
}
