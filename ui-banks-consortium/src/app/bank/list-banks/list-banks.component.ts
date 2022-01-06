
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../../service/api.service";
import {Bank} from "../../model/bank.model";

@Component({
  selector: 'app-list-banks',
  templateUrl: './list-banks.component.html',
  styleUrls: ['./list-banks.component.css']
})
export class ListBanksComponent implements OnInit {
  banks: Bank[];
  
  constructor(private formBuilder: FormBuilder,private router: Router, private apiService: ApiService) { }
  listBankForm: FormGroup;

  ngOnInit() 
  {
    this.listBankForm = this.formBuilder.group({      });

    const listBankPayLoad = 
    {
      peers:[""],
      fcn:"PublicRichQuery" ,
      args:[""]
    }

    listBankPayLoad.peers=
    [
      "peer0.idfc.banksconsortium.com",
      "peer1.idfc.banksconsortium.com",
      "peer0.hsbc.banksconsortium.com",
      "peer1.hsbc.banksconsortium.com",
      "peer0.idbi.banksconsortium.com",
      "peer1.idbi.banksconsortium.com"
    ];
    
    listBankPayLoad.args[0]="{\"selector\":{\"DocType\":\"bank\"}}";    
    console.log(listBankPayLoad);
    
    let loadingElem: HTMLElement = document.getElementById('listBank-container');
    loadingElem.style.backgroundImage = "url('/assets/loading.gif')";
    loadingElem.style.backgroundRepeat = "no-repeat";
    loadingElem.style.backgroundSize = "60px 60px";
    loadingElem.style.backgroundPosition= "50% 60%";

    this.apiService.AvailableUsers(listBankPayLoad).subscribe(data => 
    {
      console.log(data);
      if(data.success) 
      {        
        console.log(data.data);
        this.banks=data.data; 
        loadingElem.style.backgroundSize = "0px 0px";
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
    



    
    


