var betBuilder = {
  betAmount:'',
  betDirection:'1',
  betPrediction:'',
  idOfToken:''
}
const sixZero = 1000000;

function floor(value,decimal){
  let _x = 10 ** decimal;
  return (Math.floor(value *_x) / _x)
}


function currentIst() {
  var currentTime = new Date();
  var time = new Date().getTime();
  var daySecond = 86400;
  var originTime = ((time - 1577275200000) / 1000) % daySecond;

  originTime = Math.floor(originTime);
  var hour = originTime / 3600;
  hour = Math.floor(hour);
  var minute = Math.floor((originTime % 3600) / 60);
  var second = Math.floor(originTime % 60);
  //console.log(originTime);
  //console.log('hours ' + hour+' minutes '+ minute+' second '+second);

  var hoursIST = 23 - hour;
  if (hoursIST <= 9 && hoursIST >= 0) {
    hoursIST = '0' + hoursIST;
  }
  var minutesIST = 59 - minute;
  if (minutesIST >= 0 && minutesIST <= 9) {
    minutesIST = '0' + minutesIST;
  }
  var secondsIST = 59 - second;
  if (secondsIST >= 0 && secondsIST <= 9) {
    secondsIST = '0' + secondsIST;
  }
  $(DOMStrings.dividendTimer).text( hoursIST + ':' + minutesIST + ':' + secondsIST);
  //console.log('hours ' + hoursIST+' minutes '+ minutesIST+' second '+secondsIST);
}
$(document).ready(function() {
  currentIst();
});
setInterval(function() {
  currentIst();
}, 1000);
setInterval(function() {
  var timet = new Date();
  var cmin = 59 - timet.getMinutes();
  var csecond = 59 - timet.getSeconds();
  if (csecond < 10) {
    var csecond = "0" + csecond;
  }
  var countdown = "CountDown timer:" + cmin + ":" + csecond;
  $('p.wazercountdown').text(countdown);
}, 1000);


// roll under side calcRangeSld

function rollUnderRange(){
  $(DOMStrings.leftLmtRange).text('1');
  $(DOMStrings.rightLmtRange).text('95');
  $(DOMStrings.slideRange).val(49);
  $(DOMStrings.slideRange).attr({
    "min": 1,
    "max": 95
  });
  $(DOMStrings.multiplyval).text('2.0102X');
  $(DOMStrings.winChanceVal).text('49 %');
  $(DOMStrings.miningShine).text('0.1 SHINE');
  $(DOMStrings.betValue).val(10);
  $(DOMStrings.payOutVal).val(20.102);
  $(DOMStrings.predictionVAl).text('49');
  $(DOMStrings.RollBtn).text('Roll Under 49');
  $(DOMStrings.slideRange).css('background','linear-gradient(to left, #d20d12 0%, #d20d12 50%, #33f300 50%, #33f300 100%)');
  betBuilder.betAmount = sixZero * 10;
  betBuilder.betDirection = 0;
  betBuilder.betPrediction = 49;
}

function rollOverRange(){
  $(DOMStrings.leftLmtRange).text('4');
  $(DOMStrings.rightLmtRange).text('98');
  $(DOMStrings.slideRange).val(50);
  $(DOMStrings.slideRange).attr({
    "min": 4,
    "max": 98
  });
  $(DOMStrings.multiplyval).text('2.0102X');
  $(DOMStrings.winChanceVal).text('49 %');
  $(DOMStrings.miningShine).text('0.1 SHINE');
  $(DOMStrings.betValue).val(10);
  $(DOMStrings.payOutVal).val(20.102);
  $(DOMStrings.predictionVAl).text('50');
  $(DOMStrings.RollBtn).text('Roll Over 50');
  $(DOMStrings.slideRange).css('background','linear-gradient(to left, #33f300 0%, #33f300 50%, #d20d12 50%, #d20d12 100%)');
  betBuilder.betAmount = sixZero * 10;
  betBuilder.betDirection = 1;
  betBuilder.betPrediction = 50;
}
$(document).ready(function() {
  rollOverRange();


});
$(DOMStrings.directionToggle).change(function () {

	if ($(DOMStrings.directionToggle).is(":checked")) {
    rollUnderRange();
    betBuilder.betDirection = 0;
	}else {
    rollOverRange();
    betBuilder.betDirection = 1;
  }
});

