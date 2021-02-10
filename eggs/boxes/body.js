

var resultCol = 0;
const thisDappName = '1';
var ultaStopped;

var bars =(function(){


var setAuto = null;
var canPlace = 0;

var setrollanim;

function floor(value,decimal){
  let _x = 10 ** decimal;
  return (Math.floor(value *_x) / _x)
}

const fetchdata = async () =>{

    let _x = await tronWeb.trx.getUnconfirmedBalance(myDetails.myAddressInBase58);
    _x /= sixZero
    _x = floor(_x,1);

    let miningContract = await tronWeb.contract().at(miningAddr);
    let _mined = await miningContract.myMined(myDetails.myAddressInBase58).call();
    _mined /= sixZero;
    _mined = floor(_mined,2);
    $('.lower-left p span').text(_x);
    $('.lower-right p span').text(_mined);

}



const bet = async ()=>{
  //console.log(barsctrt);
  let barsContract = await tronWeb.contract().at(barsctrt);
  try {
    let _betOn = betObject.on;
    let _betVal = betObject.amount;
    let _result = await barsContract.betOnBoxes(_betOn).send({
      feeLimit: 20000000,
      callValue: _betVal,
      //shouldPollResponse: true
    });
    remainingBetHash.push(_result);
    findResult(_result);
    balDeductionAnim(_betVal);
    console.log(remainingBetHash);
    fetchdata();
    rollingAnimation();
    console.log('successfull bet');
  } catch (e) {
    console.log(e);

  }

}
const set = async ()=>{
  let barsContract = await tronWeb.contract().at(miningAddr);
  try {
    console.log('started game setting');
    await barsContract.addDapp(barsctrt).send({
      //feeLimit: 20000000,
      //callValue: 10000000,
      shouldPollResponse: true
    });
    console.log('game set');
  } catch (e) {
    console.log(e);
  }

}
const autoBetting = async() =>
{
  let barsContract = await tronWeb.contract().at(barsctrt);
  console.log('auto started');
  let _betOn = betObject.on;
  let _betVal = betObject.amount;

  setAuto = setInterval(async function ()
  {
    if (canPlace == 0 )
    {
      canPlace = 1;
    try
    {
        let _result = await barsContract.betOnBoxes(_betOn).send({
          feeLimit: 20000000,
          callValue: _betVal
        });
        remainingBetHash.push(_result);
        findResult(_result);
        balDeductionAnim(_betVal);
        console.log(remainingBetHash);
        fetchdata();
        $(DOMStrings.RollBtn).text('Rolling');
        let _time = Date.now();
        rollingAnimation();
        _result = 0;
    }
    catch (e)
    {
      clearInterval(setrollanim);

      $(DOMStrings.RollBtn).text('Roll');
      console.log(e + ' error in bet placing');
      canPlace = 0;
    }
  }
  }, 3000);
}

//////////////////////////////
const clearAutobet = async() =>
{
  console.log('about to close');
  $(DOMStrings.RollBtn).attr("disabled", false);
  clearInterval(setAuto);
  console.log('closed');
}


const rollingAnimation = async () =>{
  //console.log(_timeNow +'  '+Date.now());
  setrollanim = setInterval(function(){
    $('.main-game-panel img').addClass('start-spining');
    let _num = Math.random() * 100;
    let _secondnum = Math.random() * 100;
    _secondnum = Math.floor(_secondnum);
    _num = Math.floor(_num);
    let _spanval = (_num%32)+1;
    let _spanColorCode = (_secondnum % 4)+1;
     let _new =  '<span id="'+color[_spanColorCode]+'"></span>';

    $(rouletteDom.numDiv).append(_new);
    $(rouletteDom.numDiv).find('span:nth-of-type(1)').remove();
    if(resultCol != 0){
      $('.main-game-panel img').removeClass('start-spining');
      console.log(resultCol);
      console.log(color[resultCol]);
      clearInterval(setrollanim);
      let _resultBox =  '<span id="'+color[resultCol]+'"></span>';
      $(rouletteDom.numDiv).find('span:nth-of-type(16)').attr('id', color[resultCol]);

      canPlace = 0;
      resultCol = 0;
      //console.log('off anim');

    }
  },30);
}

////////function for ultra speed betting

	const ultraBetting = async () =>{
    let barsContract = await tronWeb.contract().at(barsctrt);
    console.log('ultra started');
    let _betOn = betObject.on;
    let _betVal = betObject.amount;
		let canUltra =0;
    let _con = (myDetails.myTrxBal) * sixZero;
    $(rouletteDom.numDiv).find('span').attr('id', color[0]);
    ultraBet();
    async function ultraBet(){
      if( _con < _betVal) return	$(DOMStrings.resultPop).html(alertMinBal);
      ultaStopped =0;
      try {
        $(DOMStrings.RollBtn).text('Rolling');

      let _result = await barsContract.betOnBoxes(_betOn).send(
      {
        feeLimit: 20000000,
        callValue: _betVal
        //shouldPollResponse: true
      });
      remainingBetHash.push(_result);
      findResult(_result);
      balDeductionAnim(_betVal);
      console.log(remainingBetHash);
      console.log(_result);
      fetchdata();
      $(DOMStrings.RollBtn).text('Roll');
      if(ultaStopped == 0){
        ultraBet();
      }

      } catch (e) {
        console.log(e);
        $(DOMStrings.RollBtn).text('Roll');
        canUltra = 0;
      }


    }

	}

//clear ultra speed betting
const clearultrabet = async() =>
{
  console.log('about to close ultra');

  ultaStopped =1;
  $(DOMStrings.RollBtn).attr("disabled", false);
  console.log('closed');
}
/////fetch result in other way
const findResult = async (hashId) =>{
  const findSetAnim = setInterval(async function(){

    if (remainingBetHash.indexOf(hashId) !== -1) {
     await tronWeb.getEventByTransactionID(hashId).then(async res =>{

       if(res.length != 0){
         if (remainingBetHash.indexOf(hashId) !== -1) {
         remainingBetHash.splice(remainingBetHash.indexOf(hashId), 1 );
         console.log(res[0]);
         console.log('other way');
         clearInterval(findSetAnim);

         resultCol = res[0].result.lucky_number;
         payOnwinTrx = res[0].result.payOut;
         if (ultaStopped == 0) {
           let _new =  '<span id="'+color[0]+'"></span>';
           $(rouletteDom.numDiv).append(_new);
           $(rouletteDom.numDiv).find('span:nth-of-type(1)').remove();
         }
         $('.main-game-panel img').removeClass('start-spining');
         let _resultBox =  '<span id="'+color[resultCol]+'"></span>';
         $(rouletteDom.numDiv).find('span:nth-of-type(16)').attr('id', color[resultCol]);
         if (payOnwinTrx > 0) {
           afterWin();
           balWonAnim(payOnwinTrx);
         }else {
           afterLost();

         }
         try {
           await prakash.updateDB.myBetRecord(myDetails.myAddressInCheckSum,betObject.amount,payOnwinTrx);
           console.log('success full insert');
         } catch (e) {
           console.log(e);
         }
       }
     }
     });
   }

  },1000);

}
  const inituibars = async() =>{
    fetchdata();
  }
  return{
    "set":set,
    'inituibars': inituibars,
		'bet': bet,
		'autoBetting': autoBetting,
		'clearAutobet': clearAutobet,
		'ultraBetting':ultraBetting,
		'clearultrabet':clearultrabet
  }


})();

