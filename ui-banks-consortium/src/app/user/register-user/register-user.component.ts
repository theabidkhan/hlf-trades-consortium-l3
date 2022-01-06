import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../../service/api.service";
import {User} from "../../model/user.model";

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit 
{
  user:User[];
  constructor(private formBuilder: FormBuilder,private router: Router, private apiService: ApiService) { }
  
  registerForm: FormGroup;
  invalidRegister: boolean = false;

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
    userName: ['', Validators.required],
    bankName: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
    });
  }
  
  onSubmit() 
  {    
    if (this.registerForm.invalid) 
    {
      return;
    }

    const registerPayLoad = 
    {
      UserName: this.registerForm.controls.userName.value,
      Password:this.registerForm.controls.confirmPassword.value,
      BankName:this.registerForm.controls.bankName.value
    }

    const saveUserPayLoad = 
    {
      peers:[""],
      fcn:"RegisterUser" ,
      args:[""]
    }

    let bank=((this.registerForm.controls.bankName).value).toLowerCase();
    saveUserPayLoad.peers=["peer0."+bank+".banksconsortium.com","peer1."+bank+".banksconsortium.com"];
    
    let tableElem: HTMLElement = document.getElementById("table-register");
    tableElem.style.display="none";

    let loadingElem: HTMLElement = document.getElementById('register-container');
    loadingElem.style.backgroundImage = "url('/assets/loading.gif')";
    loadingElem.style.backgroundRepeat = "no-repeat";
    loadingElem.style.backgroundSize = "60px 60px";
    loadingElem.style.backgroundPosition= "center center";
    
    console.log(registerPayLoad);
    
    this.apiService.RegisterUser(registerPayLoad).subscribe(data => 
    {
      if(data.success) 
      {
        saveUserPayLoad.args[0]=data.UserID;//"args":["IDFC930067","IDFC","5000"]
        saveUserPayLoad.args[1]=(this.registerForm.controls.bankName).value;
        saveUserPayLoad.args[2]="5000";
        this.apiService.SaveUser(saveUserPayLoad).subscribe(data =>
        {
          if (data.success)
          {
            this.user=data.data.UserID;//console.log(data);
            loadingElem.style.backgroundSize = "0px 0px";
            tableElem.style.display="block";
            let elem: HTMLElement = document.getElementById('userID');
            elem.style.display="block";
            elem.style.color="white";
            console.log(data.message);            
          }
          else
          {
            this.invalidRegister = true;
            console.log(data.message);
          }

        });
      } 
      else 
      {
        this.invalidRegister = true;
        console.log(data.message);
      }
    });  
  }

  login():void
  {
    this.router.navigate(['login-user']);
  }
}