////////////////////////////
//get user input from range and display
$(DOMStrings.slideRange).on('input', function() {
  //displaye selected number

let _userPrediction = $(DOMStrings.slideRange).val();
let _userBetAmount = $(DOMStrings.betValue).val();
    betBuilder.betPrediction = _userPrediction;
let _xIn = '';

$(DOMStrings.predictionVAl).text(_userPrediction);
 if(betBuilder.betDirection == 1){
   _xIn = 'Roll Over ' + _userPrediction;
   this.style.background = 'linear-gradient(to right, #d20d12 0%, #d20d12 ' + this.value + '%, #33f300 ' + this.value + '%, #33f300 100%)';
   _userPrediction = 99 - _userPrediction;
 }else {
   _xIn = 'Roll Under ' + _userPrediction;
   this.style.background = 'linear-gradient(to right, #33f300 0%, #33f300 ' + this.value + '%, #d20d12 ' + this.value + '%, #d20d12 100%)';
 }
  let _winChance = _userPrediction;
  let _multiplier= 98.5 / _userPrediction;
  let _payOut = _multiplier * _userBetAmount;
  _multiplier = floor(_multiplier,3);
  _payOut = floor(_payOut,3);
    $(DOMStrings.RollBtn).text(_xIn);
  $(DOMStrings.multiplyval).text(_multiplier +' X');
  $(DOMStrings.winChanceVal).text(_winChance + ' %');
  $(DOMStrings.payOutVal).val(_payOut);

});


//////////////////////
//get user betting input TRX after click on roll
$(DOMStrings.betValue).on('input', function() {
  let _val = $(this).val();
  let _cBal = $(DOMStrings.myTrxbal).text();
  _cBal = floor(_cBal,0);
  _valFrac = floor(_val,0);
  if(_val > _valFrac){
    $(DOMStrings.betValue).val(_valFrac);
  }else if(_valFrac > _cBal){
    _valFrac = _cBal;
    $(DOMStrings.betValue).val(_valFrac);
  }
  miningAndPayVal(_valFrac);
  betBuilder.betAmount = sixZero * _valFrac;
});



$(DOMStrings.betValue).blur(function() {
  let _val = $(this).val();
  if (_val < 10) {
    betBuilder.betAmount = sixZero * 10;
    $(this).val(10);
    miningAndPayVal(10);
  }
});
////////calculate mining and payOut
function miningAndPayVal(_val){

  let _multi = $(DOMStrings.multiplyval).text();
  _multi = _multi.substring(0,_multi.length - 1);
  let _payOut = _val * _multi;
  _payOut = floor(_payOut,3);
  $(DOMStrings.payOutVal).val(_payOut);

  let minedShine = _val / 100;
    minedShine = floor(minedShine,3);
  $(DOMStrings.miningShine).text(minedShine+' SHINE');
}

///min btnclick
$(DOMStrings.minbtn).click(function() {
  betBuilder.betAmount = sixZero * 10;
  $(DOMStrings.betValue).val(10);
  miningAndPayVal(10);
});

$('button').click(function(){
  let clickSound = new Audio("../sound/btn1.wav");
  clickSound.play();
});
$('li').click(function(){
  let clickSound = new Audio("../sound/btn1.wav");
  clickSound.play();
});
$('input[type=checkbox]').change(function(){
  let clickSound = new Audio("../sound/toggle.wav");
  clickSound.play();
});

// max btn
$(DOMStrings.maxbtn).click(function() {
  let _cBal = $(DOMStrings.myTrxbal).text();
  _cBal = floor(_cBal,0);
  if(_cBal > 10){
    $(DOMStrings.betValue).val(_cBal);
    miningAndPayVal(_cBal);
    betBuilder.betAmount = sixZero * _cBal;
  }

});
 //half btn
 $(DOMStrings.halfbtn).click(function() {
   let _val = $(DOMStrings.betValue).val();
   if(_val >= 20){
     _val /= 2;
     _val = floor(_val,0);

   }else {
     _val = 10;
   }
   betBuilder.betAmount = sixZero * _val;
   $(DOMStrings.betValue).val(_val);
   miningAndPayVal(_val);
 });
 // 2x btn
 $(DOMStrings.doublebtn).click(function() {

   let _cBal = $(DOMStrings.myTrxbal).text();
   let _cbetAmt = $(DOMStrings.betValue).val();
   _cBal = floor(_cBal,0);
   if(_cBal >= 2 * _cbetAmt){
     $(DOMStrings.betValue).val(2 * _cbetAmt);
     betBuilder.betAmount = sixZero * 2 * _cbetAmt;
     miningAndPayVal(2 * _cbetAmt);
   }else {
     $(DOMStrings.betValue).val(_cBal);
     miningAndPayVal(_cBal);
     betBuilder.betAmount = sixZero * _cBal;
   }
 });

 
