const listId = [1001909,1002000,1000001,1000226,1002413,1001313,1001351,1001316,1000322,1002670,1001092,  1002366,1002531,1000985,1002646,1002145,1001584,1001107];

var PlayabletokenId = {

  1001909:{name:'DEP',wager:'0',precision:'5',min:'1000',poolBal:'0',myValue:'0',poolLmtToken:'1000000'},//1001909
  1002000:{name:'BTT',wager:'0',precision:'6',min:'500',poolBal:'0',myValue:'0',poolLmtToken:'50000'},//1002000
  1002366:{name:'DTL',wager:'0',precision:'0',min:'500',poolBal:'0',myValue:'0',poolLmtToken:'500000'},//1002366
  1002531:{name:'DTLS',wager:'0',precision:'5',min:'1000',poolBal:'0',myValue:'0',poolLmtToken:'1000000'},
  //1002095:{name:'FOP',wager:'0',precision:'0',min:'500',poolBal:'0',myValue:'0',poolLmtToken:'5000000'},//1002366
  1000985:{name:'SANTA',wager:'0',precision:'0',min:'100000',poolBal:'0',myValue:'0',poolLmtToken:'200000000'},
  //1002608:{name:'LCT',wager:'0',precision:'6',min:'1000',poolBal:'0',myValue:'0',poolLmtToken:'100000000'},
  1002145:{name:'TWN',wager:'0',precision:'0',min:'100000',poolBal:'0',myValue:'0',poolLmtToken:'1000000000'},
  1002646:{name:'TALC',wager:'0',precision:'6',min:'10',poolBal:'0',myValue:'0',poolLmtToken:'10000'},
  1001584:{name:'SUDWA',wager:'0',precision:'0',min:'1200',poolBal:'0',myValue:'0',poolLmtToken:'12000000'},

  1000001:{name:'SEED',wager:'0',precision:'0',min:'8',poolBal:'0',myValue:'0',poolLmtToken:'0'},
  1000226:{name:'TERC',wager:'0',precision:'0',min:'40',poolBal:'0',myValue:'0',poolLmtToken:'0'},
  1000322:{name:'TRUC',wager:'0',precision:'0',min:'32000',poolBal:'0',myValue:'0',poolLmtToken:'0'},
  1002413:{name:'BTZC',wager:'0',precision:'6',min:'500',poolBal:'0',myValue:'0',poolLmtToken:'0'},
  1002670:{name:'SCC',wager:'0',precision:'6',min:'7',poolBal:'0',myValue:'0',poolLmtToken:'0'},
  1001092:{name:'SCT',wager:'0',precision:'0',min:'1400',poolBal:'0',myValue:'0',poolLmtToken:'0'},
  1001313:{name:'CGIZA',wager:'0',precision:'0',min:'9',poolBal:'0',myValue:'0',poolLmtToken:'0'},
  1001351:{name:'CDF',wager:'0',precision:'0',min:'250',poolBal:'0',myValue:'0',poolLmtToken:'0'},
  1001316:{name:'TSY',wager:'0',precision:'0',min:'200',poolBal:'0',myValue:'0',poolLmtToken:'0'},
  1001107:{name:'KAOS',wager:'0',precision:'0',min:'6',poolBal:'0',myValue:'0',poolLmtToken:'0'}
}

const translateValue = (val) =>{
  //console.log(typeof val);
  if(typeof val !== 'number') return val;
  if(val > 1e12){
    val = Math.floor(val / 1e10)/100;
    val = `${val}T+`
  }else if (val > 1e9) {
    val = Math.floor(val / 1e7)/100;
    val = `${val}B+`
  }else if (val > 1e6) {
    val = Math.floor(val / 1e4)/100;
    val = `${val}M+`
  }else if (val > 1e3) {
    val = Math.floor(val / 10)/100;
    val = `${val}K+`
  }
//  console.log(val);
  return val;
}

$(document).ready(function(){
let _all =listId.map((data, i) =>{
  return '<tr class="'+data+'"><th scope="row"><a href="https://tronscan.org/#/token/'+data+'" target="_blank">'+PlayabletokenId[data].name +
              '</a></th><td>' + 0+
              '</td><td >' + 0+
              '</td></tr>';
})
$(DOMStrings.disTokenWagerAndPool).html(_all);
let _all2 =listId.map((data2, i) =>{
  return '<div class="token-in-list" id="'+data2+
                  '"><div class="tokenName">' + PlayabletokenId[data2].name +
                  '</div><div class="tokenWager">' + 0 +
                  '</div><div class="playButton"><i class="far fa-check-circle"></i></div></div>';
})
$(DOMStrings.tokeninlistbody).html(_all2);

});



