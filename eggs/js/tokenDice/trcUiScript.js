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
  let _cToken = PlayabletokenId[betBuilder.idOfToken];
  let _minToPlay = _cToken.min;
  let _payOut = _minToPlay * 2.0102;
  _payOut = floor(_payOut,2);
  let _mul = _cToken.precision;
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
  $(DOMStrings.betValue).val(_minToPlay);
  $(DOMStrings.payOutVal).val(_payOut);
  $(DOMStrings.predictionVAl).text('49');
  $(DOMStrings.RollBtn).text('Roll Under 49');
  $(DOMStrings.slideRange).css('background','linear-gradient(to left, #d20d12 0%, #d20d12 50%, #33f300 50%, #33f300 100%)');
  betBuilder.betAmount = _minToPlay*(10 ** _mul);
  betBuilder.betDirection = 0;
  betBuilder.betPrediction = 49;
}

function rollOverRange(){
  let _cToken = PlayabletokenId[betBuilder.idOfToken];
  let _minToPlay = _cToken.min;
  let _payOut = _minToPlay * 2.0102;
  _payOut = floor(_payOut,2);
  let _mul = _cToken.precision;
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
  $(DOMStrings.betValue).val(_minToPlay);
  $(DOMStrings.payOutVal).val(_payOut);
  $(DOMStrings.predictionVAl).text('50');
  $(DOMStrings.RollBtn).text('Roll Over 50');
  $(DOMStrings.slideRange).css('background','linear-gradient(to left, #33f300 0%, #33f300 50%, #d20d12 50%, #d20d12 100%)');
  betBuilder.betAmount = _minToPlay*(10 ** _mul);
  betBuilder.betDirection = 1;
  betBuilder.betPrediction = 50;
}
$(document).ready(function() {
  betBuilder.idOfToken = 1002000;
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
   this.style.background = 'linear-gradient(to right, #d20d12 0%, #d20d12 ' + this.value + '%, #33f300 ' + this.value + '%, #33f300 100%)';
    _xIn = 'Roll Over ' + _userPrediction;
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
  let _divider =10 ** (PlayabletokenId[betBuilder.idOfToken].precision);
  let _min = PlayabletokenId[betBuilder.idOfToken].min;
  let _val = $(this).val();
  let _cBal = $(DOMStrings.disTokenBal).text();
  _cBal = floor(_cBal,0);
  _valFrac = floor(_val,0);
  if(_valFrac > _cBal && _valFrac >= _min){
    _valFrac = _cBal;
    $(DOMStrings.betValue).val(_valFrac);
  }else if(_valFrac > _cBal && _valFrac < _min){
    _valFrac = _min;
  }
  $(DOMStrings.betValue).val(_valFrac);
  PayVal(_valFrac);
  betBuilder.betAmount = _divider * _valFrac;
});



$(DOMStrings.betValue).blur(function() {
  let _val = $(this).val();
  let _min = PlayabletokenId[betBuilder.idOfToken].min;
  let _divider =10 ** (PlayabletokenId[betBuilder.idOfToken].precision);

  let _diff = _val - _min;
  //console.log(_val +'  '+ _min + ' ' + _diff);
  if (_diff < 0 ) {
    betBuilder.betAmount = _divider * _min;
    $(this).val(_min);
    PayVal(_min);
  }
});
////////calculate mining and payOut
function PayVal(_val){

  let _multi = $(DOMStrings.multiplyval).text();
  _multi = _multi.substring(0,_multi.length - 1);
  let _payOut = _val * _multi;
  _payOut = floor(_payOut,3);
  $(DOMStrings.payOutVal).val(_payOut);
}
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

///min btnclick
$(DOMStrings.minbtn).click(function() {
  let _min = PlayabletokenId[betBuilder.idOfToken].min;
  let _divider =10 ** (PlayabletokenId[betBuilder.idOfToken].precision);
  betBuilder.betAmount = _divider * _min;
  $(DOMStrings.betValue).val(_min);
  PayVal(_min);
});



