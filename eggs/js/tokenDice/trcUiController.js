
const loader = ()=>{
  $('.progressBar span').animate({ width: '20%' }, 'slow');
  myDatabase.insertNewUser();
  $('.progressBar span').animate({ width: '40%' }, 'slow');
  bethistory.hisInItUi();
  $('.progressBar span').animate({ width: '60%' }, 'slow');
  chattingApp.chatinitUi();
  $('.progressBar span').animate({ width: '80%' }, 'slow');
  trc10private.privatInIt();
  $('.progressBar span').animate({ width: '100%' }, 'slow');
  topPlayer.rankIn();
  $('body').addClass('loaded');
}
const loginFunc = async () =>{
  myInfo.myInfoinitUi();
  myDatabase.injectDb();
  bethistory.myHistory();
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

  }
}

var setrefreshForBal;
//checking if loader after if found address
async function checkErrorAndLoad(){
  try {
    await tronWeb.trx.getUnconfirmedBalance(myDetails.myAddressInBase58);
    clickLogIn();
   clearInterval(setrefreshForBal);
  } catch(e){
    console.error('cant fetch data, please check your internet connection');
  }
}

function refreshForBalance(){
    setrefreshForBal = setInterval(checkErrorAndLoad, 10000);

}

//main loging function

async function clickLogIn(){
  if (window.tronWeb && tronWeb.defaultAddress.base58){

    let x =  await tronWeb.defaultAddress;
    await loadMyInfo();
      await tronWeb.trx.getAccount(myDetails.myAddressInBase58).then(async result =>{
        if(result.account_name){
          myDetails.myWalletName = tronWeb.toAscii(result.account_name);
        }
          for (var i = 0; i < result.assetV2.length; i++) {
            //console.log(result.assetV2[i].key);
            Object.keys(PlayabletokenId).forEach(async res => {
              if(res == result.assetV2[i].key){
                PlayabletokenId[res].myValue = result.assetV2[i].value;

              }
            });
          }
          loginFunc();
        })
        .catch(async error=>{
          console.log(error);
          $('.popup-info-panel-body p' ).text('no Internet Connection');
          $('.popup-info-panel').show();
          refreshForBalance();
            console.log('no internet');
        });

  }else {
    refresh()
  }
}

//try triggering initUi function  after load
$(window).load(function (){
  loader();
	clickLogIn();
});
//if not logged in try clicking loginBtn to login
$(DOMStrings.loginBtn).click(function (){
  if (!window.tronWeb) {
    //console.log('no window.tronWeb');
    $('.popup-info-panel-body p' ).text('please open using google chrome and install tron link chrome extension or using any tron supported wallet');
    $('.popup-info-panel').show();
  }else if (!tronWeb.defaultAddress.base58) {
    $('.popup-info-panel').show();
  }else {
    clickLogIn();
  }
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
    myDetails.myWalletName = _loginBtnName = _res.name;
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
