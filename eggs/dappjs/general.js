function currentIst(){
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
function balDeductionAnim(value){

  if (value < 10000000) return console.log('invalid amount');
  value = value/ sixZero;
  value = floor(value,2);
  let text = `<p class="roulette-balDeduct">-${value}</p>`;
  $('.roulette-balAnim').html(text);
  //console.log(value);
}
function balWonAnim(value){

  if (value < 10000000) return console.log('invalid amount');
  value = value/ sixZero;
  value = floor(value,2);
  let text = `<p class="roulette-balOnWin">+${value}</p>`;
  $('.roulette-balAnim').html(text);
  //console.log(value);
}
