var _luckyNum = 100;
var payOnwinTrx = 0;
var dice = (function ()
{
	var setAuto = null;
	var sixZero = 1000000;
	var canPlace = 0;

	var setrollanim;

  var winMsg = '<div class="box-sm greenBox"><i class="far fa-check-circle"></i> WON</div>';
  var loseMsg = '<div class="box-sm redBox"><i class="far fa-times-circle"></i> LOST</div>';
	var alertMinBal = '<div class="box-sm redBox"> Not enough Balance</div>';

	function floor(value,decimal){
    let _x = 10 ** decimal;
    return (Math.floor(value *_x) / _x)
  }

	const bet = async() =>
	{
		let diceCtrt = await tronWeb.contract().at(diceGame);
		try
		{

			//console.log(betBuilder);
			let _x = betBuilder.betDirection;
			let _y = betBuilder.betPrediction;
			let _z = betBuilder.betAmount;
			let _con = (myDetails.myTrxBal) * sixZero;
			if( _con < _z)
			return	$(DOMStrings.resultPop).html(alertMinBal);

			let _result = await diceCtrt.betDice(_x, _y).send(
			{
				feeLimit: 2000000,
				callValue: _z,
				//shouldPollResponse: true
			});
			remainingBetHash.push(_result);
			findResult(_result);
			refreshBal();
			//console.log(remainingBetHash);
			// await tronWeb.trx.getUnconfirmedTransactionInfo(_result).then(async resid =>{
			//
			// 	//console.log(resid.receipt.energy_usage_total);
			// 	myDetails.myTrxBal -= resid.receipt.energy_usage_total;
			// });


			$(DOMStrings.balanceAnim).html('<p class="balDeduct">'+_z/1e6+'</p>');
			$(DOMStrings.RollBtn).text('Rolling');
			let _time = Date.now();
			rollingEffect(_y,_x,_z,_result,_time);
			_result = '';
			//console.log(_luckyNum);
		}
		catch (e)
		{
			clearInterval(setrollanim);
			let name = '';
			if(_x == 1){
				name = 'Roll Over ' +_y;
			}else {
				name = 'Roll Under ' +_y;
			}
			$(DOMStrings.RollBtn).text(name);
			console.log(e);
			$(DOMStrings.RollBtn).attr("disabled", false);
		}

	}


	const autoBetting = async() =>
	{
		let diceCtrt = await tronWeb.contract().at(diceGame);
		console.log('auto started');
		let _x = betBuilder.betDirection;
		let _y = betBuilder.betPrediction;
		let _z = betBuilder.betAmount;
		setAuto = setInterval(async function ()
		{
			if (canPlace == 0 && (myDetails.myTrxBal * sixZero) > _z)
			{
				canPlace = 1;
			try
			{



					//console.log(betBuilder);


					let _result = await diceCtrt.betDice(_x, _y).send(
					{
						feeLimit: 20000000,
						callValue: _z,
						//shouldPollResponse: true
					});
					remainingBetHash.push(_result);
					findResult(_result);
					refreshBal();
					//console.log(remainingBetHash);
					// await tronWeb.trx.getUnconfirmedTransactionInfo(_result).then(async resid =>{
					//
					// 	//console.log(resid.receipt.energy_usage_total);
					// 	myDetails.myTrxBal -= resid.receipt.energy_usage_total;
					// });
					$(DOMStrings.balanceAnim).html('<p class="balDeduct">- '+_z/1e6+'</p>');

					$(DOMStrings.RollBtn).text('Rolling');
					let _time = Date.now();
					rollingEffect(_y,_x,_z,_result,_time);
					_result = 0;
			}
			catch (e)
			{
				clearInterval(setrollanim);
				let name = '';
		    if(_x == 1){
		      name = 'Roll Over ' +_y;
		    }else {
		      name = 'Roll Under ' +_y;
		    }
				$(DOMStrings.RollBtn).text(name);
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
	/////////////////////////////////////
	const refreshBal = async () =>{
		let y = await tronWeb.trx.getUnconfirmedBalance(myDetails.myAddressInBase58);
		y = tronWeb.toDecimal(y);
		//console.log(y);
		y /= sixZero;
		y = floor(y,1);
		//console.info(y);
		myDetails.myTrxBal  = y;
		$(DOMStrings.myTrxbal).text(y);
	}


	const rollingEffect = async(_predic,_dirName,betAmt,txId,betTime) =>
	{
		$(DOMStrings.luckyDis).css({
			'color':'#c0ff07',
			'text-shadow': '0 0 2px #001604'
		});
    let name = '';
    if(_dirName == 1){
      name = 'Roll Over ' +_predic;
    }else {
      name = 'Roll Under ' +_predic;
    }
		var i = 0;
		setrollanim = setInterval(function ()
		{
			$(DOMStrings.luckyDis).text(i);
      i++;

      //////////////////////_luckyNum
			//console.log(_luckyNum);
			if (_luckyNum != 100)
			{

				$(DOMStrings.RollBtn).attr("disabled", false);
        $(DOMStrings.luckyDis).text(_luckyNum);
				//console.log(_luckyNum);
				clearInterval(setrollanim);
				$(DOMStrings.RollBtn).text(name);
				_luckyNum = 100;

				if (payOnwinTrx != 0)
				{
					let _v = payOnwinTrx/sixZero;

					_v = floor(_v,3);

					$(DOMStrings.balanceAnim).html('<p class="balOnWin"> +'+_v+'</p>');

					//myDetails.myTrxBal += ((payOnwinTrx - betAmt)/sixZero);
					//$(DOMStrings.myTrxbal).text(floor(myDetails.myTrxBal,1));
					//console.log('win');
				}
				else
				{

					//betAmt -= 22000;
					//myDetails.myTrxBal -= (betAmt/sixZero);
					//$(DOMStrings.myTrxbal).text(floor(myDetails.myTrxBal,1));
					$(DOMStrings.luckyDis).css({
						'color':'#ff0000',
						'text-shadow': '0 0 2px #fff'
					});
					console.log('loss');
				}
				canPlace = 0;
			}
      //////////////////////////
			 if (i == 100)
			{
				i = 0;
			}

		}, 40);
	}

	const findResult = async (hashId) =>{

		const findSetAnim = setInterval(async function(){
			if (remainingBetHash.indexOf(hashId) !== -1) {

			 await tronWeb.getEventByTransactionID(hashId).then(async res =>{
				 if(res.length != 0 && remainingBetHash.indexOf(hashId) !== -1){
					 //console.log('other way');
					 clearInterval(findSetAnim);
					 remainingBetHash.splice(remainingBetHash.indexOf(hashId), 1 );
					 _luckyNum = res[0].result.lucky_number;
					 //console.log(_luckyNum);
					 if(_luckyNum < 10){
             _luckyNum ='0'+_luckyNum;
           }
					 payOnwinTrx = res[0].result.payOut;
					 $(DOMStrings.luckyDis).text(_luckyNum);
					 if (payOnwinTrx > 0) {
						 let winsound = new Audio("../sound/succeeding.wav");
 						winsound.play();
 	          $(DOMStrings.resultPop).html(winMsg);
					 }else {
						 let loosesound = new Audio("../sound/failure.wav");
 						loosesound.play();
 	          $(DOMStrings.resultPop).html(loseMsg);
					 }
					 myDetails.myTrxBal = await tronWeb.trx.getUnconfirmedBalance(myDetails.myAddressInBase58)/sixZero;
           $(DOMStrings.myTrxbal).text(floor(myDetails.myTrxBal,1));
					 try {
						 await prakash.updateDB.myBetRecord(myDetails.myAddressInCheckSum,betBuilder.betAmount,payOnwinTrx);
						 //console.log('success full insert');
					 } catch (e) {
						 console.log(e);
					 }
				 }

			 });
		 }

		},1000);

	}

	////////////////////ultra bet
var setultrabet = 0;
	const ultraBetting = async () =>{
		let diceCtrt = await tronWeb.contract().at(diceGame);
		console.log('ultra started');
		let _x = betBuilder.betDirection;
		let _y = betBuilder.betPrediction;
		let _z = betBuilder.betAmount;
		let _betName = $(DOMStrings.RollBtn).text();
		let canUltra =0;

		setultrabet = setInterval(async function(){
			let _con = (myDetails.myTrxBal) * sixZero;
			if( _con < _z) return	$(DOMStrings.resultPop).html(alertMinBal);
			if(canUltra == 0){
				canUltra = 1;
				try {
					$(DOMStrings.RollBtn).text('Rolling');

					let _result = await diceCtrt.betDice(_x, _y).send(
					{
						feeLimit: 20000000,
						callValue: _z
						//shouldPollResponse: true9725342578
					});
					canUltra = 0;
					remainingBetHash.push(_result);
					findResult(_result);
					refreshBal();

					//console.log(remainingBetHash);
					// await tronWeb.trx.getUnconfirmedTransactionInfo(_result).then(async resid =>{
					//
					// 	//console.log(resid.receipt.energy_usage_total);
					// 	myDetails.myTrxBal -= resid.receipt.energy_usage_total;
					// });
					//console.log(_result);
					$(DOMStrings.RollBtn).text(_betName);

				} catch (e) {
					console.log(e);
					$(DOMStrings.RollBtn).text(_betName);
					canUltra = 0;
				}
			}

		},2000);



	}

	////////////

	const clearultrabet = async() =>
	{
		console.log('about to close ultra');
		$(DOMStrings.RollBtn).attr("disabled", false);
		clearInterval(setultrabet);
		isultraset = 0;
		console.log('closed');
	}

	const initUi = async() =>
	{


	}
	return {
		'initUi': initUi,
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
		dice.autoBetting();
	}else if ($(DOMStrings.ultraBetTogglr).is(":checked") && underUltraMode == 0 && underAutoMode == 0){
		underUltraMode = 1;
		_betName = $(DOMStrings.RollBtn).text();
		dice.ultraBetting();
		console.log('logultramode');

	}
	else if (underAutoMode == 0 && underUltraMode == 0)
	{

		dice.bet();
	}
});


$(DOMStrings.autoBetToggle).change(function ()
{
	console.log('end auto');
	if ($(DOMStrings.autoBetToggle).not(":checked") && underAutoMode == 1)
	{
		dice.clearAutobet();
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
		dice.clearultrabet();
		//$(DOMStrings.RollBtn).text(_betName);
		console.log('ended ultra');
		underUltraMode = 0;
	}
});
