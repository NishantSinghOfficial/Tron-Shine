

var bethistory = (function(){
  const sixZero = 1000000;
  var winMsg = '<div class="box-sm greenBox"><i class="far fa-check-circle"></i> WON</div>';
  var loseMsg = '<div class="box-sm redBox"><i class="far fa-times-circle"></i> LOST</div>';
  //////////Checksum~to~hex~offline//////////////////
  function checksumHex(checksum) {
    let res = checksum.substr(2);
    let hex = "41" + res;
    return hex;

  }
  function shortAddress(address) {
    if(address =='') return null;
    let start = address.substring(0, 4);
    let end = address.substring(address.length - 4, address.length)
    let short = start + "..." + end;
    return short;
  }

  //
  const findAllbetdata = async() =>{
    let allTable = "";
    await tronWeb.getEventResult(diceGame, {
      eventName:'dicebetevent',
      size: 100
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
          let _nam = shortAddress(addr);
          await tronWeb.trx.getAccount(addr).then(async result =>{

            if(result.account_name){
              _nam =  tronWeb.toAscii(result.account_name);

            }
            //console.log(_nam);

          //let paytrx = Math.floor(event.result.payOut / 1e4)/100;
          let classClrwin = 'redCell';
          if (event.result.payOut != 0) {
            classClrwin = 'greenCell';
          }

          if (event.result.rollType == 0) {
            //Win Roll Under
            allTable += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + _nam +
              '</a></td><td>Under ' + event.result.prediction +
              '</td><td class="' + classClrwin + '">' + event.result.lucky_number +
              '</td><td>' + (event.result.betAmount) / sixZero +
              ' TRX </td><td class="' + classClrwin + '">' + (event.result.payOut / sixZero) +
              ' TRX </td></tr>';
          }else{
            allTable += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + _nam +
              '</a></td><td>OVER ' + event.result.prediction +
              '</td><td class="' + classClrwin + '">' + event.result.lucky_number +
              '</td><td>' + (event.result.betAmount) / sixZero +
              ' TRX </td><td class="' + classClrwin + '">' + (event.result.payOut / sixZero) +
              ' TRX </td></tr>';
          }





          });

          //console.log(_x);
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
    if(myDetails.myWalletName != '' && myDetails.myWalletName != undefined){
      name = myDetails.myWalletName
    }
    //console.log('name on the tronlink is'+name);
    await tronWeb.getEventResult(diceGame, {
      eventName:'dicebetevent',
      size: 100,
      //onlyConfirmed: true,
      filters: {
        "addr": myAddrChck
      }

      //page: 2
    }).then(async result => {
      //console.log(result);
      result.forEach(async(event) => {

          let hash = event.transaction;
          //let paytrx = Math.floor(event.result.payOut / 1e4)/100;
          let classClrwin = 'redCell';
          if (event.result.payOut != 0) {
            classClrwin = 'greenCell';
          }

          if (event.result.rollType == 0) {
            //Win Roll Under
            allTable += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + name +
              '</a></td><td>Under ' + event.result.prediction +
              '</td><td class="' + classClrwin + '">' + event.result.lucky_number +
              '</td><td>' + (event.result.betAmount) / sixZero +
              ' TRX </td><td class="' + classClrwin + '">' + (event.result.payOut / sixZero) +
              ' TRX </td></tr>';
          }else{
            allTable += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' +name +
              '</a></td><td>OVER ' + event.result.prediction +
              '</td><td class="' + classClrwin + '">' + event.result.lucky_number +
              '</td><td>' + (event.result.betAmount) / sixZero +
              ' TRX </td><td class="' + classClrwin + '">' + (event.result.payOut / sixZero) +
              ' TRX </td></tr>';
          }
          document.querySelector(DOMStrings.mybetTableBody).innerHTML = allTable;

      });

    })
  }
  //////////////////////////////
  var mylastHash = '';
  async function watchNewBet() {
		let newBet = '';
    let myAddrChck = myDetails.myAddressInCheckSum;
    let myaddr = myDetails.myAddressInBase58;
		let contract = await tronWeb.contract().at(diceGame);
		await contract.dicebetevent().watch(async (err, res) => {
      if (err) return console.error('Error with "method" event:', err)
			if (res && res.transaction != mylastHash) {

        mylastHash = res.transaction;
        let hash = res.transaction;
        //console.info(res.result.lucky_number);
        //console.log(res);
        let _checkAddr = res.result.addr;
        _checkAddr = hexChecksum(_checkAddr);


        let addr = res.result.addr;
        addr = checksumHex(addr);
        addr = tronWeb.address.fromHex(addr);
        prakash.userData.myDetail.fromChecksum(_checkAddr).then(async data =>{

          //console.log(data);
          let name =shortAddress(data[0].address);

          if (data[0].name != '') {
             name = data[0].name;
          }
          //console.log(name);

				//console.log(res);
        let classClrwin = 'redCell';
        if (res.result.payOut != 0) {
          classClrwin = 'greenCell';
        }
        let _betVal = (res.result.betAmount) / sixZero;
        let payAfterWin = (res.result.payOut / sixZero);
        if (res.result.rollType == 0) {
          //Win Roll Under
          newBet += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + name +
            '</a></td><td>Under ' + res.result.prediction +
            '</td><td class="' + classClrwin + '">' + res.result.lucky_number +
            '</td><td>' + _betVal +
            ' TRX </td><td class="' + classClrwin + '">' + payAfterWin +
            ' TRX </td></tr>';
        }else{
          newBet += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + name +
            '</a></td><td>OVER ' + res.result.prediction +
            '</td><td class="' + classClrwin + '">' + res.result.lucky_number +
            '</td><td>' + _betVal +
            ' TRX </td><td class="' + classClrwin + '">' + payAfterWin +
            ' TRX </td></tr>';
        }
				$('tbody.allBetsHistory').prepend(newBet);
        $('tbody.allBetsHistory ').find('tr:nth-of-type(101)').remove();
        //console.log(addr + ' :: ' +myaddr );
        if(remainingBetHash.indexOf(hash) !== -1){
          remainingBetHash.splice(remainingBetHash.indexOf(hash), 1 );
          _luckyNum = res.result.lucky_number;
          payOnwinTrx = res.result.payOut;
          if(_luckyNum < 10){
            _luckyNum ='0'+_luckyNum;
          }
          $(DOMStrings.luckyDis).text(_luckyNum);

            try {
              await prakash.updateDB.myBetRecord(_checkAddr,_betVal,payAfterWin);
              console.log('success full insert');
            } catch (e) {
              console.log(e);
            }

          myDetails.myTrxBal = await tronWeb.trx.getUnconfirmedBalance(myaddr)/sixZero;
          $(DOMStrings.myTrxbal).text(floor(myDetails.myTrxBal,1));
            if(payOnwinTrx != 0){
              $(DOMStrings.luckyDis).css({
          			'color':'#c0ff07',
          			'text-shadow': '0 0 2px #001604'
          		});
              let winsound = new Audio("../sound/succeeding.wav");
    					winsound.play();
              $(DOMStrings.resultPop).html(winMsg);
    					//myDetails.myTrxBal += ((payOnwinTrx - res.result.betAmount)/sixZero);
    					//$(DOMStrings.myTrxbal).text(floor(myDetails.myTrxBal,1));
    					//console.log('win');
            }else {
              let loosesound = new Audio("../sound/failure.wav");
    					loosesound.play();
              $(DOMStrings.resultPop).html(loseMsg);
    					//myDetails.myTrxBal -= (res.result.betAmount/sixZero);
    					//$(DOMStrings.myTrxbal).text(floor(myDetails.myTrxBal,1));
              $(DOMStrings.luckyDis).css({
    						'color':'#ff0000',
    						'text-shadow': '0 0 2px #fff'
    					});
    					//console.log('loss');
            }
        }
        if (_checkAddr == myAddrChck) {
          $('tbody.myBetsHistory').prepend(newBet);
          $('tbody.myBetsHistory').find('tr:nth-of-type(101)').remove();
        }




			})
			newBet = '';
}
})
}

  const restartWatch = async () =>{
    //await watchNewBet.stop();
    await watchNewBet();
  }
  // const refresh = async () =>{
  //   setInterval(function(){
  //     allHistory();
  //     myHistory();
  //   },3000);
  // }
  const hisInItUi = async () => {
    //findAllbetdata();
    //allHistory();
    myHistory();
    watchNewBet();
    //console.log(myDetails);
  }
  return {
    'hisInItUi':hisInItUi,
    'restartWatch':restartWatch
  }
})();
