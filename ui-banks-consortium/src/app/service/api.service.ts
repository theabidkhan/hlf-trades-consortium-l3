import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from "rxjs/index";
import {ApiResponse} from "../model/api.response";
import xml2js from 'xml2js'; 

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Bearer '
  })
};

@Injectable()
export class ApiService 
{
//########################### Declaration of properties and variables ##########################################
  idfc_token="";
  hsbc_token="";
  idbi_token="";
  public xmlItems: any; 
  token:string;
  userID=localStorage.getItem('currentUser');
  baseURL: string= "http://localhost:3000";
  invokeAPIsURL: string = "/channels/mychannel/chaincodes/BanksConsortiumChainCode";
  
//===================================================================================
// Constructor to the ApiService
//===================================================================================
  constructor(private http: HttpClient) 
  { 
    this.loadXML();

    //Removing double quotes from the tokens received from the XML file.
    this.idfc_token= (localStorage.getItem('idfc_token')).substring(1,(localStorage.getItem('idfc_token')).length-1);
    this.hsbc_token= (localStorage.getItem('hsbc_token')).substring(1,(localStorage.getItem('hsbc_token')).length-1);
    this.idbi_token= (localStorage.getItem('idbi_token')).substring(1,(localStorage.getItem('idbi_token')).length-1);
 
    //Printing all the tokens on console.
    console.log(this.idfc_token);
    console.log(this.hsbc_token);
    console.log(this.idbi_token);
  }

//===================================================================================
// loadXML() mehod to load the xml file
//===================================================================================
  loadXML() {  
   this.http.get('/assets/tokens_xml.xml',  
      {  
        headers: new HttpHeaders()  
          .set('Content-Type', 'text/xml')  
          .append('Access-Control-Allow-Methods', 'GET')  
          .append('Access-Control-Allow-Origin', '*')  
          .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),  
        responseType: 'text'  
      })  
      .subscribe((data) => {  
        this.parseXML(data)  
          .then((data) => {  
            this.xmlItems = data;  
          });  
      });  
  }  
//===================================================================================
// parseXML() to get the token values from XML file and parse it to JSON
//===================================================================================
  parseXML(data) {  
    return new Promise(resolve => {  
         
        var parser = new xml2js.Parser(  
          {  
            trim: true,  
            explicitArray: true  
          });  
          
      parser.parseString(data, function (err, result) {
      var obj = result.tokens; 
      localStorage.setItem('idfc_token',obj.idfcjwt[0]) ;
      localStorage.setItem('hsbc_token',obj.hsbcjwt[0]);
      localStorage.setItem('idbi_token',obj.idbijwt[0]);      
      });
    });  
  }  

//===================================================================================
// RegisterUser() to register the users
//===================================================================================  
  RegisterUser(registerPayLoad) : Observable<ApiResponse> 
  {
    console.log(registerPayLoad);
    httpOptions.headers = httpOptions.headers.set('Content-Type',  'application/json');
    return this.http.post<ApiResponse>(this.baseURL+"/registerUser", registerPayLoad, httpOptions);
  }

//===================================================================================
// SaveUser() to register the users in the Blockchain Network
//===================================================================================  
  SaveUser(saveUserPayLoad) : Observable<ApiResponse> 
  {
    let bank=saveUserPayLoad.args[1];
    switch (bank)
    {
      case "IDFC" : this.token=this.idfc_token;
      break;
      case "HSBC" : this.token=this.hsbc_token;
      break;
      case "IDBI" : this.token=this.idbi_token;
      break;
    }

    console.log(saveUserPayLoad);
    httpOptions.headers = httpOptions.headers.set('authorization','Bearer '+this.token);
    return this.http.post<ApiResponse>(this.baseURL+this.invokeAPIsURL, saveUserPayLoad, httpOptions);
  }

//===================================================================================
// LoginUser() to login the user
//===================================================================================  
  LoginUser(loginPayLoad) : Observable<ApiResponse> 
  {
    console.log(loginPayLoad);
    httpOptions.headers = httpOptions.headers.set('Content-Type',  'application/json');
    return this.http.post<ApiResponse>(this.baseURL+"/loginUser", loginPayLoad, httpOptions);
  }

//===================================================================================
// FindUser() to find the user
//===================================================================================  
FindUser(findUserPayLoad) : Observable<ApiResponse> 
{
  console.log(this.userID);
  if (this.userID!=null)
  {
    let bank=(this.userID.slice(0,4));
    switch (bank)
    {
      case "IDFC" : this.token=this.idfc_token;
      break;
      case "HSBC" : this.token=this.hsbc_token;
      break;
      case "IDBI" : this.token=this.idbi_token;
      break;
    }
  }
    console.log(findUserPayLoad);
  httpOptions.headers = httpOptions.headers.set('authorization','Bearer '+this.token);
  return this.http.post<ApiResponse>(this.baseURL+this.invokeAPIsURL, findUserPayLoad,httpOptions);
}