// max btn
$(DOMStrings.maxbtn).click(function() {
  let _cBal = $(DOMStrings.disTokenBal).text();
  _cBal = floor(_cBal,0);
  let _min = PlayabletokenId[betBuilder.idOfToken].min;
  let _divider =10 ** (PlayabletokenId[betBuilder.idOfToken].precision);
  if(_cBal > _min){
    $(DOMStrings.betValue).val(_cBal);
    PayVal(_cBal);
    betBuilder.betAmount = _divider * _cBal;
  }

});
 //half btn
 $(DOMStrings.halfbtn).click(function() {
   let _val = $(DOMStrings.betValue).val();
   let _min = PlayabletokenId[betBuilder.idOfToken].min;
   let _divider =10 ** (PlayabletokenId[betBuilder.idOfToken].precision);
   if(_val >= 2 * _min){
     _val /= 2;
     _val = floor(_val,0);

   }else {
     _val = _min;
   }
   betBuilder.betAmount = _divider * _val;
   $(DOMStrings.betValue).val(_val);
   PayVal(_val);
 });
 // 2x btn
 $(DOMStrings.doublebtn).click(function() {
   let _min = PlayabletokenId[betBuilder.idOfToken].min;
   let _divider =10 ** (PlayabletokenId[betBuilder.idOfToken].precision);
   let _cBal = $(DOMStrings.disTokenBal).text();
   let _cbetAmt = $(DOMStrings.betValue).val();
   _cBal = floor(_cBal,0);
   if(_cBal >= 2 * _cbetAmt){
     $(DOMStrings.betValue).val(2 * _cbetAmt);
     betBuilder.betAmount = _divider * 2 * _cbetAmt;
     PayVal(2 * _cbetAmt);
   }if (_cBal >= _min && _cBal < 2 * _cbetAmt) {
     $(DOMStrings.betValue).val(_cBal);
     PayVal(_cBal);
     betBuilder.betAmount = _divider * _cBal;
   }
 });

 ////////////////////////////////////////////////
 // for token section drop down
 $(DOMStrings.headTokenToggle).click(function(){
   if($(DOMStrings.TokenList).is(":visible")){
     $(DOMStrings.TokenList).hide();
     $(DOMStrings.footTokenToggle).hide();
     $(DOMStrings.togglerChanger).html('<i class="fas fa-caret-down"></i>');
   }else {
     $(DOMStrings.TokenList).css('display','table');
     $(DOMStrings.footTokenToggle).css('display','table');
     $(DOMStrings.togglerChanger).html('<i class="fas fa-caret-up"></i>');
   }

 });


 //////////////
 $(document).on('click',DOMStrings.TokenList,function(){
 let _x = $(this).attr('id');
 if(_x){
   let _name = PlayabletokenId[_x].name;
   let _val = PlayabletokenId[_x].myValue;
   let _precision = PlayabletokenId[_x].precision;
   let _min = PlayabletokenId[_x].min;
   let _divider =10 ** _precision;
   _val =_val/(10 ** _precision);
   _val = floor(_val,2);
   betBuilder.idOfToken = _x;
   $(DOMStrings.betValue).val(_min);
   PayVal(_min);
   betBuilder.betAmount = _divider * _min;
   $('.token-name-active span').text(_name);
   $(DOMStrings.disTokenBal).text(_val);
   $(DOMStrings.TokenList).hide();
   $(DOMStrings.footTokenToggle).hide();
   $(DOMStrings.togglerChanger).html('<i class="fas fa-caret-down"></i>');
   let selectedTokenLogoUrl = "https://apilist.tronscan.org/api/token?id="+_x;
   fetch(selectedTokenLogoUrl)
   .then(resp => resp.json())
   .then(res =>{
     //console.log(res.data[0].imgUrl);
     $(".token-name-active img").attr('src',res.data[0].imgUrl);
   });
   let targetrow = 'tr.'+_x + ' th';
$(DOMStrings.disTokenWagerAndPool+' tr th').css('color',' #000');
$('.playButton').html('<i class="far fa-check-circle"></i>');
$('#'+_x).find('.playButton').html('<i class="fas fa-check-circle"></i>');
   $(targetrow).css('color',' red');//
 }

 });
$(window).load(function() {
   let _x = 1002000;
    betBuilder.idOfToken = _x;
   let _name = PlayabletokenId[_x].name;
   let _val = PlayabletokenId[_x].myValue;

   let _precision = PlayabletokenId[_x].precision;
   let _min = PlayabletokenId[_x].min;
   let _divider =10 ** _precision;

   _val =_val/(10 ** _precision);
   _val = floor(_val,2);
   $('.token-name-active span').text(_name);
   $(DOMStrings.disTokenBal).text(_val);
   $(DOMStrings.betValue).val(_min);
   PayVal(_min);
   betBuilder.betAmount = _divider * _min;
   console.log($(DOMStrings.disTokenBal).text());
   if($(DOMStrings.disTokenBal).text() == 0){

     const setForOnloadHead = setInterval(async function(){
       if(PlayabletokenId[_x].wager != 0){
         _val = PlayabletokenId[_x].myValue;
         _val =_val/(10 ** _precision);
         _val = floor(_val,2);
         $(DOMStrings.disTokenBal).text(_val);
         $('tr.1002000 th').css('color',' red');
         $('#1002000').find('.playButton').html('<i class="fas fa-check-circle"></i>');
         clearInterval(setForOnloadHead);
       }
     },2000);
   }



 });

 $('.popup-info-panel-head').click(function(){
   $('.popup-info-panel').css('z-index','-1');
 });
 $('.popup-info-panel-body button').click(function(){
   $(DOMStrings.loginBtn).click();
 });
