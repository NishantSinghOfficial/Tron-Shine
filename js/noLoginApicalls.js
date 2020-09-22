/*calling for contract balance
*total bets
*pool balance
*/
const dicecontractApi = 'https://apilist.tronscan.org/api/contract?contract='+diceGame;
const getBarApi = 'https://apilist.tronscan.org/api/contract?contract='+barsctrt;
const barsEventApi = 'https://api.trongrid.io/event/contract/'+barsctrt+'?size=50&page=1';



var publicDataFromApi = {
  poolBalance:0,
  contractBal:0,
  totaltrxn:0
}
const resultOutcome = {
  1:'GREY',
  2:'BLUE',
  3:'GREEN',
  4:'RED'
}
var noLogin = (function(){
  const apicall = async () =>{
    fetch(getBarApi)
    .then((resp) => resp.json())
    .then(function(res){
      fetch(dicecontractApi)
      .then((resp2) => resp2.json())
      .then(function(res2){
        //console.log(res.data[0].balance + ' '+res2.data[0].balance);
        let _bal = (res.data[0].balance + res2.data[0].balance)/sixZero;

        publicDataFromApi.contractBal =floor(_bal,2);
        publicDataFromApi.totaltrxn = (res.data[0].trxCount + res2.data[0].trxCount +125428);
        let pool = (publicDataFromApi.contractBal - 18000);
        if(pool >0){
          pool*= 0.7;
        }
        publicDataFromApi.poolBalance = floor(pool,2);
        //console.log(publicDataFromApi);
        $(DOMStrings.poolTrx).text(publicDataFromApi.poolBalance + ' TRX');
        $('p#totalBets').text(publicDataFromApi.totaltrxn);
        $('p#contractBalance').text(publicDataFromApi.contractBal);
      })
      .catch(function(error){
        console.log(error);
      })
    })
    .catch(function(error){
      console.log(error);
    })


  }
  const apievent = async () =>{
    let newBet ='';

    //console.log(contractEventApi);
    fetch(barsEventApi)

    .then((resp) => resp.json())
    .then(function(event){
      //console.log(event);
      execute(0);
      async function execute(_x){
          let res = event[_x];


        //console.log(res);
        let hash = res.transaction_id;
         let _checkAddr = res.result.addr;
         prakash.userData.myDetail.fromChecksum(_checkAddr).then(data =>{

           //console.log(data);
           let name =shortAddress(data[0].address);

           if (data[0].name != '') {
              name = data[0].name;
           }
        let classClrwin = 'redCell';
        let payAfterWin = 0;
        if (res.result.payOut != 0) {
          classClrwin = 'greenCell';
          payAfterWin = res.result.payOut/sixZero + ' TRX';
        }
        let _dappType = 'forbox';
        if(res.result.dappType == 2){
          _dappType = 'forHeart';
        }else if(res.result.dappType == 3){
          _dappType = 'foregg';
        }else if(res.result.dappType == 4){
          _dappType = 'forstar';
        }


        newBet = '<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/'+hash+'">' + name +
          '</a></td><td><span class="'+resultOutcome[res.result.prediction]+' '+_dappType+'"></span></td><td><span class="' + resultOutcome[res.result.lucky_number] +' '+_dappType+
          '"></span></td><td>' + (res.result.betAmount) / sixZero+' TRX'+
          '</td><td class="' + classClrwin + '">' + payAfterWin +
          '</td></tr>';
          $(DOMStrings.allbetTableBody).append(newBet);
            _x += 1;
          if(_x <event.length){

            execute(_x);
          }



        //});
      });


    }


    })
    .catch(function(error){
      console.log(error);
    })
  }

  const injectData = async () =>{
    apicall();
    apievent();

  }
  return{
    "injectData":injectData
  }


})();
