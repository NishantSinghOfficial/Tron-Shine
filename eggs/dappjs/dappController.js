

const loginFunc = async () =>{

  myInfo.myInfoinitUi();
  myDatabase.injectDb();
  myDatabase.insertNewUser();

  $('.progressBar span').animate({ width: '20%' }, 'slow');
  publicbars.publicInfoinitUi();
  $('.progressBar span').animate({ width: '40%' }, 'slow');
  trc10private.privatInIt();
  $('.progressBar span').animate({ width: '60%' }, 'slow');
  $('.progressBar span').animate({ width: '80%' }, 'slow');
  bars.inituibars();
  $('.progressBar span').animate({ width: '100%' }, 'slow');

  $('body').addClass('loaded');

}


//////////
var setrefresh ;

function refresh(){
    setrefresh = setInterval(checkSet, 3000);

}
//checking for tronWeb and address
async function checkSet(){
  //console.log('trying');
   if (tronWeb.defaultAddress.base58) {
     //location.reload(true);
     clickLogIn();
    clearInterval(setrefresh);
    $('.popup-info-panel').hide();

  }
}
//checking if loader after if found address
async function checkErrorAndLoad(){
  try {
    await tronWeb.trx.getUnconfirmedBalance(myDetails.myAddressInBase58);
    clickLogIn();
    $('.popup-info-panel').hide();
   clearInterval(setrefreshForBal);
  } catch (e) {
    console.error('cant fetch data, please check your internet connection');
  }
}
var setrefreshForBal;
function refreshForBalance(){
    setrefreshForBal = setInterval(checkErrorAndLoad, 10000);

}

//main loging function

async function clickLogIn(){
  if (!window.tronWeb) {
    //console.log('no window.tronWeb');
    refresh();
    $('.progressBar span').animate({ width: '100%' }, 'slow');
    $('body').addClass('loaded');
    $('.popup-info-panel-body p' ).text('please open using google chrome and install tron link chrome extension or using any tron supported wallet');
    $('.popup-info-panel').show();
  }else if (!tronWeb.defaultAddress.base58) {
    //console.log('no addr');
    refresh();
    $('.progressBar span').animate({ width: '100%' }, 'slow');
    $('body').addClass('loaded');
    $('.popup-info-panel').show();
    //console.log('please login');
  }else{
    try {
      let x =  await tronWeb.defaultAddress;
      //console.log(x);
      loadMyInfo();
      let y = await tronWeb.trx.getUnconfirmedBalance(x.base58);
      y = tronWeb.toDecimal(y);
      //console.log(y);
      y /= sixZero;
      y = floor(y,1);
      //console.info(y);
      myDetails.myTrxBal  = y;
      $('.lower-left p span').text(y);
      myDetails.loaded =true;
      loginFunc();



  } catch (e) {
    $('.progressBar span').animate({ width: '100%' }, 'slow');
    $('body').addClass('loaded');
    $('.popup-info-panel-body p' ).text('no Internet Connection');
    $('.popup-info-panel').show();
    refreshForBalance();
      //console.log('no internet');
    }

  }
}

//try triggering initUi function  after load
$(window).load(function ()
{
  localStorage.clear();
  sessionStorage.clear();
  noLogin.injectData();
	clickLogIn();
});
//if not logged in try clicking loginBtn to login
$(DOMStrings.loginBtn).click(function ()
{
  //clearInterval(setrefresh);
	clickLogIn();
  console.log('login btn');
});

//if found user address
//it work also in no internet Connection
const loadMyInfo = async () => {
  //console.log('Loading my data');
  let _res = await tronWeb.defaultAddress;
  myDetails.myAddressInHex = _res.hex;
  myDetails.myAddressInBase58 = _res.base58;
  myDetails.myAddressInCheckSum = hexChecksum(_res.hex);

  let _loginBtnName = shortAddress(myDetails.myAddressInBase58);
  if(_res.name != ''){
    myDetails.myWalletName = _res.name;
    _loginBtnName = _res.name;
  }
  $(DOMStrings.loginBtn).text(_loginBtnName);
  $(DOMStrings.loginBtn).css({
    'background': 'none',
    'border':'none',
    'box-shadow': 'none',
    'color':'#fff',
    'font-size':'0.3em'
  });

}
