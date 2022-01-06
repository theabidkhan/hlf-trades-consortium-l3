import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../../service/api.service";
import {User} from "../../model/user.model";

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  users: User[];
  
  constructor(private formBuilder: FormBuilder,private router: Router, private apiService: ApiService) { }
  listUserForm: FormGroup;

  ngOnInit() 
  {
    this.listUserForm = this.formBuilder.group({      });
    const listUserPayLoad = 
    {
      peers:[""],
      fcn:"PublicRichQuery" ,
      args:[""]
    }

    listUserPayLoad.peers=
    [
      "peer0.idfc.banksconsortium.com",
      "peer1.idfc.banksconsortium.com",
      "peer0.hsbc.banksconsortium.com",
      "peer1.hsbc.banksconsortium.com",
      "peer0.idbi.banksconsortium.com",
      "peer1.idbi.banksconsortium.com"
    ];
    
    listUserPayLoad.args[0]="{\"selector\":{\"DocType\":\"user\"}}";      
    
    let elem: HTMLElement = document.getElementById('listUser-container');
    elem.style.backgroundImage = "url('/assets/loading.gif')";
    elem.style.backgroundRepeat = "no-repeat";
    elem.style.backgroundSize = "60px 60px";
    elem.style.backgroundPosition= "center center";
    

    this.apiService.AvailableUsers(listUserPayLoad).subscribe(data => 
    {
      console.log(data);
      if(data.success) 
      { 
        console.log(data.data);
        elem.style.backgroundSize = "0px 0px";
        this.users=data.data; 
        console.log(data.message);
      }
      else 
      {
        console.log(data.message);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['dashboard-user']);
  };
}
    



    
    

