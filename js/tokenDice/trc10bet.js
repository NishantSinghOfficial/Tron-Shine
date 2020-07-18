
var _luckNum = 100;
var payOnwinToken = 0;
var trc10 = (function(){
  var setAuto = null;
	const sixZero = 1000000;
	var canPlace = 0;
	var balChange = 0;
	var setrollanim;
  const winMsg = '<div class="box-sm greenBox"><i class="far fa-check-circle"></i> WON</div>';
  const loseMsg = '<div class="box-sm redBox"><i class="far fa-times-circle"></i> LOST</div>';
  const alertMinBal = '<div class="box-sm redBox"> Not token enough Balance</div>';
  const invalidBet = '<div class="box-sm redBox"> Invalid bet amount</div>';

  function floor(value,decimal){
    let _x = 10 ** decimal;
    return (Math.floor(value *_x) / _x);
  }
  const bet = async() =>
	{



		let diceCtrt = await tronWeb.contract().at(trcGameAddress);
		try
		{
      let _x = betBuilder.betDirection;
      let _y = betBuilder.betPrediction;
      let _z = betBuilder.betAmount;
      let _id = betBuilder.idOfToken;
      let _divider = 10**PlayabletokenId[_id].precision;
      let _min = PlayabletokenId[_id].min;
      if(_z < _min * _divider) return [$(DOMStrings.resultPop).html(invalidBet), $(DOMStrings.RollBtn).attr("disabled", false)];
      if(_z > PlayabletokenId[_id].myValue) return [$(DOMStrings.resultPop).html(alertMinBal), $(DOMStrings.RollBtn).attr("disabled", false)];

			let _result = await diceCtrt.trc10Bet(_x, _y).send(
			{
				feeLimit: 2000000,
        tokenId:_id,
        tokenValue:_z,
				//shouldPollResponse: true
			});

      $(DOMStrings.RollBtn).text('Rolling');
      let _betTime = Date.now();
			rollingEffect(_x,_y,_z,_id,_result,_betTime);

			//console.log(_luckNum);
		}
		catch (e)
		{
      let _predic = betBuilder.betPrediction;
      let _dirName = betBuilder.betDirection;
      let name = '';
      if(_dirName == 1){
        name = 'Roll Over ' +_predic;
      }else {
        name = 'Roll Under ' +_predic;
      }
      clearInterval(setrollanim);
      $(DOMStrings.RollBtn).attr("disabled", false);
      $(DOMStrings.RollBtn).text(name);
			console.log(e);
		}

	}

  const autoBetting = async() =>
	{
		let diceCtrt = await tronWeb.contract().at(trcGameAddress);
		console.log('auto started');

    let name = '';
		setAuto = setInterval(async function ()
		{

			try
			{
        let _x = betBuilder.betDirection;
    		let _y = betBuilder.betPrediction;
    		let _z = betBuilder.betAmount;
        let _id = betBuilder.idOfToken;
        let _divider = 10**PlayabletokenId[_id].precision;
        let _min = PlayabletokenId[_id].min;
        if(_z < _min * _divider) return $(DOMStrings.resultPop).html(invalidBet);
        if(_z > PlayabletokenId[_id].myValue) return $(DOMStrings.resultPop).html(alertMinBal);
				if (canPlace == 0)
				{

					canPlace = 1;

					//console.log(betBuilder);


					let _result = await diceCtrt.trc10Bet(_x, _y).send(
					{
            feeLimit: 2000000,
            tokenId:_id,
            tokenValue:_z,
    				//shouldPollResponse: true
					});
          $(DOMStrings.RollBtn).text('Rolling');
          let _betTime = Date.now();
    			rollingEffect(_x,_y,_z,_id,_result,_betTime);

				}

			}
			catch (e)
			{
        let _predic = betBuilder.betPrediction;
        let _dirName = betBuilder.betDirection;
        let name = '';
        if(_dirName == 1){
          name = 'Roll Over ' +_predic;
        }else {
          name = 'Roll Under ' +_predic;
        }
				$(DOMStrings.RollBtn).text(name);
				console.log(e);
				canPlace = 0;
				clearInterval(setrollanim);
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


	const rollingEffect = async(_dirName,_predic,betAmt,_id,txid,betTime) =>
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
      //////////////////////
			if ( _luckNum != 100)
			{
        $(DOMStrings.luckyDis).text(_luckNum);
        console.log(_luckNum);
				clearInterval(setrollanim);
        $(DOMStrings.RollBtn).text(name);
        $(DOMStrings.RollBtn).attr("disabled", false);


				_luckNum = 100;
        let divider = 10 ** (PlayabletokenId[_id].precision);
				if (payOnwinToken > 0)
				{

					let winsound = new Audio("../sound/succeeding.wav");
					winsound.play();
          $(DOMStrings.resultPop).html(winMsg);
					console.log('win');

          payOnwinToken = 0;
          canPlace = 0;
				}
				else{
					let loosesound = new Audio("../sound/failure.wav");
					loosesound.play();
          $(DOMStrings.resultPop).html(loseMsg);
          $(DOMStrings.luckyDis).css({
						'color':'#ff0000',
						'text-shadow': '0 0 2px #fff'
					});
					console.log('loss');
          canPlace = 0;
				}

			}
      let _t = Date.now() - 10000;
      if(betTime < _t){
        findotherWayResult(txid);
        console.log('other way');
      }
      //////////////////////////
			 if (i == 100)
			{
				i = 0;
			}

		}, 40);
	}

  const findotherWayResult = async (txnId) =>{
    await tronWeb.getEventByTransactionID(txnId).then(res =>{
      if (res) {
        _luckNum = res[0].result.lucky_number;
        payOnwinTrx = res[0].result.payOut;
      }

       //bethistory.restartWatch();

      console.log('other way');
    });

  }


  const initUi = async() =>
	{


	}
  return {
		'initUi': initUi,
		'bet': bet,
		'autoBetting': autoBetting,
		'clearAutobet': clearAutobet
	}

})();

var underAutoMode = 0;
$(DOMStrings.RollBtn).click(function (e)
{
	console.log('rolling');
	e.preventDefault();
	$(DOMStrings.RollBtn).attr("disabled", true);
	if ($(DOMStrings.autoBetToggle).is(":checked") && underAutoMode == 0)
	{
		underAutoMode = 1;
		trc10.autoBetting();
	}
	else if (underAutoMode == 0)
	{

		trc10.bet();
	}
});


$(DOMStrings.autoBetToggle).change(function ()
{
	console.log('end auto');
	if ($(DOMStrings.autoBetToggle).not(":checked") && underAutoMode == 1)
	{
		trc10.clearAutobet();
		console.log('ended');
		underAutoMode = 0;
	}
});