var trc10private = (function(){

  const sixZero = 1000000;

  var totalListedTokenCount = 0;

  function floor(value,decimal){
    let _x = 10 ** decimal;
    return (Math.floor(value *_x) / _x)
  }
  function shortAddress(address) {
    let start = address.substring(0, 4);
    let end = address.substring(address.length - 4, address.length)
    let short = start + "..." + end;
    return short;
  }
  /////////////////////////////////////////////
  const getTotalPlayed = async () =>{
    let diceCtrt = await tronWeb.contract().at(trcGameAddress);
    Object.keys(PlayabletokenId).forEach(async res => {
      PlayabletokenId[res].wager = tronWeb.toDecimal(await diceCtrt.played(res).call());
         });
      //console.log(PlayabletokenId);
  }
  ///pool token bal
  const getPoolToken = async () => {
   await tronWeb.trx.getAccount(trcGameAddress).then(async result =>{
       //console.log(result);

         //console.log(result);
         Object.keys(PlayabletokenId).forEach(async res => {
           for (var i = 0; i < result.assetV2.length; i++) {
           if(res == result.assetV2[i].key){
             PlayabletokenId[res].poolBal = result.assetV2[i].value;
             //console.log(PlayabletokenId[res].poolBal);
           }
         }


           //console.log(PlayabletokenId);
              });
       await disTotalWager();
     });
  }


  ///my token bal
  const geyMyToken = async () =>{

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
        displayInfo();
      });

  }
  /////////////////
  const displayInfo = async () => {
    $(DOMStrings.myTrxbal).text(myDetails.myTrxBal);
    let name = myDetails.myWalletName;
    if(myDetails.myWalletName != ''){
      $(DOMStrings.loginBtn).text(myDetails.myWalletName);
    }else {
      $(DOMStrings.loginBtn).text(shortAddress(myDetails.myAddressInBase58));
    }
    $(DOMStrings.loginBtn).css({
      'background': 'none',
      'border':'none',
      'box-shadow': 'none',
      'color':'#fff',
      'font-size':'0.3em'
    });

  }

  const disTotalWager = async () =>{
    let diceCtrt = await tronWeb.contract().at(trcGameAddress);
    var allToken = '';
    var tokenChanger = '';
    // let _all =await listId.map(async (data, i) =>{
    //   let _w = await diceCtrt.played(data).call();
    //   _w = tronWeb.toDecimal(_w);
    //
    //   return '<div class="token-in-list" id="'+data+
    //                       '"><div class="tokenName">' + PlayabletokenId[data].name +
    //                       '</div><div class="tokenWager">' + _w +
    //                       '</div><div class="playButton"><i class="far fa-check-circle"></i></div></div>';
    // })
    // console.log(_all);
    // $(DOMStrings.tokeninlistbody).html(_all);
    executeTrc(0);
async function executeTrc(_x){
  if (Object.keys(PlayabletokenId).length> _x) {
    //console.log(_x);
    let res = Object.keys(PlayabletokenId)[_x];
    await diceCtrt.played(res).call().then(async res2 =>{
      PlayabletokenId[res].wager = tronWeb.toDecimal(res2);


    let _poolBal = PlayabletokenId[res].poolBal /(10 ** PlayabletokenId[res].precision);
    _poolBal -= PlayabletokenId[res].poolLmtToken;
    _poolBal = floor(_poolBal/2,3);
    //console.log(_poolBal);
    allToken += '<tr class="'+res+'"><th scope="row"><a href="https://tronscan.org/#/token/'+res+'" target="_blank">'+PlayabletokenId[res].name +
                '</a></th><td>' + translateValue(PlayabletokenId[res].wager)+
                '</td><td >' + translateValue(_poolBal)+
                '</td></tr>';

    tokenChanger += '<div class="token-in-list" id="'+res+
                    '"><div class="tokenName">' + PlayabletokenId[res].name +
                    '</div><div class="tokenWager">' + translateValue(PlayabletokenId[res].wager) +
                    '</div><div class="playButton"><i class="far fa-check-circle"></i></div></div>';
    _x += 1;
    executeTrc(_x);
    });
  }else if (Object.keys(PlayabletokenId).length == _x)  {
    $(DOMStrings.disTokenWagerAndPool).html(allToken);
    $(DOMStrings.tokeninlistbody).html(tokenChanger);
  }
}
  }
  ///////

  const rRefresh = async () =>{
    setInterval(async function() {
     await getTotalPlayed();
     await getPoolToken();

   },10000);
  }



  const privatInIt = async () =>{

      //await getTotalPlayed();
      await getPoolToken();
      //await geyMyToken();

      //rRefresh();


  }
  return{
    "privatInIt":privatInIt
  }
})();

/////////////////
