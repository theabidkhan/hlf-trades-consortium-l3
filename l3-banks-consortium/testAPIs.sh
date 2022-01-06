################################################################################################################
#
#
# This is for Training and evaluation purpose within Wipro, 2020.
# A Chain code implementation for DApp of Banks Consortium in Hyperledger Fabric for the submission of
# L3 Capstone Project in Wipro.
# Created by Md Abid Khan, Senior Software Engineer, Blockchain Practice, Wipro Limited.
#
#################################################################################################################

jq --version > /dev/null 2>&1
if [ $? -ne 0 ]; then
	echo "Please Install 'jq' https://stedolan.github.io/jq/ to execute this script"
	echo
	exit 1
fi

starttime=$(date +%s)

# Print the usage message
function printHelp () {
  echo "Usage: "
  echo "  ./testAPIs.sh -l golang|node"
  echo "    -l <language> - chaincode language (defaults to \"golang\")"
}
# Language defaults to "golang"
LANGUAGE="golang"

# Parse commandline args
while getopts "h?l:" opt; do
  case "$opt" in
    h|\?)
      printHelp
      exit 0
    ;;
    l)  LANGUAGE=$OPTARG
    ;;
  esac
done

##set chaincode path
function setChaincodePath(){
	LANGUAGE=`echo "$LANGUAGE" | tr '[:upper:]' '[:lower:]'`
	case "$LANGUAGE" in
		"golang")
		CC_SRC_PATH="github.com/banksconsortium-cc/go"
		;;
		"node")
		CC_SRC_PATH="$PWD/artifacts/src/github.com/banksconsortium-cc/node"
		;;
		*) printf "\n ------ Language $LANGUAGE is not supported yet ------\n"$
		exit 1
	esac
}

setChaincodePath

###################################################################### clear previous any fabric client tmp files

echo "rm -rf fabric-client-kv-* "
echo "rm -rf /tmp/fabric-client-kv-*"

#################################################################################################################

idfcUserName="idfc-user0$1"

echo "->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> POST : Enrolling user on IDFC ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

idfc_TOKEN=$(curl -s -X POST \
  http://localhost:3000/users \
  -H "content-type: application/x-www-form-urlencoded" \
  -d "username=\"$idfcUserName\"&orgName=idfc")  
echo $idfc_TOKEN
idfc_TOKEN=$(echo $idfc_TOKEN | jq ".token" | sed "s/\"//g")
echo
echo "IDFC token is $idfc_TOKEN"
echo

#################################################################################################################

hsbcUserName="hsbc-user0$1"

echo "->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> POST : Enrolling user on HSBC ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

hsbc_TOKEN=$(curl -s -X POST \
  http://localhost:3000/users \
  -H "content-type: application/x-www-form-urlencoded" \
  -d "username=\"$hsbcUserName\"&orgName=hsbc")  
echo $hsbc_TOKEN
hsbc_TOKEN=$(echo $hsbc_TOKEN | jq ".token" | sed "s/\"//g")
echo
echo "hsbc token is $hsbc_TOKEN"
echo


#################################################################################################################

idbiUserName="idbi-user0$1"

echo "->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> POST : Enrolling user on IDBI ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

idbi_TOKEN=$(curl -s -X POST \
  http://localhost:3000/users \
  -H "content-type: application/x-www-form-urlencoded" \
  -d "username=\"$idbiUserName\"&orgName=idbi") 
echo $idbi_TOKEN
idbi_TOKEN=$(echo $idbi_TOKEN | jq ".token" | sed "s/\"//g")
echo
echo "idbi token is $idbi_TOKEN"
echo

#################################################################################################################

#tokens_xml="tokens_xml.xml"
tokens_xml="/home/ubuntu/fabric-samples/ui-banks-consortium/src/assets/tokens_xml.xml"

if [ -f $tokens_xml ] ; then
    rm $tokens_xml
fi

echo "Writing tokens into tokens_xml.xml file"
echo

echo '<?xml version="1.0" encoding="UTF-8"?>
<tokens>
  <idfcjwt>'\"$idfc_TOKEN\"'</idfcjwt>
  <hsbcjwt>'\"$hsbc_TOKEN\"'</hsbcjwt>
  <idbijwt>'\"$idbi_TOKEN\"'</idbijwt>
</tokens>' >> "$tokens_xml"
echo "->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> All Tokens saved successfully ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

