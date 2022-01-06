import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../../service/api.service";
import {Bank} from "../../model/bank.model";


@Component({
  selector: 'app-find-bank',
  templateUrl: './find-bank.component.html',
  styleUrls: ['./find-bank.component.css']
})
export class FindBankComponent implements OnInit {

 bank: Bank[];
  invalidBank : boolean=false;
  constructor(private formBuilder: FormBuilder,private router: Router, private apiService: ApiService) { }
  findBankForm: FormGroup;

  ngOnInit() 
  {
    this.findBankForm = this.formBuilder.group(
      {
        bankID: ['', Validators.compose([Validators.required])]
      });
  }
    

  onSubmit()
  {
    if (this.findBankForm.invalid) 
    {
      return;
    }
    
    const findBankPayLoad = 
    {
      peers:[""],
      fcn:"PublicRichQuery" ,
      args:[""]
    }
    findBankPayLoad.peers=
    [
      "peer0.idfc.banksconsortium.com",
      "peer1.idfc.banksconsortium.com",
      "peer0.hsbc.banksconsortium.com",
      "peer1.hsbc.banksconsortium.com",
      "peer0.idbi.banksconsortium.com",
      "peer1.idbi.banksconsortium.com"
    ];
    
    let bankID=(this.findBankForm.controls.bankID.value).toUpperCase();
    
    findBankPayLoad.args[0]="{\"selector\":{\"BankID\":\""+bankID+"\"}}";
    
    console.log(findBankPayLoad);

    let tableElem: HTMLElement = document.getElementById("table-findBank");
    tableElem.style.display="none";
    
    let loadingElem: HTMLElement = document.getElementById('find-bank-container');
    loadingElem.style.backgroundImage = "url('/assets/loading.gif')";
    loadingElem.style.backgroundRepeat = "no-repeat";
    loadingElem.style.backgroundSize = "60px 60px";
    loadingElem.style.backgroundPosition= "center center";

    this.apiService.FindBank(findBankPayLoad).subscribe(data => 
    {
      console.log(data);
      if(data.success) 
      {        
        console.log(data.data);
        this.bank=data.data;  
        loadingElem.style.backgroundSize = "0px 0px";
        tableElem.style.display="block";

      }
      else 
      {
          this.invalidBank = true;
          console.log(data.message);
      }
    });

  }
  goBack(): void {
    this.router.navigate(['dashboard-user']);
  };

}

