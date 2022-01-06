/*
This is for Training and evaluation purpose within Wipro, 2020.

A Chain code implementation for DApp of Banks Consortium in Hyperledger Fabric for the submission of
L3 Capstone Project in Wipro.

Created by Md Abid Khan, Senior Software Engineer, Blockchain Practice, Wipro Limited.

*/

package main

// === import packages ===
import (
	"bytes"
	"encoding/json"
	"fmt"
	"math/rand"
	"strconv"
	"strings"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var logger = shim.NewLogger("##################### L3-BanksConsortium-Chaincode #####################\n")

// === declaring structure for banksConsortiumChaincode Chaincode implementation ===
type banksConsortiumChaincode struct {
}

// === declaring structure for Banks with 3 properties ===
type banks struct {
	DocType     string  `json:"DocType"`
	BankID      string  `json:"BankID"`
	BankName    string  `json:"BankName"`
	Location	string	`json:"Location"`
}

// === declaring structure for userDetails with 4 properties ===
type users struct {
	DocType     string  `json:"DocType"`
	UserID      string  `json:"UserID"`
	BankName    string  `json:"BankName"`
	UserBalance float64 `json:"UserBalance"`
}

// === declaring structure for Trade with 5 properties ===
type trades struct {
	DocType   string    `json:"DocType"`
	TradeID   string    `json:"TradeID"`
	FromParty string    `json:"FromParty"`
	ToParty   string    `json:"ToParty"`
	Amount    float64   `json:"Amount"`
	TradeDate time.Time `json:"TradeDate"`
	Status    string    `json:"Status"`
}

// === declaring constant for default values for Status ===
const (
	submitted string = "SUBMITTED"
	inprocess        = "INPROCESS"
	settled          = "SETTLED"
)

//===================================================================================
// Main method starts here
//===================================================================================
func main() {
	err := shim.Start(new(banksConsortiumChaincode))
	if err != nil {
		fmt.Printf("Error starting Banks Consortium chaincode: %s", err)
	}
}

//===================================================================================
// Invoke method starts here
//===================================================================================
func (t *banksConsortiumChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {

	logger.Info("\n##################### L3-BanksConsortium-Chaincode_Invoke #####################")

	// === Retrieve the requested chainCode function and arguments ===
	function, args := stub.GetFunctionAndParameters()

	// === Printing message ===
	fmt.Println("\n##################### invoked :  " + function + " #####################")

	// === Handling functions ===
	switch function {
	case "Init":
		return t.Init(stub)
	case "InitTrade":
		return t.InitTrade(stub, args)
	case "RegisterUser":
		return t.RegisterUser(stub, args)
	case "PublicRichQuery":
		return t.PublicRichQuery(stub, args)
	case "PrivateRichQuery":
		return t.PrivateRichQuery(stub, args)
	case "AllTrades":
		return t.AllTrades(stub, args)
	default:
		fmt.Println("Invoke did not found function: " + function) //error
		return shim.Error("Received unknown function invocation")
	}

}

//===================================================================================
// Init initializes the chaincode
//===================================================================================
func (t *banksConsortiumChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {

	var err error

	logger.Info("\n##################### L3-BanksConsortium-Chaincode_Init #####################\n")

	bankIDFC := &banks{"bank", "IDFC", "IDFC Bank","Delhi"}
	bankHSBC := &banks{"bank", "HSBC", "HSBC Bank", "Hyderabad"}
	bankIDBI := &banks{"bank", "IDBI", "IDBI Bank", "Jaipur"}

	// === Write the Bank details to the ledger ===
	bankIDFCJSONasBytes, err := json.Marshal(bankIDFC)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(bankIDFC.BankID, bankIDFCJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	bankHSBCJSONasBytes, err := json.Marshal(bankHSBC)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(bankHSBC.BankID, bankHSBCJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	bankIDBIJSONasBytes, err := json.Marshal(bankIDBI)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(bankIDBI.BankID, bankIDBIJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	// === Printing Bank details to user ===
	fmt.Println("\nBank Details Saved as: \n")
	fmt.Println(string(bankIDFCJSONasBytes))
	fmt.Println(string(bankHSBCJSONasBytes))
	fmt.Println(string(bankIDBIJSONasBytes))

	allbankJSONAsBytes := []byte(string(bankIDFCJSONasBytes) + string(bankHSBCJSONasBytes) + string(bankIDBIJSONasBytes))
	return shim.Success(allbankJSONAsBytes)

}

//===================================================================================
// RegisterUser method for registering a new user
//===================================================================================
func (t *banksConsortiumChaincode) RegisterUser(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error

	logger.Info("\n##################### L3-BanksConsortium-Chaincode_RegisterUser #####################")

	if len(args) != 3 {
		return shim.Error("Expecting 3 arguments....")
	}
	//########################### ALL ARGUMENTS LIST ##########################################
	// Name		UserID			BankName		UserBalance
	//args[] 		0				1				2
	//value 	"IDFC100001"	"IDFC"				5000

	// === Checking the arguments zero or null values ===
	if len(args) == 3 {
		for i := 0; i < 3; i++ {
			if len(args[i]) <= 0 {
				return shim.Error(strconv.Itoa(i) + " the argument must be a non-empty string")
			}
		}
	} else {
		fmt.Println("Input Error: Expecting 3 arguments")
	}
	//########################### USER INPUT ARGUMENTS LIST ##########################################
	// === Initialising the user variables ===
	UserID := args[0]
	BankName := args[1]

	UserBalance, err := strconv.ParseFloat(args[2], 64)
	if err != nil {
		return shim.Error(err.Error())
	}

	// === Check if UserID already exists ===
	userAsBytes, err := stub.GetState(UserID)
	if err != nil {
		return shim.Error("Failed to get UserID : " + err.Error())
	}
	if userAsBytes != nil {
		fmt.Println("This UserID already exists : " + UserID)
		return shim.Error("This UserID already exists : " + UserID)
	}

	// === Creating Object for user and Marshal to JSON ===
	userDetails := &users{"user", UserID, BankName, UserBalance}
	userJSONAsBytes, err := json.Marshal(userDetails)
	if err != nil {
		return shim.Error(err.Error())
	}

	// === Write the User details to the ledger ===
	err = stub.PutState(userDetails.UserID, userJSONAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	// === Printing User details to user ===
	fmt.Println("\nUser Details Saved as: \n")
	fmt.Println(string(userJSONAsBytes))
	return shim.Success(userJSONAsBytes)
}

//===================================================================================
// InitTrade method for initialisation of variables and structures
//===================================================================================
func (t *banksConsortiumChaincode) InitTrade(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	fmt.Println("\n##################### InitTrade is running #####################")

	var err error

	user := users{}
	//###########################  ARGUMENTS LIST ##########################################
	// Name		TradeID			FromParty			ToParty				Amount			TradeDate						  Status
	//args[] 		0				1					2					3				4								5
	//value 	IDFHSB1001		"IDFC1000001"		"HSBC1000001"		10000		"2006-01-02 15:04:05.000000"		"SUBMITTED"

	if len(args) != 4 {
		return shim.Error("Expecting 4 arguments....")
	}

	// === Checking the arguments zero or null values ===
	if len(args) == 4 {
		for i := 0; i < 4; i++ {
			if len(args[i]) <= 0 {
				return shim.Error(strconv.Itoa(i) + " the argument must be a non-empty string")
			}
		}
	} else {
		fmt.Println("Input Error: Expecting 4 arguments")
	}
	//########################### USER INPUT ARGUMENTS LIST ##########################################
	// Name		FromParty			ToParty				Amount		collectionName
	//args[] 		0					1				  2				3
	//value 	"IDFC1000001"		"HSBC1000001"		10000		"collection-idfc-hsbc"

	// === Initialising the variables ===
	//Getting names of fromParty and toParty from user interface
	fromParty := args[0]                           // "IDFC1000001"
	toParty := args[1]                             // "HSBC1000001"
	amount, err := strconv.ParseFloat(args[2], 64) // converting to a 64bit number
	collectionName := args[3]
	if err != nil {
		return shim.Error(err.Error())
	}

	//get fromParty details from the ledger
	userJSONasBytesFromParty, err := stub.GetState(fromParty)
	//check FromParty details are avaialable in the ledger or not.
	if err != nil {
		return shim.Error("Ooops...Didn't get FromParty : " + err.Error())
	}
	if userJSONasBytesFromParty != nil {
		json.Unmarshal(userJSONasBytesFromParty, &user)
		if user.UserBalance >= amount {
			// === update the userBalance in the ledger for fromParty ===
			user.UserBalance = user.UserBalance - amount
			userJSONasBytesFromParty, _ = json.Marshal(user)
			stub.PutState(user.UserID, userJSONasBytesFromParty)
			fmt.Println("\n FromParty User Details: \n" + string(userJSONasBytesFromParty))

			// === update the userBalance in the ledger for toParty ===
			//get toParty details from the ledger
			userJSONasBytesToParty, _ := stub.GetState(toParty)
			//check FromParty details are avaialable in the ledger or not.
			if err != nil {
				return shim.Error("Ooops...Didn't get ToParty : " + err.Error())
			}
			if userJSONasBytesToParty != nil {
				json.Unmarshal(userJSONasBytesToParty, &user)
				user.UserBalance = user.UserBalance + amount
				userJSONasBytesToParty, _ = json.Marshal(user)
				stub.PutState(user.UserID, userJSONasBytesToParty)
				fmt.Println("\n ToParty User Details: \n" + string(userJSONasBytesToParty))
			}
		} else {
			return shim.Error("FromParty doesn't have enough balance to initiate trade.")
		}
	}

	//Generating tradeID with the combination of names of fromParty and toParty ending with a four digit random number
	fromPartyID := fromParty[:len(fromParty)-7]
	toPartyID := toParty[:len(toParty)-7]
	source := rand.NewSource(time.Now().UnixNano())
	r := rand.New(source)
	tradeID := fromPartyID + toPartyID + strconv.Itoa(r.Intn(9999-1000)+1000) // TradeID Format : IDFHSB7943

	//initialising TradeDate and setting its format
	tradeDate := time.Now()
	tradeDate.Format("2006-01-02 15:04:05.000000") //tradeDate "2020-02-24 15:04:05.000000"
	status := submitted

	// === Check if Trade already exists ===
	tradeAsBytes, err := stub.GetPrivateData(collectionName, tradeID)
	if err != nil {
		return shim.Error("Failed to get Trade : " + err.Error())
	}
	if tradeAsBytes != nil {
		fmt.Println("This trade already exists : " + tradeID)
		return shim.Error("This trade already exists : " + err.Error())
	}

	// === Creating Object for trade and Marshal to JSON ===
	TradeData := &trades{"trade", tradeID, fromParty, toParty, amount, tradeDate, status}
	tradeJSONasBytes, err := json.Marshal(TradeData)
	if err != nil {
		return shim.Error(err.Error())
	}

	// === Save trade details into state ===
	err = stub.PutPrivateData(collectionName, tradeID, tradeJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	// === Printing Trade details to user ===
	fmt.Println("\nTrade Details Saved as: \n")
	fmt.Println(string(tradeJSONasBytes))
	fmt.Println("\n ******************** end of InitTrade ********************\n ")
	return shim.Success(tradeJSONasBytes)
}

//===================================================================================
// GetQueryResultForQueryString method for fetching the records
//===================================================================================
func GetQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {
	fmt.Printf("*********** GetQueryResultForQueryString queryString:\n%s\n", queryString)
	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close() // buffer is a JSON array containing QueryRecords
	var buffer bytes.Buffer
	buffer.WriteString("[")
	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		} // Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")
		buffer.WriteString(",\t \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}\n")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")
	fmt.Printf("*********** GetQueryResultForQueryString queryResult:\n%s\n", buffer.String())
	return buffer.Bytes(), nil
}

//===================================================================================
// BanksConsortiumRichQuery method for fetching the records from Users and Banks
//===================================================================================
func (t *banksConsortiumChaincode) PublicRichQuery(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	fmt.Println("\n##################### PublicRichQuery is running #####################")
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	inputquery := args[0]
	queryString := fmt.Sprintf(inputquery)
	queryResults, err := GetQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

//===================================================================================
// GetQueryResultForTrade method for fetching the records from Trade
//===================================================================================
func GetQueryResultForTrade(stub shim.ChaincodeStubInterface, collectionName string, queryString string) ([]byte, error) {
	fmt.Printf("*********** GetQueryResultForTrade queryString:\n%s\n", queryString)
	resultsIterator, err := stub.GetPrivateDataQueryResult(collectionName, queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close() // buffer is a JSON array containing QueryRecords
	var buffer bytes.Buffer
	buffer.WriteString("[")
	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		} // Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")
		buffer.WriteString(",\t \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}\n")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")
	fmt.Printf("*********** GetQueryResultForTrade queryResult:\n%s\n", buffer.String())
	return buffer.Bytes(), nil
}

//===================================================================================
// BanksConsortium PrivateRichQuery method for fetching the records from Trade
//===================================================================================
func (t *banksConsortiumChaincode) PrivateRichQuery(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("\n##################### PrivateRichQuery is running #####################")
	if len(args) < 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}
	collectionName := args[0]
	inputquery := args[1]
	queryString := fmt.Sprintf(inputquery)
	queryResults, err := GetQueryResultForTrade(stub, collectionName, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

//===================================================================================
// AllTrades method for fetching the records from Trade
//===================================================================================
func (t *banksConsortiumChaincode) AllTrades(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	fmt.Println("\n##################### PrivateRichQuery is running #####################")
	if len(args) < 2 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	userID := args[0]
	collectionNames := strings.Split(args[1], " ")
	queryString := fmt.Sprintf("{\"selector\":{\"DocType\":\"trade\"}}")

	//getting banksName from UserID
	rune := []rune(userID)
	bankName1 := string(rune[0:4])
	bankName := strings.ToLower(bankName1)
	fmt.Println(bankName)

	var result []interface{}
	var result1 []interface{}

	for i := 0; i < 3; i++ {
		if strings.Contains(collectionNames[i], bankName) {
			queryResults, err := GetQueryResultForTrade(stub, collectionNames[i], queryString)
			fmt.Println(collectionNames[i])
			if err != nil {
				return shim.Error(err.Error())
			}
			err = json.Unmarshal(queryResults, &result1)
			if err != nil {
				return shim.Error(err.Error())
			}
			result = append(result, result1...)
		}
	}
	
	finalresults, err := json.Marshal(result)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(finalresults)
}
