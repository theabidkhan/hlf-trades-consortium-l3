import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../../service/api.service";
import {Trade} from "../../model/trade.model";

@Component({
  selector: 'app-find-trade',
  templateUrl: './find-trade.component.html',
  styleUrls: ['./find-trade.component.css']
})
export class FindTradeComponent implements OnInit {

 loggedInUser=localStorage.getItem('currentUser');
 trade: Trade[];
  invalidTrade : boolean=false;
  constructor(private formBuilder: FormBuilder,private router: Router, private apiService: ApiService) { }
  findTradeForm: FormGroup;

  ngOnInit() 
  {
    this.findTradeForm = this.formBuilder.group(
      {
        tradeID: ['', Validators.compose([Validators.required])]
      });
  }
    

  onSubmit()
  {
    if (this.findTradeForm.invalid) 
    {
      return;
    }
    
    const findTradePayLoad = 
    {
      peers:[""],
      fcn:"PrivateRichQuery" ,
      args:[""]
    }
    
    

    let tradeID=(this.findTradeForm.controls.tradeID.value).toUpperCase();
    let bankFrom=((tradeID.slice(0,3)).toLowerCase());//IDFHSB5037
    let bankTo=((tradeID.slice(3,6)).toLowerCase());
    
    if(bankFrom=="idf" || bankFrom=="hsb")
    {
      bankFrom=(bankFrom+"c").toLowerCase();
    }
    else
    {
      bankFrom=(bankFrom+"i").toLowerCase();
    }

        
    if(bankTo=="idf" || bankTo=="hsb")
    {
      bankTo=(bankTo+"c").toLowerCase();
    }
    else
    {
      bankTo=(bankTo+"i").toLowerCase();
    }

    

    findTradePayLoad.peers=
    [
      "peer0."+bankFrom+".banksconsortium.com",
      "peer1."+bankFrom+".banksconsortium.com",
      "peer0."+bankTo+".banksconsortium.com",
      "peer1."+bankTo+".banksconsortium.com"
    ];

//Setting Collection Name to get a Trade data
    if((bankFrom=="idfc" && bankTo=="hsbc") || (bankFrom=="hsbc" && bankTo=="idfc"))
    {
      findTradePayLoad.args[0]="collection-idfc-hsbc";
    }
    else  if ((bankFrom=="idfc" && bankTo=="idbi") || (bankFrom=="idbi" && bankTo=="idfc"))
    {
      findTradePayLoad.args[0]="collection-idfc-idbi";
    }
    else if ((bankFrom=="idbi" && bankTo=="hsbc") || (bankFrom=="hsbc" && bankTo=="idbi"))
    {
      findTradePayLoad.args[0]="collection-hsbc-idbi";
    }

    findTradePayLoad.args[1]="{\"selector\":{\"DocType\":\"trade\",\"TradeID\":\""+tradeID+"\"}}";    
    console.log(findTradePayLoad);


    let tableElem: HTMLElement = document.getElementById("table-findTrade");
    tableElem.style.display="none";
    
    let loadingElem: HTMLElement = document.getElementById('find-trade-container');
    loadingElem.style.backgroundImage = "url('/assets/loading.gif')";
    loadingElem.style.backgroundRepeat = "no-repeat";
    loadingElem.style.backgroundSize = "60px 60px";
    loadingElem.style.backgroundPosition= "center center";


    this.apiService.FindTrade(findTradePayLoad).subscribe(data => 
    {
      console.log(data);
      if(data.success) 
      {  
        if(data.data[0].Record.FromParty==this.loggedInUser || data.data[0].Record.ToParty==this.loggedInUser)
        {
          console.log(data.data);
          this.trade=data.data;
          loadingElem.style.backgroundSize = "0px 0px";
          tableElem.style.display="block";
        }
        else
        {
          this.invalidTrade=true;
          alert("You are not involved in this trade.");
          console.log("You are not involved in this trade.");
          loadingElem.style.backgroundSize = "0px 0px";
          tableElem.style.display="block";
          this.router.navigate(['find-trade']);
        }
    }
      else 
      {
        this.invalidTrade = true;
        console.log(data.message);
        loadingElem.style.backgroundSize = "0px 0px";
        tableElem.style.display="block";
        this.router.navigate(['find-trade']);
      }
    });

  }
  goBack(): void {
    this.router.navigate(['dashboard-user']);
  };

}




