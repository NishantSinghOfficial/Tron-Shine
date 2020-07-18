const rouletteDom = {
  numDiv : '.main-num-box',
  colorSelect:'.color-picker button',
  disWinChance:'span.disWinC',
  disMultiplier:'span.disMulti',
  disMinOnBet:'span.disMineShine'
}
const betObject = {
  on:1,
  amount:10000000
}
const sixZero = 1000000;
var color = ["null-num","grey-num","blue-num","green-num","red-num"];
var generateNum = (function(){

const onLoadValues = () =>{
  let allValue = '';
  for (var i = 1; i <= 31; i++) {
    let _secondnum = Math.random() * 100;
    _secondnum = Math.floor(_secondnum);
    let _spanColorCode = (_secondnum % 4)+1;
    allValue += '<span id="'+color[_spanColorCode]+'"></span>';
    if(i == 31){
      $(rouletteDom.numDiv).html(allValue);
    }

   }
 }




const initui = async () =>{
  console.log(color);
  onLoadValues();

}
return{
  'initui':initui
}
})();
$(document).ready(function(){
  generateNum.initui();
  $('button#double').click();
  $('button#double').focus();
});
///color select changer


function floor(value,decimal){
  let _x = 10 ** decimal;
  return (Math.floor(value *_x) / _x)
}

$(rouletteDom.colorSelect).click(function(){
  $(rouletteDom.colorSelect).removeClass('selected');
  $(this).addClass('selected');
  let _boxid = $(this).attr('id');
  console.log(_boxid);
  if(_boxid == 'triple'){
    betObject.on = 2;
    calcInfo(0.25);
  }
  if(_boxid == 'double'){
    betObject.on = 1;
    calcInfo(0.5);
  }
  if(_boxid == 'fifth'){
    betObject.on = 3;
    calcInfo(0.125);
  }
  if(_boxid == 'tenth'){
    betObject.on = 4;
    calcInfo(0.0625);
  }



});






  ///calc win Chance
function calcInfo(_fromColProb) {

  let _winChance = _fromColProb * 98.5;
  let _multiplier = 98.5 / _winChance;
  _winChance = Math.floor(_winChance *100)/100;
  _multiplier = Math.round(_multiplier);

  _winChance +='%';
  _multiplier += 'X';
  console.log(_winChance);
  $(rouletteDom.disWinChance).text(_winChance);
  $(rouletteDom.disMultiplier).text(_multiplier);
  miningAndPayVal($(DOMStrings.betValue).val());


}
////////////////
//min bet AMOUNT
//get user betting input TRX after click on roll
$(DOMStrings.betValue).on('input', function() {
  let _val = $(this).val();
  _valFrac = floor(_val,0);
  if(_val > _valFrac){
    $(DOMStrings.betValue).val(_valFrac);
  }
  betObject.amount = _valFrac * sixZero;
  miningAndPayVal(_valFrac);
  //betBuilder.betAmount = sixZero * _valFrac;
});



$(DOMStrings.betValue).blur(function() {
  let _val = $(this).val();
  if (_val < 10) {
    //betBuilder.betAmount = sixZero * 10;
    $(this).val(10);
    betObject.amount = 10* sixZero;
    miningAndPayVal(10);
  }
});

const miningAndPayVal = async (betTRX) =>{
  //console.log('calc');
let _multi = $(rouletteDom.disMultiplier).text();
  _multi = _multi.substring(0, _multi.length - 1);
  let _mine = betTRX / 100;
  let _payOut = betTRX * _multi;
  _payOut = floor(_payOut,2);
  _mine = floor(_mine,2);
  $(DOMStrings.payOutVal).val(_payOut);
  $(rouletteDom.disMinOnBet).text(_mine);
  console.log(_multi + '  '+_payOut);

}
/////////////////////////////////////////////////
///min btnclick
$(DOMStrings.minbtn).click(function() {
  betObject.amount = 10* sixZero;
  $(DOMStrings.betValue).val(10);
  miningAndPayVal(10);
});

// max btn
$(DOMStrings.maxbtn).click(function() {
  let _cBal = $('.lower-left p span').text();
  _cBal = floor(_cBal,0);
  if(_cBal > 10){
    $(DOMStrings.betValue).val(_cBal);
    miningAndPayVal(_cBal);
    betObject.amount = sixZero * _cBal;
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
   betObject.amount = sixZero * _val;
   $(DOMStrings.betValue).val(_val);
   miningAndPayVal(_val);
 });
 // 2x btn
 $(DOMStrings.doublebtn).click(function() {

   let _cBal = $('.lower-left p span').text();
   let _cbetAmt = $(DOMStrings.betValue).val();
   _cBal = floor(_cBal,0);
   if(_cBal >= 2 * _cbetAmt){
     $(DOMStrings.betValue).val(2 * _cbetAmt);
     betObject.amount = sixZero * 2 * _cbetAmt;
     miningAndPayVal(2 * _cbetAmt);
   }else {
     $(DOMStrings.betValue).val(_cBal);
     miningAndPayVal(_cBal);
     betObject.amount = sixZero * _cBal;
   }
 });
