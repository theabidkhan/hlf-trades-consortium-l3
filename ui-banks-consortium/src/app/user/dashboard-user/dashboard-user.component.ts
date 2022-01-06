import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup,Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../../service/api.service";
import {Trade} from "../../model/trade.model";

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})

export class DashboardUserComponent implements OnInit 
{
  trades: Trade[];
  constructor(private formBuilder: FormBuilder,private router: Router, private apiService: ApiService) { }
  dashboardForm: FormGroup;

  ngOnInit() {

    this.dashboardForm = this.formBuilder.group({});
    let loggedInUser=localStorage.getItem("currentUser");
    let elem: HTMLElement = document.getElementById('loggedInUser');
    elem.style.display="block";
    elem.innerHTML="UserID : "+loggedInUser;
    const dashboardPayLoad = 
    {
      peers:[""],
      fcn:"AllTrades",
      args:["",[""]]
    }
      
    dashboardPayLoad.peers=[
      "peer0.idfc.banksconsortium.com",
      "peer1.idfc.banksconsortium.com",
      "peer0.hsbc.banksconsortium.com",
      "peer1.hsbc.banksconsortium.com",
      "peer0.idbi.banksconsortium.com",
      "peer1.idbi.banksconsortium.com"
    ];

    dashboardPayLoad.args[0]=loggedInUser;
    dashboardPayLoad.args[1]="collection-idfc-hsbc collection-idfc-idbi collection-hsbc-idbi";
    console.log(dashboardPayLoad);
    let tableElem: HTMLElement = document.getElementById("table-wrapper");
    tableElem.style.display="none";
    let loadingElem: HTMLElement = document.getElementById('dashboard-container');
    loadingElem.style.backgroundImage = "url('/assets/loading.gif')";
    loadingElem.style.backgroundRepeat = "no-repeat";
    loadingElem.style.backgroundSize = "60px 60px";
    loadingElem.style.backgroundPosition= "center center";

    this.apiService.TradeDetails(dashboardPayLoad).subscribe(data => 
    {     
      if (data.success)
      {   
        loadingElem.style.backgroundSize = "0px 0px";
        tableElem.style.display="block";
        console.log(data.data);
        let tempTrades=[];
        
        if((data.data)!=null)
        {
          for(let i=0;i<(data.data).length;i++)
          {
            if(data.data[i].Record.FromParty==loggedInUser || data.data[i].Record.ToParty==loggedInUser)
            {
              console.log(data.data[i]);
              tempTrades[i]=data.data[i];
            } 
          }
          this.trades=tempTrades;
        }
      }   
      else 
      {
        this.router.navigate(['login-user']);
        console.log(data.message);
      }
   });
  }   
    
    
    
  findUser(): void {
    this.router.navigate(['find-user']);
  };

  newTrade(): void {
    this.router.navigate(['initiate-trade']);
  };

  findTrade(): void {
    this.router.navigate(['find-trade']);
  };

  availableUsers(): void {
    this.router.navigate(['list-users']);
  };

  findBank(): void {
    this.router.navigate(['find-bank']);
  };

  availableBanks(): void {
    this.router.navigate(['list-banks']);
  };
}