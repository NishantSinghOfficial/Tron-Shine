


var bethistory = (function(){
  const sixZero = 1000000;
  //////////Checksum~to~hex~offline//////////////////
  function checksumHex(checksum) {
    let res = checksum.substr(2);
    let hex = "41" + res;
    return hex;

  }
  function shortAddress(address) {
    if(address != ''){
      let start = address.substring(0, 4);
      let end = address.substring(address.length - 4, address.length)
      let short = start + "..." + end;
      return short;
    }

  }
  const setupNameFromId = async () =>{

  }
  ///////////////////////////////////////////////////
  async function allHistory() {
    let allTable = "";
    let resultCount = 0;
    await tronWeb.getEventResult(trcGameAddress, {
      eventName:'trc10BetEvent',
      size: 50,
      //onlyConfirmed: true
      //page: 2
    }).then(result => {
      //console.log(result);
      result.forEach(async(event) => {
          let addr = event.result.addr;
          addr = checksumHex(addr);
          addr = tronWeb.address.fromHex(addr);
          let hash = event.transaction;
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
            });

          if (event.result.rollType == 0) {
            //Win Roll Under
            allTable += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + _nam+
              '</a></td><td>Under ' + event.result.prediction +
              '</td><td class="red_clr">' + event.result.lucky_number +
              '</td><td>' + _betVal+' ' +tokenNam+
              '</td><td class="' + classClrwin + '">' + payAfterWin+
              '</td></tr>';
          }else{
            allTable += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + _nam +
              '</a></td><td>OVER ' + event.result.prediction +
              '</td><td class="red_clr">' + event.result.lucky_number +
              '</td><td>' + _betVal+' ' +tokenNam+
              '</td><td class="' + classClrwin + '">' + payAfterWin+
              '</td></tr>';
          }
          document.querySelector(DOMStrings.allbetTableBody).innerHTML = allTable;

      });

    })
  }


  //////
  const findAlltrcbetdata = async() =>{
    let allTable = "";
    await tronWeb.getEventResult(trcGameAddress, {
      eventName:'trc10BetEvent',
      size: 50
      //onlyConfirmed: true
      //page: 2
    }).then(async data => {
      execute(0);
      async function execute(_x){
        if(data.length > _x){
          let event = data[_x];
          let addr = event.result.addr;
          addr = checksumHex(addr);
          addr = tronWeb.address.fromHex(addr);
          let hash = event.transaction;
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
            allTable += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + _nam+
              '</a></td><td>Under ' + event.result.prediction +
              '</td><td class="red_clr">' + event.result.lucky_number +
              '</td><td>' + _betVal+' ' +tokenNam+
              '</td><td class="' + classClrwin + '">' + payAfterWin+
              '</td></tr>';
          }else{
            allTable += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + _nam +
              '</a></td><td>OVER ' + event.result.prediction +
              '</td><td class="red_clr">' + event.result.lucky_number +
              '</td><td>' + _betVal+' ' +tokenNam+
              '</td><td class="' + classClrwin + '">' + payAfterWin+
              '</td></tr>';
          }
          });
          _x += 1;
          execute(_x);
        }else if (data.length == _x) {
          document.querySelector(DOMStrings.allbetTableBody).innerHTML = allTable;
        }
      }
    });
  }
  ///////////////////////////////////////////////////
  async function myHistory() {
    let allTable = "";
    let resultCount = 0;
    let myAddrChck = myDetails.myAddressInCheckSum;
    let addr = myDetails.myAddressInBase58;
    let name = shortAddress(addr);
    if(myDetails.myWalletName != ''){
      name = myDetails.myWalletName
    }
    await tronWeb.getEventResult(trcGameAddress, {
      eventName:'trc10BetEvent',
      size: 50,
      //onlyConfirmed: true,
      filters: {
        "addr": myAddrChck
      }

      //page: 2
    }).then(result => {
      //console.log(result);
      result.forEach(async(event) => {
          let tokenNam = PlayabletokenId[event.result.tokenId].name;
          let hash = event.transaction;
          let divider = 10 ** (PlayabletokenId[event.result.tokenId].precision);
          //let paytrx = Math.floor(event.result.payOut / 1e4)/100;
          let classClrwin = '';

          let payAfterWin = 0;
          if (event.result.payOut != 0) {
            classClrwin = 'greenCell';

            payAfterWin = floor((event.result.payOut)/divider,2)+' '+tokenNam;
          }else {
            classClrwin ='redCell';
          }

          if (event.result.rollType == 0) {
            //Win Roll Under
            allTable += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + name +
              '</a></td><td>Under ' + event.result.prediction +
              '</td><td class="red_clr">' + event.result.lucky_number +
              '</td><td>' + (event.result.betAmount) / divider+' ' +tokenNam+
              '</td><td class="' + classClrwin + '">' + payAfterWin +
              '</td></tr>';
          }else{
            allTable += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + name +
              '</a></td><td>OVER ' + event.result.prediction +
              '</td><td class="red_clr">' + event.result.lucky_number +
              '</td><td>' + (event.result.betAmount) / divider+' ' +tokenNam+
              '</td><td class="' + classClrwin + '">' + payAfterWin +
              '</td></tr>';
          }
          document.querySelector(DOMStrings.mybetTableBody).innerHTML = allTable;

      });

    })
  }
  //////////////////////////////
  var hash = '';
  async function watchNewtrcBet() {
		let newBet = '';
    let myAddrChck = myDetails.myAddressInCheckSum;
    let myaddr = myDetails.myAddressInBase58;
		let contract = await tronWeb.contract().at(trcGameAddress);
		let x = await contract.trc10BetEvent().watch(async (err, res) => {
      if (err) return console.error('Error with "method" event:', err)
			if (res && res.transaction != hash){
        hash = res.transaction;
        //console.info(res.transaction);
        //console.log(res);
        let addr = res.result.addr;
        addr = checksumHex(addr);
        addr = tronWeb.address.fromHex(addr);
        let _nam = shortAddress(addr);
        await tronWeb.trx.getAccount(addr).then(async result =>{

          if(result.account_name){
            _nam =  tronWeb.toAscii(result.account_name);

          }
        });

        let tokenNam = PlayabletokenId[res.result.tokenId].name;
        let divider = 10 ** (PlayabletokenId[res.result.tokenId].precision);
				//console.log(res);
        let payAfterWin = 0;
        let classClrwin = '';
        if (res.result.payOut != 0) {
          classClrwin = 'greenCell';

          payAfterWin = floor((res.result.payOut)/divider,2)+' '+tokenNam;
        }else {
          classClrwin ='redCell';
        }

        if (res.result.rollType == 0) {
          //Win Roll Under
          newBet += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + _nam +
            '</a></td><td>Under ' + res.result.prediction +
            '</td><td class="red_clr">' + res.result.lucky_number +
            '</td><td>' + (res.result.betAmount) / divider+' ' +tokenNam+
            '</td><td class="' + classClrwin + '">' + payAfterWin +
            '</td></tr>';
        }else{
          newBet += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + _nam +
            '</a></td><td>OVER ' + res.result.prediction +
            '</td><td class="red_clr">' + res.result.lucky_number +
            '</td><td>' + (res.result.betAmount) / divider+' ' +tokenNam+
            '</td><td class="' + classClrwin + '">' + payAfterWin +
            '</td></tr>';
        }
				$('tbody.allBetsHistory').prepend(newBet);
        $('tbody.allBetsHistory ').find('tr:nth-of-type(101)').remove();
        if(addr == myaddr){
          _luckNum = res.result.lucky_number;
          payOnwinToken = res.result.payOut;
          $('tbody.myBetsHistory').prepend(newBet);
          $('tbody.myBetsHistory ').find('tr:nth-of-type(101)').remove();
        }

				newBet = '';

			}
		});
	}
  const restartWatch = async () =>{
    await watchNewtrcBet.stop();
    await watchNewtrcBet();
  }
  // const refresh = async () =>{
  //   setInterval(function(){
  //     if(myDetails.myAddressInBase58 != ''){
  //     allHistory();
  //     myHistory();
  //   }
  //   },3000);
  // }
  const hisInItUi = async () => {

      //findAlltrcbetdata();
      allHistory();
      myHistory();
      watchNewtrcBet();


  }
  return {
    'hisInItUi':hisInItUi,
    'restartWatch':restartWatch
  }
})();
