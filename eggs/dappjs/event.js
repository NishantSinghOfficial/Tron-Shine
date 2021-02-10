
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
var payOnwinTrx = 0;

const dappArr = ['null','forbox','forHeart','foregg','forstar'];
const winMsg = '<div class="box-sm greenBox"><i class="far fa-check-circle"></i> WON</div>';
const loseMsg = '<div class="box-sm redBox"><i class="far fa-times-circle"></i> LOST</div>';
const alertMinBal = '<div class="box-sm redBox"> Not enough Balance</div>';
function afterWin(){
  let winsound = new Audio("../sound/succeeding.wav");
  winsound.play();
  $(DOMStrings.resultPop).html(winMsg);
}
function afterLost(){
  let loosesound = new Audio("../sound/failure.wav");
  loosesound.play();
  $(DOMStrings.resultPop).html(loseMsg);
}


var publicbars = (function(){

  const freezeContract='';
  const sixZero = 1000000;



  ///////////////////////////////////////////////////
  async function customBets() {
    let allTable = "";
    //console.log(thisDappName +' thisDappName');
    await tronWeb.getEventResult(barsctrt, {
      eventName:'barsbetevent',
      size: 50,
      //onlyConfirmed: true,
      filters: {
        dappType: thisDappName
      }

      //page: 2
    }).then(async result => {

      result.forEach(async(res) => {
        //console.log(res);
        let hash = res.transaction;
        let _checkAddr = res.result.addr;
        prakash.userData.myDetail.fromChecksum(_checkAddr).then(data =>{

          //console.log(data);
          let name =shortAddress(data[0].address);

          if (data[0].name != '') {
             name = data[0].name;
          }
          //let paytrx = Math.floor(event.result.payOut / 1e4)/100;

          let classClrwin = 'redCell';
          let payAfterWin = 0;
          if (res.result.payOut != 0) {
            classClrwin = 'greenCell';
            payAfterWin = res.result.payOut/sixZero + ' TRX';
          }


          allTable += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + name +
            '</a></td><td><span class="'+resultOutcome[res.result.prediction]+' '+dappArr[thisDappName]+'"></span></td><td><span class="' + resultOutcome[res.result.lucky_number] +' '+dappArr[thisDappName]+
            '"></span></td><td>' + (res.result.betAmount) / sixZero+' TRX'+
            '</td><td class="' + classClrwin + '">' + payAfterWin +
            '</td></tr>';
            //console.log(allTable);
          document.querySelector(DOMStrings.custombetTableBody).innerHTML = allTable;
        });
      });

    });

}


///////////////////////////////////////////////////
async function myHistory() {
  //console.log(myDetails);
  let allTable = "";
  let resultCount = 0;
  let myAddrChck = myDetails.myAddressInCheckSum;
  let addr = myDetails.myAddressInBase58;
  let name = shortAddress(addr);
  if(myDetails.myWalletName != ''){
    name = myDetails.myWalletName;
  }
  //console.log(myDetails);
  //console.log('name on the tronlink is'+name);
  await tronWeb.getEventResult(barsctrt, {
    eventName:'barsbetevent',
    size: 50,
    //onlyConfirmed: true,
    filters: {
      addr: myAddrChck,
      dappType: thisDappName
    }

    //page: 2
  }).then(async result => {
    //console.log(result);
    result.forEach(async(res) => {

        let hash = event.transaction;
        //let paytrx = Math.floor(event.result.payOut / 1e4)/100;
        let classClrwin = 'redCell';
        let payAfterWin = 0;
        if (res.result.payOut != 0) {
          classClrwin = 'greenCell';
          payAfterWin = res.result.payOut/sixZero + ' TRX';
        }

        allTable += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + name +
          '</a></td><td><span class="'+resultOutcome[res.result.prediction]+' '+dappArr[thisDappName]+'"></span></td><td><span class="' + resultOutcome[res.result.lucky_number] +' '+dappArr[thisDappName]+
          '"></span></td><td>' + (res.result.betAmount) / sixZero+' TRX'+
          '</td><td class="' + classClrwin + '">' + payAfterWin +
          '</td></tr>';
        document.querySelector(DOMStrings.mybetTableBody).innerHTML = allTable;

    });

  });
}

  //////////////////////////////
  var hash = '';
  async function watchNewBarsBet() {
    let newBet = '';
    //console.log(barsctrt);
    let barsContract = await tronWeb.contract().at(barsctrt);
    let x = await barsContract.barsbetevent().watch(async (err, res) => {
      if (err) return console.error('Error with "method" event:', err)
      if (res) {

        if (res.transaction == hash) return console.info('duplicate');
        //console.log(res);
        hash = res.transaction;
        let _checkAddr = res.result.addr;
        _checkAddr = hexChecksum(_checkAddr);
        console.log(hash);
        console.log(remainingBetHash);
        if(remainingBetHash.indexOf(hash) !== -1){
          console.log(remainingBetHash);
          remainingBetHash.splice(remainingBetHash.indexOf(hash), 1 );
          console.log(remainingBetHash);
          resultCol = res.result.lucky_number;
          payOnwinTrx = res.result.payOut;

          if(ultaStopped == 0){
            let _new =  '<span id="'+color[0]+'"></span>';
            $(rouletteDom.numDiv).append(_new);
            $(rouletteDom.numDiv).find('span:nth-of-type(1)').remove();
          }

          $('.main-game-panel img').removeClass('start-spining');
          let _resultBox =  '<span id="'+color[resultCol]+'"></span>';
          $(rouletteDom.numDiv).find('span:nth-of-type(16)').attr('id', color[resultCol]);
          if(res.result.payOut > 0){
            afterWin();
            balWonAnim(payOnwinTrx);
          }else {
            afterLost();
          }
          try {
            let _betVal = res.result.betAmount;
            await prakash.updateDB.myBetRecord(_checkAddr,_betVal,payOnwinTrx);
          } catch (e) {
            console.log(e);
          }
        }
        //console.info(res.transaction);
        //console.log(res);

        //console.log(myDetails.myAddressInHex + '  '+_checkAddr);
        prakash.userData.myDetail.fromChecksum(_checkAddr).then(async data =>{

          //console.log(data);
          let name =shortAddress(data[0].address);

          if (data[0].name != '') {
             name = data[0].name;
          }
          //console.log(_nam);



        //console.log(res);
        let payAfterWin = 0;
        let classClrwin = '';
        if (res.result.payOut != 0) {
          classClrwin = 'greenCell';

          payAfterWin = floor((res.result.payOut)/sixZero,2);
        }else {
          classClrwin ='redCell';
        }
        let _dappType = 'forbox';
        if(res.result.dappType == 2){
          _dappType = 'forHeart';
        }else if(res.result.dappType == 3){
          _dappType = 'foregg';
        }else if(res.result.dappType == 4){
          _dappType = 'forstar';
        }
        let _betVal = (res.result.betAmount) / sixZero;



          newBet += '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + name +
            '</a></td><td><span class="'+resultOutcome[res.result.prediction]+' '+_dappType+'"></span></td><td><span class="' + resultOutcome[res.result.lucky_number] +' '+_dappType+
            '"></span></td><td>' + _betVal+' TRX'+
            '</td><td class="' + classClrwin + '">' + payAfterWin +
            ' TRX</td></tr>';

        $(DOMStrings.allbetTableBody).prepend(newBet);
        $(DOMStrings.allbetTableBody).find('tr:nth-of-type(101)').remove();
        if(res.result.dappType == thisDappName){
          $(DOMStrings.custombetTableBody).prepend(newBet);
          $(DOMStrings.custombetTableBody).find('tr:nth-of-type(101)').remove();

          if (_checkAddr == myDetails.myAddressInCheckSum) {
            $(DOMStrings.mybetTableBody).prepend(newBet);
            $(DOMStrings.mybetTableBody).find('tr:nth-of-type(101)').remove();
          }



        }

        newBet = '';
        });
      }
      else {
        console.log(err);
      }


    })
  }




   const publicInfoinitUi = async () => {
     customBets();
     myHistory();
     watchNewBarsBet();

   }
   return {
 		"publicInfoinitUi": publicInfoinitUi
 	}



})();
