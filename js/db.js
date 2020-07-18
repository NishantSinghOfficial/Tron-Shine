var dbObject ={

}
function hexChecksum(hex) {
  if(hex.length >2){
    let res = hex.substr(2);
    let chck = "0x" + res;
    return chck;
  }
}
var myDatabase = (function(){

  /*******insert left user in db********/
  const insertNewUser = async () =>{
    prakash.totalUserCount().then(async allCount =>{
      //console.error(allCount);
      let mineCtrt = await tronWeb.contract().at(miningAddr);
      let _z = await mineCtrt.totalPlayer().call();
      _z = tronWeb.toDecimal(_z);
      //console.error(_z);
      if(_z > allCount){
        getDataFromTronWeb();
        async function getDataFromTronWeb(){
          let mineCtrt = await tronWeb.contract().at(miningAddr);
          let _checkSumAdd = await mineCtrt.playerIndex(allCount).call();
          let _base58 = tronWeb.address.fromHex(_checkSumAdd);
          _checkSumAdd = hexChecksum(_checkSumAdd);
          //console.log(_checkSumAdd);
          //console.log(_base58);
          tronWeb.trx.getAccount(_base58).then(async userData =>{
            //console.log(userData);
            let name = '';
            if (userData.account_name) {
              name = tronWeb.toAscii(userData.account_name);
              //console.log(name);

            }
            prakash.updateDB.newUser(allCount,_base58,_checkSumAdd,name).then(dbRes =>{
              //console.log(dbRes);
              console.log('welcome a new player');
              allCount += 1;
              if(_z > allCount){
                getDataFromTronWeb();
              }else {
                //console.log("all address inserted");
                updateAllWager();
              }
            })
            .catch(function(e){
              console.log(e);
              getDataFromTronWeb();
            })
            /*check if a visitor */
            try {
              let _result = await prakash.updateDB.markActiveVisitor(_base58);
              //console.log(_result);
              if (_result == 'false') {
                await prakash.updateDB.newVisitor(_base58,'',1);
                console.log('new active');
              }
            } catch (e) {
              console.log(e);
            }


          })
          .catch(function(ee){
            console.log(ee);
            getDataFromTronWeb();
          })
        }

      }else {
        updateAllWager();
      }
    })

  }
  /*********update every users wager*************/
  const updateAllWager = async ()=>{
    let _uint = 0
    prakash.allUser.queryUser().then(res =>{
      //console.log(res);
        getaddr();
        async function getaddr(){
          let miningCtrt = await tronWeb.contract().at(miningAddr);
          let _addr = res[_uint].address;
          //console.log(_addr);
          await miningCtrt.myWager(_addr).call().then(async wager =>{
            wager = tronWeb.toDecimal(wager);
            //console.log(wager);
            try {
              await prakash.updateDB.myWager.fromBase58(_addr,wager);
              _uint +=1;
              if(res.length > _uint){
                getaddr();
              }
            } catch (e) {
              console.log(e);
              getaddr();
            }

          })
        .catch(e =>{
          console.log(e);
          getaddr();
        });
        }
    })
    .catch(function(err){
      console.log(err);
    })

    //getaddr();

  }
  /**********update my wager ***************/
  const updateMyName = async () =>{
    let _addr = myDetails.myAddressInBase58;
    if(_addr == '')console.log('empty address');
    //console.log(_addr);
    await prakash.isUser.fromBase58(_addr).then(async res=>{
      console.log(res);
      if(res){
        prakash.userData.myDetail.fromBase58(_addr).then(data=>{
          //console.log(data);
          //console.log(data[0].name);
          if (data[0].name == '') {
            tronWeb.trx.getAccount(_addr).then(async userData =>{
              //console.log(userData);
              if (userData.account_name) {
              let  name = tronWeb.toAscii(userData.account_name);
                //console.log(name);
                try {
                  await prakash.updateDB.myName.fromBase58(_addr,name);
                  //console.log('success');
                } catch (e) {
                  console.log(e);
                }
              }else if(tronWeb.defaultAddress.name){
                let  name = tronWeb.defaultAddress.name;
                  console.log(name);
                  try {
                    await prakash.updateDB.myName.fromBase58(_addr,name);
                    //console.log('success');
                  } catch (e) {
                    console.log(e);
                  }
              }
            })

          }else {
            /*set name in local object wallet name*/

            $(DOMStrings.loginBtn).text(data[0].name);
          }
        })
        let miningCtrt = await tronWeb.contract().at(miningAddr);
        //console.log(_addr);
        await miningCtrt.myWager(_addr).call().then(async wager =>{
          wager = tronWeb.toDecimal(wager);
          //console.log(wager);
          try {
            await prakash.updateDB.myWager.fromBase58(_addr,wager);

          } catch (e) {
            console.log(e);
          }

        })
      }else {
      }

    })
    .catch(function(error){
      console.log(error);
    })

  }
  const insertVisitors = async ()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    //console.log(ref +' :: this is referral code');
    let add = myDetails.myAddressInBase58;
    try {
      let _ref = await prakash.updateDB.newVisitor(add,ref);
      let link = `https://tronshine.org?ref=${_ref}`;
      $(DOMStrings.disLink).val(link);
      //getReferralData();
      //console.log('new visitor');
    } catch (e) {
        console.log(e);
    }
  }

  const getReferralData = async ()=>{
    let add = myDetails.myAddressInBase58;
    //console.log(add);
    try {
      let code = await prakash.myReferral(add);
      if(code[0].myReferral){
        let link = "https://tronshine.org?ref="+code[0].myReferral;
        $(DOMStrings.disLink).val(link);
        let totalCount = code[1].TotalCount
        let totalActiveCount= code[2].TotalActiveCount;
        $(DOMStrings.disActiveCount).val(totalActiveCount);
        $(DOMStrings.totalRef).val(totalCount);


      }else {
        insertVisitors();
      }

    } catch (e) {
      //console.error(e);
      insertVisitors();
    }
  }

  async function injectDb(){
    //console.error('injectDb');
    insertNewUser();
    updateMyName();
    getReferralData();
  }
  return {
    'injectDb':injectDb
  }

})();
// $(window).load(function(){
//   myDatabase.injectDb();
// });
