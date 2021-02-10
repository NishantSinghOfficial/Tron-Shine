var publicString = {
  poolBalance:'',
  totalMined:'',
  totalFrozen:'',
  stageCount:'',
  thisStageMined:'',
  totalWager:'',
  contractBal:0,
  totaltrxn:0
}


var publicData = (function(){

  const freezeContract='';
  const sixZero = 1000000;

  function floor(value,decimal){
    let _x = 10 ** decimal;
    return (Math.floor(value *_x) / _x)
  }
  function hexChecksum(hex) {
    if(hex.length >2){
      let res = hex.substr(2);
      let chck = "0x" + res;
      return chck;
    }


  }
  //////////Checksum~to~hex~offline//////////////////
  function checksumHex(checksum) {
    let res = checksum.substr(2);
    let hex = "41" + res;
    return hex;

  }

  function shortAddress(address) {
    let start = address.substring(0, 4);
    let end = address.substring(address.length - 4, address.length)
    let short = start + "..." + end;
    return short;
  }

  const apicall = async () =>{

    fetch(contractApi)
    .then((resp) => resp.json())
    .then(function(res){
      let _bal = res.data[0].balance/sixZero;
      fetch(barcontractApi)
      .then((resp2) => resp2.json())
      .then(function(res2){
        let _bal2 = res2.data[0].balance/sixZero;
        _bal += _bal2;
      publicString.contractBal =floor(_bal,2);
      publicString.totaltrxn = res.data[0].trxCount + res2.data[0].trxCount +125428;
      let pool = (publicString.contractBal - 20000)*0.7;
      publicString.poolBalance = floor(pool,2);
      $(DOMStrings.poolTrx).text(publicString.poolBalance + ' TRX');
      //console.log(publicString.contractBal);
      //console.log(res);
      //console.log(publicString.totaltrxn);
      $('p#totalBets').text(publicString.totaltrxn);
      $('p#contractBalance').text(publicString.contractBal);
    })
    .catch(function(error){
      console.log(error);
    })
  })
    .catch(function(error){
      console.log(error);
    })


  }
  const apievent = async () =>{
    let allbets ='';
    fetch(trccontractApi)
    .then((resp) => resp.json())
    .then(function(res){
      execute(0);
      async function execute(_x){
          let event = res[_x];
          let addr = event.result.addr;
          addr = checksumHex(addr);
          addr = tronWeb.address.fromHex(addr);
          let hash = event.transaction_id;
          let divider = 10 ** (PlayabletokenId[event.result.tokenId].precision);

          //let paytrx = Math.floor(event.result.payOut / 1e4)/100;
          let classClrwin = '';
          let tokenNam = PlayabletokenId[event.result.tokenId].name;
          let _betVal = (event.result.betAmount) / divider;
          let payAfterWin = 0;
          if (event.result.payOut != 0) {
            classClrwin = 'greenCell';

            payAfterWin = floor((event.result.payOut)/divider,2)+' '+tokenNam;
          }else {
            classClrwin ='redCell';
          }
          let _nam = shortAddress(addr);
          await tronWeb.trx.getAccount(addr).then(async result =>{

            if(result.account_name){
              _nam =  tronWeb.toAscii(result.account_name);

            }
            //console.log(_nam);


          if (event.result.rollType == 0) {
            //Win Roll Under
            allTable = '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + _nam+
              '</a></td><td>Under ' + event.result.prediction +
              '</td><td class="red_clr">' + event.result.lucky_number +
              '</td><td>' + _betVal+' ' +tokenNam+
              '</td><td class="' + classClrwin + '">' + payAfterWin+
              '</td></tr>';
          }else{
            allTable = '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + _nam +
              '</a></td><td>OVER ' + event.result.prediction +
              '</td><td class="red_clr">' + event.result.lucky_number +
              '</td><td>' + _betVal+' ' +tokenNam+
              '</td><td class="' + classClrwin + '">' + payAfterWin+
              '</td></tr>';
          }
            _x += 1;
            $(DOMStrings.allbetTableBody).append(allTable);
            if(res.length > _x) {
              execute(_x);
            }
          });
      }


  })
    .catch(function(error){
      console.log(error);
    });
  }
const tokenPool = async () =>{
    fetch(trcBalApi)
    .then(resp => resp.json())
    .then(res2 => {
      console.log(res2.data[0]);
      let result = res2.data[0];
      Object.keys(PlayabletokenId).forEach(async res => {
        for (var i = 0; i < result.assetV2.length; i++) {
        if(res == result.assetV2[i].key){
          PlayabletokenId[res].poolBal = result.assetV2[i].value;
          //console.log(PlayabletokenId[res].poolBal);
          let _poolBal = PlayabletokenId[res].poolBal /(10 ** PlayabletokenId[res].precision);
          _poolBal -= PlayabletokenId[res].poolLmtToken;
          _poolBal = floor(_poolBal,3);
          let thisToken= '<tr class="'+res+'"><th scope="row"><a href="https://tronscan.org/#/token/'+res+'" target="_blank">'+PlayabletokenId[res].name +
                      '</a></th><td>Loading</td><td >' + _poolBal+
                      '</td></tr>';
          $(DOMStrings.disTokenWagerAndPool).append(thisToken);
        }
      }
      });
      //asset v1 api fetching in correct data
           //console.log(PlayabletokenId);
    })
}




   const publicInfoinitUi = async () => {
     apicall();
     apievent();
     //tokenPool();

   }
   return {
 		"publicInfoinitUi": publicInfoinitUi
 	}



})();
