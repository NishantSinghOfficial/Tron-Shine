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
    fetch(contractEventApi)
    .then((resp) => resp.json())
    .then(function(res){
      //console.log(res);
      execute(0);
      async function execute(_x){
          let event = res[_x];

        let hash = event.transaction_id;
        //let hashurl = 'https://apilist.tronscan.org/api/transaction-info?hash='+hash;
        let = _checkAddr = event.result.addr;
        //console.log(_checkAddr);
        await prakash.userData.myDetail.fromChecksum(_checkAddr).then(data =>{
         //console.log(data);
         //console.log(data[0]);
         let name =shortAddress(data[0].address);

         if (data[0].name != '') {
            name = data[0].name;
         }
         //console.log(name);

        let classClrwin = 'redCell';
        if (event.result.payOut != 0) {
          classClrwin = 'greenCell';
        }
        if (event.result.rollType == 0) {
          //Win Roll Under
          allbets = '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + name +
            '</a></td><td>Under ' + event.result.prediction +
            '</td><td class="' + classClrwin + '">' + event.result.lucky_number +
            '</td><td>' + (event.result.betAmount) / sixZero +
            ' TRX </td><td class="' + classClrwin + '">' + (event.result.payOut / sixZero) +
            ' TRX </td></tr>';
        }else{
          allbets = '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' +name +
            '</a></td><td>OVER ' + event.result.prediction +
            '</td><td class="' + classClrwin + '">' + event.result.lucky_number +
            '</td><td>' + (event.result.betAmount) / sixZero +
            ' TRX </td><td class="' + classClrwin + '">' + (event.result.payOut / sixZero) +
            ' TRX </td></tr>';
        }

        $(DOMStrings.allbetTableBody).append(allbets);
        _x += 1;
      if(_x <res.length){

        execute(_x);
      }
    })
    .catch(function(err){
      //insert new user check

      console.log(err);
      _x += 1;
    if(_x <res.length){

      execute(_x);
    }
    })
    }


  })
    .catch(function(error){
      console.log(error);
    });
  }





   const publicInfoinitUi = async () => {
     apicall();
     apievent();

   }
   return {
 		"publicInfoinitUi": publicInfoinitUi
 	}



})();
