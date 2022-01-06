import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../../service/api.service";
import {User} from "../../model/user.model";

@Component({
  selector: 'app-find-user',
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.css']
})
export class FindUserComponent implements OnInit {
  user: User[];
  invalidUser : boolean=false;
  constructor(private formBuilder: FormBuilder,private router: Router, private apiService: ApiService) { }
  findUserForm: FormGroup;

  ngOnInit() 
  {
    this.findUserForm = this.formBuilder.group(
      {
        userID: ['', Validators.compose([Validators.required])]
      });

     let elem: HTMLElement = document.getElementById('userDetails');
     elem.style.display="none";
  }
    

  onSubmit()
  {
    
    if (this.findUserForm.invalid) 
    {
      return;
    }
    
    const findUserPayLoad = 
    {
      peers:[""],
      fcn:"PublicRichQuery" ,
      args:[""]
    }
    findUserPayLoad.peers=
    [
      "peer0.idfc.banksconsortium.com",
      "peer1.idfc.banksconsortium.com",
      "peer0.hsbc.banksconsortium.com",
      "peer1.hsbc.banksconsortium.com",
      "peer0.idbi.banksconsortium.com",
      "peer1.idbi.banksconsortium.com"
    ];
    
    let userID=(this.findUserForm.controls.userID.value).toUpperCase();
    
    findUserPayLoad.args[0]="{\"selector\":{\"UserID\":\""+userID+"\"}}";
    
    console.log(findUserPayLoad); 

    this.apiService.FindUser(findUserPayLoad).subscribe(data => 
    {
      console.log(data);

      
      if(data.success) 
      {        
        console.log(data.data);
        this.user=data.data;  
        let elem: HTMLElement = document.getElementById('userDetails');
        elem.style.display="block";
      }
      else 
      {
        this.invalidUser = true;
        console.log(data.message);
      }
    });

  }
  goBack(): void {
    this.router.navigate(['dashboard-user']);
  };

}
