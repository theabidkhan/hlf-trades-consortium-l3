
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../../service/api.service";

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})

export class LoginUserComponent implements OnInit 
{
  loginForm: FormGroup;
  invalidLogin: boolean = false;
  constructor(private formBuilder: FormBuilder,private router: Router, private apiService: ApiService) { }

  ngOnInit() 
  {
    this.loginForm = this.formBuilder.group({
      userID: ['', [Validators.required]],
      password:['', Validators.required]
    });
    localStorage.clear();
  }

  onSubmit() 
  {
    if (this.loginForm.invalid) 
    {
      return;
    }

    const loginPayLoad = 
    {
      UserID:this.loginForm.controls.userID.value,
      Password:this.loginForm.controls.password.value
    }

    let uid=(this.loginForm.controls.userID.value).toUpperCase();
    let tableElem: HTMLElement = document.getElementById("table-login");
    tableElem.style.display="none";

    let loadingElem: HTMLElement = document.getElementById('login-container');
    loadingElem.style.backgroundImage = "url('/assets/loading.gif')";
    loadingElem.style.backgroundRepeat = "no-repeat";
    loadingElem.style.backgroundSize = "60px 60px";
    loadingElem.style.backgroundPosition= "center center";
    
    this.apiService.LoginUser(loginPayLoad).subscribe(data => 
      {
        console.log(data);
        if(data.success) 
        {   
          loadingElem.style.height="300px";
          loadingElem.style.backgroundSize = "0px 0px";
          localStorage.clear();     
          localStorage.setItem('currentUser',uid);
          let currentUser=localStorage.getItem('currentUser');
          console.log("Curent User ID : "+currentUser);
          this.router.navigate(['dashboard-user']);
        }
        else 
        {
          loadingElem.style.backgroundSize = "0px 0px";
          tableElem.style.display="block";
          this.invalidLogin = true;
          console.log(data.message);
        }
      });
  }
  
  signUp():void{
    this.router.navigate(['register-user']);
  }

  reset():void {
    this.loginForm.reset();
}
}
