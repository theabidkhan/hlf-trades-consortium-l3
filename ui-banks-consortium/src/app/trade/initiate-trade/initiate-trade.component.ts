import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../../service/api.service";
import {User} from "../../model/user.model";

@Component({
  selector: 'app-initiate-trade',
  templateUrl: './initiate-trade.component.html',
  styleUrls: ['./initiate-trade.component.css']
})
export class InitiateTradeComponent implements OnInit {
  
  constructor(private formBuilder: FormBuilder,private router: Router, private apiService: ApiService) { }
  users:User[];
  newTradeForm: FormGroup;
  invalidTrade: boolean = false;
  peers:string[];

 
  ngOnInit() {
    this.newTradeForm = this.formBuilder.group({
      fromParty: ['', Validators.required],
      toParty: ['', Validators.required],
      amount: ['', Validators.required]
    });
    
   
    let currentUserID=localStorage.getItem('currentUser');
    this.newTradeForm.controls.fromParty.setValue(currentUserID);
    document.getElementById("fromParty").setAttribute("readonly", "true");

    this.peers=[
      "peer0.idfc.banksconsortium.com",
      "peer1.idfc.banksconsortium.com",
      "peer0.hsbc.banksconsortium.com",
      "peer1.hsbc.banksconsortium.com",
      "peer0.idbi.banksconsortium.com",
      "peer1.idbi.banksconsortium.com"
    ];
    
    const listUserPayLoad = 
    {
      peers:[""],
      fcn:"PublicRichQuery" ,
      args:[""]
    }

    listUserPayLoad.peers=this.peers;
    
    
    listUserPayLoad.args[0]="{\"selector\":{\"DocType\":\"user\"}}";    
    console.log(listUserPayLoad);   
    
    let tableElem: HTMLElement = document.getElementById("table-newTrade");
    let loadingElem: HTMLElement = document.getElementById('new-trade-container');
    tableElem.style.display="none";

    
    loadingElem.style.backgroundImage = "url('/assets/loading.gif')";
    loadingElem.style.backgroundRepeat = "no-repeat";
    loadingElem.style.backgroundSize = "60px 60px";
    loadingElem.style.backgroundPosition= "center center";
    loadingElem.style.height="350px";
    
    this.apiService.AvailableUsers(listUserPayLoad).subscribe(data => 
    {
        if(data.success) 
        {        
          console.log(data.data);
          this.users=data.data;  
          loadingElem.style.backgroundSize = "0px 0px";
          tableElem.style.display="block";
        }
        else 
        {
          console.log(data.message);
        }
    });    
  }


  onSubmit() {

    if (this.newTradeForm.invalid) 
    {
      return;
    }
    

    let fromPartyID=this.newTradeForm.controls.fromParty.value;
    let toPartyID=this.newTradeForm.controls.toParty.value;
    let tradeAmount=this.newTradeForm.controls.amount.value;

    let fromPartyBank=fromPartyID.slice(0,4);
    let toPartyBank=toPartyID.slice(0,4);

    
    const initTradePayLoad = 
    {
      peers:[""],
      fcn:"InitTrade" ,
      args:[fromPartyID,toPartyID,tradeAmount,""]
    }
   

    if((initTradePayLoad.args[0]!=initTradePayLoad.args[1]) && (tradeAmount>1))
    {
      

      // === Setting Collection Name as per the Names of fromParty and toParty ===
      if ((fromPartyBank == "IDFC" || fromPartyBank == "HSBC") && (toPartyBank == "IDFC" || toPartyBank == "HSBC"))
      {
        initTradePayLoad.args[3] = "collection-idfc-hsbc";
      } 
      else if ((fromPartyBank == "IDFC" || fromPartyBank == "IDBI") && (toPartyBank == "IDFC" || toPartyBank == "IDBI"))
      {
        initTradePayLoad.args[3] = "collection-idfc-idbi";
      }
      else if ((fromPartyBank == "HSBC" || fromPartyBank == "IDBI") && (toPartyBank == "HSBC" || toPartyBank == "IDBI"))
      {
        initTradePayLoad.args[3] = "collection-hsbc-idbi";
      }
      
      //Initializing value for peers
      initTradePayLoad.peers=this.peers;
      
      //printing the initTradePayLoad to the console.
      console.log(initTradePayLoad);
      let tableElem: HTMLElement = document.getElementById("table-newTrade");
      let loadingElem: HTMLElement = document.getElementById('new-trade-container');
      tableElem.style.display="none";
  
      //Loading image appears here
      loadingElem.style.backgroundImage = "url('/assets/loading.gif')";
      loadingElem.style.backgroundRepeat = "no-repeat";
      loadingElem.style.backgroundSize = "60px 60px";
      loadingElem.style.backgroundPosition= "center center";
      loadingElem.style.height="350px";

      this.apiService.NewTrade(initTradePayLoad).subscribe(data => 
      {
          if(data.success) 
          {   
            //loading image disappears here     
            loadingElem.style.backgroundSize = "0px 0px";
            tableElem.style.display="block";
            alert("Trade initiated Successfully.");
            console.log("Trade initiated Successfully.")
            console.log(data);
            console.log(data.message);
          } 
          else 
          {
            this.invalidTrade = true;
            console.log(data.message);
          }
      });  
    }
    else
    {
      alert("Both Parties are same, please select different ToParty.");    
    } 
  }


  //method to go back to user Dashboard
  goBack(): void {
    this.router.navigate(['dashboard-user']);
  };
}
