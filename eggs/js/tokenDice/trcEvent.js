


var bethistory = (function(){
  const sixZero = 1000000;
  //////////Checksum~to~hex~offline//////////////////
  function checksumHex(checksum) {
    let res = checksum.substr(2);
    let hex = "41" + res;
    return hex;

  }
  function shortAddress(address) {
    if(address != ''){
      let start = address.substring(0, 4);
      let end = address.substring(address.length - 4, address.length)
      let short = start + "..." + end;
      return short;
    }

  }
  const setupNameFromId = async () =>{

  }
  ///////////////////////////////////////////////////
  async function allHistory() {
    try {
      let history = await thisTronWeb.getEventResult(trcGameAddress, {
        eventName:'trc10BetEvent',
        size: 50,
      })
      history = history.map((item,i)=>{
        let txnHash = item.transaction;
        let link = `https://tronscan.org/#/transaction/${txnHash}`
        let{ addr,tokenId,payOut,betAmount,prediction,lucky_number,rollType} = item.result;
        let record = usersDatabase.filter(i=>i.checkSumAddress === addr)
        addr = checksumHex(addr);
        addr = thisTronWeb.address.fromHex(addr);
        let _nam = record.length && record[0].name?record[0].name:shortAddress(addr);
        let divider = 10 ** (PlayabletokenId[tokenId].precision);
        let paytrx = Math.floor(payOut / 1e4)/100;
        let tokenNam = PlayabletokenId[tokenId].name;
        let _betVal = (betAmount) / divider;
        let payAfterWin = payOut > 0?floor((payOut)/divider,2):0;
        let classClrwin = payOut>0?'greenCell':'redCell';
        let betType = rollType == 0?'Under':'Over';
        return(
          `<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/${txnHash}">${_nam}
            </a></td>
            <td>${betType} ${prediction}</td>
            <td class=${classClrwin}>${lucky_number}</td>
            <td>${_betVal} ${tokenNam}</td>
            <td class=${classClrwin}>${payAfterWin} ${tokenNam}</td>
            </tr>`
        )

      }).toString().replace(/,/g, '');
      document.querySelector(DOMStrings.allbetTableBody).innerHTML = history;

    } catch (e) {
      console.log(e);
      console.log('failed to render history');
    }
  }

  ///////////////////////////////////////////////////
  async function myHistory() {

    let myAddrChck = myDetails.myAddressInCheckSum;
    if(!myAddrChck){
      return null;
    }
    let address = myDetails.myAddressInBase58;
    let name = !!myDetails.myWalletName?myDetails.myWalletName:shortAddress(address);

    try {
      let record = usersDatabase.filter(i=>i.checkSumAddress === myAddrChck)
      let name = !!myDetails.myWalletName?myDetails.myWalletName:record.length && record[0].name?record[0].name:shortAddress(addr);

      let history = await thisTronWeb.getEventResult(trcGameAddress, {
        eventName:'trc10BetEvent',
        size: 50,
        filters: {
            "addr": myAddrChck
          }
      })
      history = history.map((item,i)=>{
        let txnHash = item.transaction;
        let link = `https://tronscan.org/#/transaction/${txnHash}`
        let{ addr,tokenId,payOut,betAmount,prediction,lucky_number,rollType} = item.result;
        if(addr !== address){
          return null;
        }
        // addr = checksumHex(addr);
        // addr = tronWeb.address.fromHex(addr);
        // let _nam = shortAddress(addr);
        let divider = 10 ** (PlayabletokenId[tokenId].precision);
        let paytrx = Math.floor(payOut / 1e4)/100;
        let tokenNam = PlayabletokenId[tokenId].name;
        let _betVal = (betAmount) / divider;
        let payAfterWin = payOut > 0?floor((payOut)/divider,2):0;
        let classClrwin = payOut>0?'greenCell':'redCell';
        let betType = rollType == 0?'Under':'Over';
        return(
          `<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/${txnHash}">${name}
            </a></td>
            <td>${betType} ${prediction}</td>
            <td class=${classClrwin}>${lucky_number}</td>
            <td>${_betVal} ${tokenNam}</td>
            <td class=${classClrwin}>${payAfterWin} ${tokenNam}</td>
            </tr>`
        )

      }).toString().replace(/,/g, '');
      document.querySelector(DOMStrings.mybetTableBody).innerHTML = history;

    } catch (e) {
      console.log(e);
      console.log('failed to render my history');
    }
  }
  //////////////////////////////
  async function watchNewtrcBet() {
    let hash = '';

    try {
      let contract = await thisTronWeb.contract().at(trcGameAddress);
  		await contract.trc10BetEvent().watch(async (err, item) =>{
      if (err) return console.error('Error with "method" event:', err);
      if (item && item.transaction == hash) {
        return console.log('duplicate hash');;
      }
      hash = item.transaction;
      let link = `https://tronscan.org/#/transaction/${hash}`
      let{ addr,tokenId,payOut,betAmount,prediction,lucky_number,rollType} = item.result;
      let record = usersDatabase.filter(i=>i.checkSumAddress === item.result[0])
      // addr = checksumHex(addr);
      addr = thisTronWeb.address.fromHex(addr);
      let _nam = record.length && record[0].name?record[0].name:shortAddress(addr);
      let divider = 10 ** (PlayabletokenId[tokenId].precision);
      let paytrx = Math.floor(payOut / 1e4)/100;
      let tokenNam = PlayabletokenId[tokenId].name;
      let _betVal = (betAmount) / divider;
      let payAfterWin = payOut > 0?floor((payOut)/divider,2):0;
      let classClrwin = payOut>0?'greenCell':'redCell';
      let betType = rollType == 0?'Under':'Over';
      let newBet = `<tr><td class="chopCell"><a target="_blank" href="https://tronscan.org/#/transaction/${hash}">${_nam}
          </a></td>
          <td>${betType} ${prediction}</td>
          <td class=${classClrwin}>${lucky_number}</td>
          <td>${_betVal} ${tokenNam}</td>
          <td class=${classClrwin}>${payAfterWin} ${tokenNam}</td>
          </tr>`
      $('tbody.allBetsHistory').prepend(newBet);
      $('tbody.allBetsHistory ').find('tr:nth-of-type(51)').remove();
      if(addr == myDetails.myAddressInBase58 ){
        if (pending) {
          _luckNum = lucky_number;
          payOnwinToken = payOut;
          
          console.log('watch');
        }

        $('tbody.myBetsHistory').prepend(newBet);
        $('tbody.myBetsHistory ').find('tr:nth-of-type(51)').remove();
      }
      })

    } catch (e) {
      console.error('failed to watch events');
    }
	}
  const restartWatch = async () =>{
    await watchNewtrcBet.stop();
    await watchNewtrcBet();
  }
  // const refresh = async () =>{
  //   setInterval(function(){
  //     if(myDetails.myAddressInBase58 != ''){
  //     allHistory();
  //     myHistory();
  //   }
  //   },3000);
  // }
  const hisInItUi = async () => {
      allHistory();
      watchNewtrcBet();
  }
  return {
    'myHistory':myHistory,
    'hisInItUi':hisInItUi,
    'restartWatch':restartWatch
  }
})();
