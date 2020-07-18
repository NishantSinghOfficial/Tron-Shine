const diceGame = 'THgP6bPgPjkTUKRt5dcAajMtWoi2Ki9TkV';
var contractApi = 'https://apilist.tronscan.org/api/contract?contract='+barsctrt+'';
var contractEventApi = 'https://api.shasta.trongrid.io/event/contract/'+barsctrt+'?size=100&page=1';
var resultOutcome = {
  1:'GREY',
  2:'BLUE',
  3:'GREEN',
  4:'RED'
}
var publicbars = (function(){

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
    if(address == '') return console.log('null address');
    let start = address.substring(0, 5);
    let end = address.substring(address.length - 5, address.length)
    let short = start + "..." + end;
    return short;
  }

  const apicall = async () =>{

    fetch(contractApi)
    .then((resp) => resp.json())
    .then(function(res){
      let _bal = res.data[0].balance/sixZero;

      publicString.contractBal =floor(_bal,2);
      publicString.totaltrxn = res.data[0].trxCount;
      let pool = (publicString.contractBal - 10000)*0.7;
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


  }
  const apievent = async () =>{
    let newBet ='';
    fetch(contractEventApi)
    .then((resp) => resp.json())
    .then(function(event){
      event.forEach(async(res) => {
        //console.log(res);
        let hash = res.transaction_id;
        let name = checksumHex(res.result.addr);
        name = tronWeb.address.fromHex(name);
        let _nam = shortAddress(name);
        let hashurl = await tronWeb.trx.getTransaction(hash);
        // console.log(hashurl);
        // fetch(hashurl)
        // .then((res1) => res1.json())
        // .then(async function(res2){
        //   console.log(res2.ownerAddress);
        //     name = res2.ownerAddress;
        //     name = shortAddress(name);


        //name = tronWeb.address.fromHex(name);
        //console.log(event);
        //console.log(name);
        //let paytrx = Math.floor(event.result.payOut / 1e4)/100;
        let classClrwin = 'redCell';
        let payAfterWin = 0;
        if (res.result.payOut != 0) {
          classClrwin = 'greenCell';
          payAfterWin = res.result.payOut/sixZero + ' TRX';
        }


        newBet += '<tr><td class="chopCell"><a target="_blank" href="https://shasta.tronscan.org/#/transaction/'+hash+'">' + _nam +
          '</a></td><td><span class="'+resultOutcome[res.result.prediction]+'"></span></td><td><span class="' + resultOutcome[res.result.lucky_number] +
          '"></span></td><td>' + (res.result.betAmount) / sixZero+' TRX'+
          '</td><td class="' + classClrwin + '">' + payAfterWin +
          '</td></tr>';

        document.querySelector(DOMStrings.allbetTableBody).innerHTML = newBet;
        //});
      });



    })
    .catch(function(error){
      console.log(error);
    })
  }

  //////////////////////////////
  var hash = '';
  async function watchNewBarsBet() {
    let newBet = '';
    let barsContract = await tronWeb.contract().at(barsctrt);
    let x = await barsContract.barsbetevent().watch(async (err, res) => {
      if (err) return console.error('Error with "method" event:', err)
      if (res) {
        if (res.transaction == hash) return console.info('duplicate');

        console.info(res.transaction);
        //console.log(res);
        let addr = res.result.addr;

        addr = checksumHex(addr);
        addr = tronWeb.address.fromHex(addr);
        console.log(addr + '   '+tronWeb.defaultAddress.base58);
        if(tronWeb.defaultAddress.base58 == addr){
          resultCol = res.result.lucky_number;
        }
        let _nam = shortAddress(addr);
        hash = res.transaction;

        //console.log(res);
        let payAfterWin = 0;
        let classClrwin = '';
        if (res.result.payOut != 0) {
          classClrwin = 'greenCell';

          payAfterWin = floor((res.result.payOut)/sixZero,2)+' TRX';
        }else {
          classClrwin ='redCell';
        }



          newBet += '<tr><td class="chopCell"><a target="_blank" href="https://shasta.tronscan.org/#/transaction/'+hash+'">' + _nam +
            '</a></td><td><span class="'+resultOutcome[res.result.prediction]+'"></span></td><td><span class="' + resultOutcome[res.result.lucky_number] +
            '"></span></td><td>' + (res.result.betAmount) / sixZero+' TRX'+
            '</td><td class="' + classClrwin + '">' + payAfterWin +
            '</td></tr>';

        $('tbody.allBetsHistory').prepend(newBet);
        $('tbody.allBetsHistory ').find('tr:nth-of-type(101)').remove();

        newBet = '';

      }
      else {
        console.log(err);
      }


    })
  }




   const publicInfoinitUi = async () => {
     //apicall();
     apievent();
     watchNewBarsBet();

   }
   return {
 		"publicInfoinitUi": publicInfoinitUi
 	}



})();
$(window).load(function(){
  publicbars.publicInfoinitUi();
});