var underAutoMode = 0;
var underUltraMode = 0;
var  _betName = '';
$(DOMStrings.RollBtn).click(function (e)
{
	console.log('rolling');
	e.preventDefault();
	$(DOMStrings.RollBtn).attr("disabled", true);
	if ($(DOMStrings.autoBetToggle).is(":checked") && underAutoMode == 0 && underUltraMode == 0)
	{
		underAutoMode = 1;
		bars.autoBetting();
	}else if ($(DOMStrings.ultraBetTogglr).is(":checked") && underUltraMode == 0 && underAutoMode == 0){
		underUltraMode = 1;
		_betName = $(DOMStrings.RollBtn).text();
    $(rouletteDom.numDiv).find('span').attr('id',color[0]);
		bars.ultraBetting();
		console.log('logultramode');

	}
	else if (underAutoMode == 0 && underUltraMode == 0)
	{

		bars.bet();
    $(DOMStrings.RollBtn).attr("disabled", false);

	}
});


$(DOMStrings.autoBetToggle).change(function ()
{

	console.log('end auto');
	if ($(DOMStrings.autoBetToggle).not(":checked") && underAutoMode == 1)
	{
		bars.clearAutobet();
		console.log('ended auto');
		underAutoMode = 0;
	}
});

/////////

$(DOMStrings.ultraBetTogglr).change(function ()
{
	console.log('end auto');
	if ($(this).not(":checked") && underUltraMode == 1)
	{

		bars.clearultrabet();
    generateNum.initui();
		$(DOMStrings.RollBtn).text('Roll');
		console.log('ended ultra');
		underUltraMode = 0;
	}
});