#################################################################################################################
echo "->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> POST :  Request for Create channel ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo
curl -s -X POST \
  http://localhost:3000/channels \
  -H "authorization: Bearer $idfc_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"channelName":"mychannel",
	"channelConfigPath":"../artifacts/channel/mychannel.tx"
}'
echo
echo
echo
sleep 5

#################################################################################################################
echo "->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> POST : Request for Joining channel on IDFC ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo
curl -s -X POST \
  http://localhost:3000/channels/mychannel/peers \
  -H "authorization: Bearer $idfc_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer0.idfc.banksconsortium.com","peer1.idfc.banksconsortium.com"]
}'
echo
echo
echo
#################################################################################################################
echo "->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> POST : Request for Joining channel on HSBC ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo
curl -s -X POST \
  http://localhost:3000/channels/mychannel/peers \
  -H "authorization: Bearer $hsbc_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer0.hsbc.banksconsortium.com","peer1.hsbc.banksconsortium.com"]
}'
echo
echo
echo

#################################################################################################################
echo "->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> POST : Request for Joining channel on IDBI ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo
curl -s -X POST \
  http://localhost:3000/channels/mychannel/peers \
  -H "authorization: Bearer $idbi_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer0.idbi.banksconsortium.com","peer1.idbi.banksconsortium.com"]
}'
echo
echo
echo

#################################################################################################################
echo "->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> POST : Request for Update Ancor Peers on IDFC ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo
curl -s -X POST \
  http://localhost:3000/channels/mychannel/anchorpeers \
  -H "authorization: Bearer $idfc_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"configUpdatePath":"../artifacts/channel/idfcMSPanchors.tx"
}'
echo
echo
echo

#################################################################################################################
echo "->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> POST : Request for Update Ancor Peers on HSBC ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo
curl -s -X POST \
  http://localhost:3000/channels/mychannel/anchorpeers \
  -H "authorization: Bearer $hsbc_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"configUpdatePath":"../artifacts/channel/hsbcMSPanchors.tx"
}'
echo
echo
echo

#################################################################################################################
echo "->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> POST : Request for Update Ancor Peers on IDBI ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo
curl -s -X POST \
  http://localhost:3000/channels/mychannel/anchorpeers \
  -H "authorization: Bearer $idbi_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"configUpdatePath":"../artifacts/channel/idbiMSPanchors.tx"
}'
echo
echo
echo

#################################################################################################################
echo "->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> POST : Request for Installing Chaincode on IDFC ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo
curl -s -X POST \
  http://localhost:3000/chaincodes \
  -H "authorization: Bearer $idfc_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"peers\": [\"peer0.idfc.banksconsortium.com\",\"peer1.idfc.banksconsortium.com\"],
	\"chaincodeName\":\"BanksConsortiumChainCode\",
	\"chaincodePath\":\"$CC_SRC_PATH\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"chaincodeVersion\":\"v0\"
}"
echo
echo
echo

#################################################################################################################
echo "->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> POST : Request for Installing Chaincode on HSBC ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo
curl -s -X POST \
  http://localhost:3000/chaincodes \
  -H "authorization: Bearer $hsbc_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"peers\": [\"peer0.hsbc.banksconsortium.com\",\"peer1.hsbc.banksconsortium.com\"],
	\"chaincodeName\":\"BanksConsortiumChainCode\",
	\"chaincodePath\":\"$CC_SRC_PATH\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"chaincodeVersion\":\"v0\"
}"
echo
echo
echo

#################################################################################################################
echo "->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> POST : Request for Installing Chaincode on IDBI ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo
curl -s -X POST \
  http://localhost:3000/chaincodes \
  -H "authorization: Bearer $idbi_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"peers\": [\"peer0.idbi.banksconsortium.com\",\"peer1.idbi.banksconsortium.com\"],
	\"chaincodeName\":\"BanksConsortiumChainCode\",
	\"chaincodePath\":\"$CC_SRC_PATH\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"chaincodeVersion\":\"v0\"
}"
echo
echo
echo

#################################################################################################################
echo "->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> POST : Request for Instantiating Chaincode with token of IDFC ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo
curl -s -X POST \
  http://localhost:3000/channels/mychannel/chaincodes \
  -H "authorization: Bearer $idfc_TOKEN" \
  -H "content-type: application/json" \
  -d "{
    \"chaincodeName\":\"BanksConsortiumChainCode\",
    \"chaincodeVersion\":\"v0\",
    \"chaincodeType\": \"$LANGUAGE\",
    \"args\":[],
    \"instantiateType\":\"instantiate\"
    }"
echo
echo
echo

#################################################################################################################