//===================================================================================
// AvaialableUsers() to list all the users
//=================================================================================== 
AvailableUsers(listUserPayLoad) : Observable<ApiResponse> 
{
  console.log(this.userID);
  if (this.userID!=null)
  {
    let bank=(this.userID.slice(0,4));
    switch (bank)
    {
      case "IDFC" : this.token=this.idfc_token;
      break;
      case "HSBC" : this.token=this.hsbc_token;
      break;
      case "IDBI" : this.token=this.idbi_token;
      break;
    }
  }
  console.log(listUserPayLoad);
  httpOptions.headers = httpOptions.headers.set('authorization','Bearer '+this.token);
  return this.http.post<ApiResponse>(this.baseURL+this.invokeAPIsURL, listUserPayLoad,httpOptions);
} 



//===================================================================================
// AvaialableBanks() to list all the Banks
//=================================================================================== 
  AvailableBanks(listBankPayLoad) : Observable<ApiResponse> 
  {
    console.log(this.userID);
    if (this.userID!=null)
    {
      let bank=(this.userID.slice(0,4));
      switch (bank)
      {
        case "IDFC" : this.token=this.idfc_token;
        break;
        case "HSBC" : this.token=this.hsbc_token;
        break;
        case "IDBI" : this.token=this.idbi_token;
        break;
      }
    }

    console.log(listBankPayLoad);
    httpOptions.headers = httpOptions.headers.set('authorization','Bearer '+this.token);
    return this.http.post<ApiResponse>(this.baseURL+this.invokeAPIsURL, listBankPayLoad,httpOptions);
  }

//===================================================================================
// FindBank() to find Bank details
//=================================================================================== 
  FindBank(findBankPayLoad) : Observable<ApiResponse> 
  {
    console.log(this.userID);
    if (this.userID!=null)
    {
      let bank=(this.userID.slice(0,4));
      switch (bank)
      {
        case "IDFC" : this.token=this.idfc_token;
        break;
        case "HSBC" : this.token=this.hsbc_token;
        break;
        case "IDBI" : this.token=this.idbi_token;
        break;
      }
    }
    
    console.log(findBankPayLoad);
    httpOptions.headers = httpOptions.headers.set('authorization','Bearer '+this.token);
    return this.http.post<ApiResponse>(this.baseURL+this.invokeAPIsURL, findBankPayLoad,httpOptions);
  }

//===================================================================================
// TradeDetails() to load the Trades 
//===================================================================================  
TradeDetails(dashboardPayLoad) : Observable<ApiResponse> 
{
  let bank=(dashboardPayLoad.args[0].slice(0,4));
  switch (bank)
  {
    case "IDFC" : this.token=this.idfc_token;
    break;
    case "HSBC" : this.token=this.hsbc_token;
    break;
    case "IDBI" : this.token=this.idbi_token;
    break;
  }
  console.log(dashboardPayLoad);
  httpOptions.headers = httpOptions.headers.set('authorization','Bearer '+this.token);
  return this.http.post<ApiResponse>(this.baseURL+this.invokeAPIsURL, dashboardPayLoad,httpOptions);
}

//===================================================================================
// NewTrade() to initiate a new trade
//=================================================================================== 
  NewTrade(initTradePayLoad) : Observable<ApiResponse> 
  {
    console.log(this.userID);
    if (this.userID!=null)
    {
      let bank=(this.userID.slice(0,4));
      switch (bank)
      {
        case "IDFC" : this.token=this.idfc_token;
        break;
        case "HSBC" : this.token=this.hsbc_token;
        break;
        case "IDBI" : this.token=this.idbi_token;
        break;
      }
    }
    
    console.log(initTradePayLoad);
    httpOptions.headers = httpOptions.headers.set('authorization','Bearer '+this.token);
    return this.http.post<ApiResponse>(this.baseURL+this.invokeAPIsURL, initTradePayLoad,httpOptions);
  }

//===================================================================================
// FindTrade() to find details of a Trade
//=================================================================================== 
  FindTrade(findTradePayLoad) : Observable<ApiResponse> 
  {
    console.log(this.userID);
    if (this.userID!=null)
    {
      let bank=(this.userID.slice(0,4));
      switch (bank)
      {
        case "IDFC" : this.token=this.idfc_token;
        break;
        case "HSBC" : this.token=this.hsbc_token;
        break;
        case "IDBI" : this.token=this.idbi_token;
        break;
      }
    }
    console.log(findTradePayLoad);
    httpOptions.headers = httpOptions.headers.set('authorization','Bearer '+this.token);
    return this.http.post<ApiResponse>(this.baseURL+this.invokeAPIsURL, findTradePayLoad,httpOptions);
  }
}


 