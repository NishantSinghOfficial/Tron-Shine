var myDetails = {
  loaded:'false',
  myAddressInHex:'',
  myAddressInBase58:'',
  myAddressInCheckSum:'',
  myWalletName:'',
  myTronName:'',
  myTrxBal:'',
  myMinedWithdrawable:'',
  myWager:'',
  myDiv:0,
  myShineBal:'',
  myFrozen:'',
  myApproveStatus:'',
  myApproveShine:'',
  myApproveTime:'',
  pendingTimeDiff:''
}
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
  if(address == '') return 'invalid Address';
  let start = address.substring(0, 4);
  let end = address.substring(address.length - 4, address.length)
  let short = start + "..." + end;
  return short;
}





var myInfo = (function(){
  const sixZero = 1000000;
  function floor(value,decimal){
    let _x = 10 ** decimal;
    return (Math.floor(value *_x) / _x)
  }


  //////////Hex~to~checksum/////////////////////////
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








  //////////////////
  // const myshine = async () => {
  //   let contract = await tronWeb.contract().at(shine);
	// 	let _val = await contract._balances(myDetails.myAddressInBase58).call();
  //   _val = tronWeb.toDecimal(_val);
  //   _val /= sixZero;
  //   _val = floor(_val,2);
  //   myDetails.myShineBal= _val;
  //   $(DOMStrings.freezeInput).val(_val);
  //}
  //////////////////////////
  const freezeShine = async() => {
    let shinecontract = await tronWeb.contract().at(shine);
		let _val = await shinecontract._balances(myDetails.myAddressInBase58).call();
    _val = tronWeb.toDecimal(_val)
    console.log(_val);
    let frzctrt = await tronWeb.contract().at(freezeAddr);
    console.log(_val);
    try {

      await frzctrt.freezeShine(_val).send({
        feeLimit: 2000000,
        //shouldPollResponse: true
      });
      $(DOMStrings.freezeBtn).attr("disabled", false);
      await dividendPopData();
    } catch (e) {
      console.log(e);
    }
  }
  ////////////////////////////////
  ///unfreeze request
// const myFrozen = async () => {
//   let contract = await tronWeb.contract().at(freezeAddr);
//   let _totalFrozen = await contract.TotalFrozen().call();
//   publicString.totalFrozen = floor(_totalFrozen/1e6,2);
//   $(DOMStrings.disTotalFrozen).text(publicString.totalFrozen);
//
//   let _myfrozen = await contract.myFrozen(myDetails.myAddressInBase58).call();
//   let _boolPending = await contract.isPending(myDetails.myAddressInBase58).call();
//   myDetails.myFrozen = floor(_myfrozen/sixZero,2);
//   $(DOMStrings.unfreezeInput).val(myDetails.myFrozen);
//   myDetails.myApproveStatus = _boolPending;
//   let _mExp = (myDetails.myFrozen / publicString.totalFrozen) * publicString.poolBalance;
//     _mExp = floor(_mExp,4);
//   $(DOMStrings.dismyExpTRX).text(_mExp);
//   if(_boolPending){
//     let _m = await contract.myUnfreeze(myDetails.myAddressInBase58).call();
//     _m = floor(_m/sixZero,2);
//     myDetails.myApproveShine = _m;
//     $(DOMStrings.disPendingAmt).text(_m);
//     let _n = await contract.myUnfreezeTime(myDetails.myAddressInBase58).call();
//     let _o = await contract.unfreezeTime().call();
//     myDetails.myApproveTime = tronWeb.toDecimal(_n);
//     myDetails.pendingTimeDiff = tronWeb.toDecimal(_o);
//     //console.log(myDetails);
//     unfreezePendingTimer();
//     $(DOMStrings.pendingBox).css('visibility','visible');
//   }
// }

const unfreezePendingTimer =  () =>{

      let _timeLeft = myDetails.myApproveTime + myDetails.pendingTimeDiff - (Date.now()/1000);
      _timeLeft = floor(_timeLeft,0);
      if(_timeLeft <= 0){
        $(DOMStrings.disPendingTimer).text('00:00:00');
        $(DOMStrings.approveBtn).css('visibility','visible');
      }else {
        var _setpendTiming = setInterval(function() {
          let _timestamp = _timeLeft;
          let hLeft = _timeLeft /3600;
          hLeft = floor(hLeft,0);
          _timeLeft = _timeLeft - (hLeft * 3600);
          let mleft = _timeLeft / 60;
          mleft = floor(mleft,0);
          let sleft = _timeLeft % 60;
          sleft = floor(sleft,0);
          $(DOMStrings.disPendingTimer).text(hLeft+':'+mleft+':'+sleft);
          _timestamp -= 1;
          _timeLeft = _timestamp;
          if (_timeLeft <= 0) {
            clearInterval(_setpendTiming);
            $(DOMStrings.disPendingTimer).text('00:00:00');
            $(DOMStrings.approveBtn).css('visibility','visible');
          }
        },1000);
      }
      $(DOMStrings.disPendingTimer).text();
}

//check If pending
const unfreezeShine  = async () =>{
  let contract = await tronWeb.contract().at(freezeAddr);
  try {
    let _value = await contract.unfreezeShineRequest().send({
      feeLimit: 2000000,
      //shouldPollResponse: true
    });
    await dividendPopData();
    $(DOMStrings.unfreezeBtn).attr("disabled", false);
  } catch (e) {
    console.log(e);
  }
}
const approvePending = async () =>{
    let contract = await tronWeb.contract().at(freezeAddr);
    let _time = await contract.myUnfreezeTime(myDetails.myAddressInBase58).call();
    console.log(Date.now()/1e3 - _time);
    try {
      let _value = contract.unfreezeShine(myDetails.myAddressInCheckSum).send({
        feeLimit: 2000000,
        //shouldPollResponse: true
      });
      await dividendPopData();
      $(DOMStrings.approveBtn).attr("disabled", false);
    } catch (e) {

        console.log(e);
    }
}



  //myMined withdraw and wager info
  // const minedAndWager = async () =>{
  //
  //   let diceCtrt = await tronWeb.contract().at(diceGame);
  //
  //    let _x= await diceCtrt.myMined(myDetails.myAddressInBase58).call();
  //
  //    let _y = await diceCtrt.myWager(myDetails.myAddressInBase58).call();
  //    _x =await  tronWeb.toDecimal(_x);
  //    _y =await  tronWeb.toDecimal(_y);
  //    myDetails.myWager = _y;
  //    _x /= sixZero;
  //    _x = floor(_x,2);
  //    myDetails.myMinedWithdrawable = _x;
  //    $(DOMStrings.minedInput).val(_x);
  //    $(DOMStrings.disMinedOnMain).text(_x);
  // }
/////////////////////////////

const withdrawMined = async() => {
  let miningCtrt = await tronWeb.contract().at(miningAddr);
  try {

    await miningCtrt.withdrawMined(myDetails.myAddressInBase58).send({
      feeLimit: 2000000,
      //shouldPollResponse: true
    });
    await dividendPopData();
    $(DOMStrings.withdrawBtn).attr("disabled", false);
  } catch (e) {
    console.log(e);
  }
}
//update dividend popup data
const dividendPopData = async ()=>{
  let frzctrt = await tronWeb.contract().at(freezeAddr);
  let diceCtrt = await tronWeb.contract().at(diceGame);
  let shinecontract = await tronWeb.contract().at(shine);
  let miningCtrt = await tronWeb.contract().at(miningAddr);
  let _myShine = tronWeb.toDecimal(await shinecontract._balances(myDetails.myAddressInBase58).call());
  myDetails.myShineBal = floor(_myShine/sixZero,2);
  let _x= tronWeb.toDecimal(await miningCtrt.myMined(myDetails.myAddressInBase58).call());
   _x = floor(_x/sixZero,2);
   myDetails.myMinedWithdrawable = _x;
  let _y = tronWeb.toDecimal(await frzctrt.myFrozen(myDetails.myAddressInBase58).call());
  myDetails.myFrozen = floor(_y/sixZero,2);
  let _z = tronWeb.toDecimal(await frzctrt.TotalFrozen().call());
  publicString.totalFrozen = floor(_z/sixZero,2);
  let thisStageNum = tronWeb.toDecimal(await miningCtrt.miningStage().call());
  publicString.stageCount = thisStageNum;
  let thisStageMined = tronWeb.toDecimal(await miningCtrt.thisMiningLeft().call());
  thisStageMined = 5000000 - (thisStageMined/sixZero);
  publicString.thisStageMined = floor(thisStageMined,2);
  let _totalMined = (5000000 * (thisStageNum - 1)) + thisStageMined;
  publicString.totalMined = floor(_totalMined,2);
  let _pool1 = await tronWeb.trx.getUnconfirmedBalance(diceGame) - 10000000000;
  let _pool2 = await tronWeb.trx.getUnconfirmedBalance(barsctrt) - 10000000000;
  let _pool = _pool1 + _pool2;
  publicString.poolBalance  = floor(_pool/sixZero,2);
  let _myDiv = 0;
  if(publicString.poolBalance > 0){
    _pool *= 0.7;
    publicString.poolBalance  = floor(_pool/sixZero,2);
    _myDiv = publicString.poolBalance * myDetails.myFrozen /publicString.totalFrozen;

  }
  myDetails.myDiv= floor(_myDiv,4);

  ///////////display from Here
  $(DOMStrings.disthisStageMined).text(publicString.thisStageMined + ' / 5,000,000');
  $(DOMStrings.poolTrx).text(publicString.poolBalance + ' TRX');
  $(DOMStrings.disTotalMined).text(publicString.totalMined);
  $(DOMStrings.disTotalFrozen).text(publicString.totalFrozen);
  $(DOMStrings.dismyExpTRX).text(myDetails.myDiv);
  $(DOMStrings.minedInput).val(myDetails.myMinedWithdrawable);
  $(DOMStrings.unfreezeInput).val(myDetails.myFrozen);
  $(DOMStrings.freezeInput).val(myDetails.myShineBal);
  $(DOMStrings.disMinedOnMain).text(myDetails.myMinedWithdrawable);

  let _boolPending = await frzctrt.isPending(myDetails.myAddressInBase58).call();
  if(_boolPending){
    let _m = await frzctrt.myUnfreeze(myDetails.myAddressInBase58).call();
    _m = floor(_m/sixZero,2);
    myDetails.myApproveShine = _m;
    $(DOMStrings.disPendingAmt).text(_m);
    let _n = await frzctrt.myUnfreezeTime(myDetails.myAddressInBase58).call();
    let _o = await frzctrt.unfreezeTime().call();
    myDetails.myApproveTime = tronWeb.toDecimal(_n);
    myDetails.pendingTimeDiff = tronWeb.toDecimal(_o);
    //console.log(myDetails);
    unfreezePendingTimer();
    $(DOMStrings.pendingBox).css('visibility','visible');
  }
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
    publicString.totaltrxn = res.data[0].trxCount + res2.data[0].trxCount + 125428;
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


}

//////////////update profile box
const profileUpdate = async() =>{
  await apicall();
let frzctrt = await tronWeb.contract().at(freezeAddr);
let diceCtrt = await tronWeb.contract().at(diceGame);
let miningCtrt = await tronWeb.contract().at(miningAddr);
let _x = tronWeb.toDecimal(await miningCtrt.myWager(myDetails.myAddressInBase58).call());
myDetails.myWager = floor(_x,2);
let _y = tronWeb.toDecimal(await frzctrt.myFrozen(myDetails.myAddressInBase58).call());
myDetails.myFrozen = floor(_y/sixZero,2);
let _z = tronWeb.toDecimal(await frzctrt.TotalFrozen().call());
publicString.totalFrozen = floor(_z/sixZero,2);
let thisStageNum = tronWeb.toDecimal(await miningCtrt.miningStage().call());
publicString.stageCount = thisStageNum;
let thisStageMined = tronWeb.toDecimal(await miningCtrt.thisMiningLeft().call());
thisStageMined = 5000000 - (thisStageMined/sixZero);
publicString.thisStageMined = floor(thisStageMined,2);
let _n = 0;
for (var i = 0; i < thisStageNum;  i++) {
  let _p = 100 + i;
  if(i < thisStageNum - 1){
    _n += (_p * 5000000);
  }else {
    _n += (_p * thisStageMined);
  }

}
publicString.totalWager = floor(_n,2);
$('p#myFrozen').text(myDetails.myFrozen);
$('p#totalFrozen').text(publicString.totalFrozen);
$('p#myWager').text(myDetails.myWager);
$('p#totalWager').text(publicString.totalWager);

await tronWeb.trx.getAccount(trcGameAddress).then(async result =>{
  let _tab = '';
  let _mul = myDetails.myFrozen /publicString.totalFrozen;
      Object.keys(PlayabletokenId).forEach(async res => {

        for (var i = 0; i < result.assetV2.length; i++) {
        if(res == result.assetV2[i].key){
          let _pool = result.assetV2[i].value/(10 ** PlayabletokenId[res].precision);

          _pool -= PlayabletokenId[res].poolLmtToken;
          _pool /= 2;
          _pool = floor(_pool,2)
          let _myexp = 0;
          if(_pool > 0){
            _myexp = _mul * _pool;
           _myexp = floor(_myexp,2);
          }
          //console.log(_pool);

          PlayabletokenId[res].poolBal = _pool;
          if(res != 1001909){
            _tab += '<tr scope="row"><th>'+PlayabletokenId[res].name+
            '</th><td>'+_pool+
            '</td><td>'+_myexp+
            '</td></tr>';
          }


        }
      }


        //console.log(PlayabletokenId);
           });
           $('.profileTable tbody').html(_tab);
  });

}




  const myInfoinitUi = async () => {
     //await myInfo();
     //await minedAndWager();
     await dividendPopData();
     await profileUpdate();
    //console.log(myDetails);
  }
  return {
		"myInfoinitUi": myInfoinitUi,
    "withdrawMined":withdrawMined,
    "freezeShine":freezeShine,
    "unfreezeShine":unfreezeShine,
    "approvePending":approvePending,
    "profileUpdate":profileUpdate,
    "dividendPopData":dividendPopData
	}

})();

$(DOMStrings.withdrawBtn).click(function(e){
  e.preventDefault();
  $(DOMStrings.withdrawBtn).attr("disabled", true);
  myInfo.withdrawMined();
});
$(DOMStrings.freezeBtn).click(function(e){
  e.preventDefault();
  $(DOMStrings.freezeBtn).attr("disabled", true);
  myInfo.freezeShine();
});
$(DOMStrings.unfreezeBtn).click(function(e){
  e.preventDefault();
  $(DOMStrings.unfreezeBtn).attr("disabled", true);
  myInfo.unfreezeShine();
});
$(DOMStrings.approveBtn).click(function(e){
  e.preventDefault();
  $(DOMStrings.approveBtn).attr("disabled", true);
  myInfo.approvePending();
});
