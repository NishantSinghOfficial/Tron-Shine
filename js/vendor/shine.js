var remainingBetHash = [];

const privateKey = "EE07E87AEF50F03CCC9E057A1651F6F04DF3F6F560013D69B6FE6B2E71D1E9B6";
const thisTronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  eventServer: 'https://api.trongrid.io',
  privateKey,
})
const host='../php/';
// const host='https://tronshine.org/php/';

/***********important contract address *************/
const shine = 'TC4X34Ga9vvYTfBpMzdNyprKgWzJ86GMSX';
const diceGame = 'THcZA5czPiFXfBw955XhsvWwSB2ogrbFyt';
const freezeAddr ='TR6JU2ptLAEXSf2XwFXKktUkN9EXxdf2Cb';
const trcGameAddress = 'TPw9jf4ZkaVySurzDgABWZmLkt1dSPknQA';
const miningAddr = 'THUKzrS5eoyt9aG75C1SiDYa2yk9xZLaF5';
const chatContract = 'TBNXvuSFQHfvpiqcwoLnPwq1hnbVvCtBK6';
const barsctrt = 'THKHurBR3MA7zPLnEqNY2fuvW3jgsHU81o';


const contractApi = 'https://apilist.tronscan.org/api/contract?contract='+diceGame+'';
const barcontractApi = 'https://apilist.tronscan.org/api/contract?contract='+barsctrt;
const contractEventApi = 'https://api.trongrid.io/event/contract/'+diceGame+'?size=50&page=1';
const trcBalApi = 'https://api.trongrid.io/v1/accounts/'+trcGameAddress;
const trccontractApi = 'https://api.trongrid.io/event/contract/'+trcGameAddress+'?size=50&page=1';
/***************/
 async function fetchApi(url){
   try {
     let resp = await fetch(url);
     let res = resp.json();
     return res;
     // console.log(res);
   } catch (e) {
     return "null";
     console.error(e);
   }
}
function shortAddress(address) {
  let start = address.substring(0, 4);
  let end = address.substring(address.length - 4, address.length)
  let short = start + "..." + end;
  return short;
}
function hexChecksum(hex) {
  if(hex.length >2){
    let res = hex.substr(2);
    let chck = "0x" + res;
    return chck;
  }
}
//////////Checksum~to~hex~offline//////////////////
function checksumHex(checksum) {
  let res = checksum.substr(2);
  let hex = "41" + res;
  return hex;

}
function floor(value,decimal){
  let _x = 10 ** decimal;
  return (Math.floor(value *_x) / _x)
}
async function ajaxSend(data){
  $.ajax({
    url  : host + "api/postapi/updatename.php",
    type : "POST",
    data : {
            username: myname,
            address   : _addr,
            submitType:"updateName"
              },
  success:function(data)
           {
     if($.trim(data) === "name updated")
                   {
           //console.log("successfull");
          //console.log(data);
                      } else { console.log(data);}
              },
   error: function(error)
           {
    console.log("Error AJAX not working: "+ error );
              }
});
}


var prakash ={
  isUser: { fromBase58:async function(address){
            let url = host + "api/isPlayer.php?submitType=fromBase58&address="+address;
            return await fetchApi(url);
          },
            fromChecksum:async function(checksumAddr){
              let url = host + "api/isPlayer.php?submitType=fromChecksum&checksumAddr="+checksumAddr;
              return await fetchApi(url);
            } },
  isVisior: { fromBase58:async function(address){
            let url = host + "api/isPlayer.php?submitType=getVisitor&fromBase58="+address;
            return await fetchApi(url);
          } },
  name:{fromChecksum:function(){} },
  myReferral:async function(address){
    let url = host + "api/getVisitor.php?submitType=getVisitor&address="+address;
    return await fetchApi(url);
  },

  userData:{
    myName:{
      fromBase58:async function(address){
        let url = host + "api/getUserData.php?submitType=getUser&address="+address;
        let resp = await fetchApi(url);
        if(resp != "null"){
          return resp[0].name;
        }else {
          return shortAddress(resp[0].address);
        }

      },
      fromChecksum:async function(checkSumAddress){
        let url = host + "api/getUserData.php?submitType=getUser&checkSumAddress="+checkSumAddress;
        let resp = await fetchApi(url);
        if(resp != "null"){
          return resp[0].name;
        }else {
          return shortAddress(resp[0].address);
        }
      },
      fromPlayerIndex:async function(playerIndex){
        let url = host + "api/getUserData.php?submitType=getUser&playerIndex="+playerIndex;
        let resp = await fetchApi(url);
        if(resp != "null"){
          return resp[0].name;
        }else {
          return shortAddress(resp[0].address);
        }
      }
    },
            myWager:{fromBase58:async function(address){
              let url = host + "api/getUserData.php?submitType=getUser&address="+address;
              let resp = await fetchApi(url);
              if(resp != "null"){
                return resp[0].myWager;
              }else {
                return"user not found ";
              }

            },
            fromChecksum:async function(checkSumAddress){
              let url = host + "api/getUserData.php?submitType=getUser&checkSumAddress="+checkSumAddress;
              let resp = await fetchApi(url);
              if(resp != "null"){
                return resp[0].myWager;
              }else {
                return"user not found ";
              }
            },
            fromPlayerIndex:async function(playerIndex){
              let url = host + "api/getUserData.php?submitType=getUser&playerIndex="+playerIndex;
              let resp = await fetchApi(url);
              if(resp != "null"){
                return resp[0].myWager;
              }else {
                return"user not found ";
              }
            }
          },
            myWon:{fromBase58:async function(address){
              let url = host + "api/getUserData.php?submitType=getUser&address="+address;
              let resp = await fetchApi(url);
              if(resp != "null"){
                return resp[0].myWon;
              }else {
                return"user not found ";
              }

            },
            fromChecksum:async function(checkSumAddress){
              let url = host + "api/getUserData.php?submitType=getUser&checkSumAddress="+checkSumAddress;
              let resp = await fetchApi(url);
              if(resp != "null"){
                return resp[0].myWon;
              }else {
                return"user not found ";
              }
            },
            fromPlayerIndex:async function(playerIndex){
              let url = host + "api/getUserData.php?submitType=getUser&playerIndex="+playerIndex;
              let resp = await fetchApi(url);
              if(resp != "null"){
                return resp[0].myWon;
              }else {
                return"user not found ";
              }
            }
          },
            myLost:{fromBase58:async function(address){
              let url = host + "api/getUserData.php?submitType=getUser&address="+address;
              let resp = await fetchApi(url);
              if(resp != "null"){
                return resp[0].myLost;
              }else {
                return"user not found ";
              }

            },
            fromChecksum:async function(checkSumAddress){
              let url = host + "api/getUserData.php?submitType=getUser&checkSumAddress="+checkSumAddress;
              let resp = await fetchApi(url);
              if(resp != "null"){
                return resp[0].myLost;
              }else {
                return"user not found ";
              }
            },
            fromPlayerIndex:async function(playerIndex){
              let url = host + "api/getUserData.php?submitType=getUser&playerIndex="+playerIndex;
              let resp = await fetchApi(url);
              if(resp != "null"){
                return resp[0].myLost;
              }else {
                return"user not found ";
              }
            }
          },
            myDetail:{fromBase58:async function(address){
              let url = host + "api/getUserData.php?submitType=getUser&address="+address;
              return await fetchApi(url);
            },
            fromChecksum:async function(checkSumAddress){
              let url = host + "api/getUserData.php?submitType=getUser&checkSumAddress="+checkSumAddress;
              return await fetchApi(url);
            },
            fromPlayerIndex:async function(playerIndex){
              let url = host + "api/getUserData.php?submitType=getUser&playerIndex="+playerIndex;
              return await fetchApi(url);
            }
          } },
  allUser:{ blankName:async function (){
            let url = host + "api/blankName.php";
            return await fetchApi(url);
              },
          blankCheckSum:async function(){
            let url = host + "api/blankChecksum.php";
            return await fetchApi(url);
          },
          topPlayer:async function(){
            let url = host + "api/topWager.php";
            return await fetchApi(url);
          },
          queryUser:async function(){
            let url = host + "main.php";
            return await fetchApi(url);
          }
        },
  totalUserCount:async function(){
    let url = host + "api/playerCount.php";
    return await fetchApi(url);
  },


  updateDB:{
    myName:{
      fromChecksum:function(checkSumAddress,myname){ $.ajax({
            url  : host + "api/postapi/updatename.php",
            type : "POST",
            data :{
              name: myname,
              checkSumAddress:checkSumAddress,
              submitType:"updateName"
                },
                success:function(data){
                           if($.trim(data) === "name updated"){
                              console.log("successfull");
                              console.log(data);
                            } else { console.log(data);}
                          },
                error: function(error){
                        console.log("Error AJAX not working: "+ error );
                      }
              });
          },
    fromBase58:function(_addr,myname){ $.ajax({
          url  : host + "api/postapi/updatename.php",
          type : "POST",
          data :{
            username: myname,
            address   : _addr,
            submitType:"updateName"
              },
              success:function(data){
                         if($.trim(data) === "name updated"){
                            console.log("successfull");
                            console.log(data);
                          } else { console.log(data);}
                        },
              error: function(error){
                      console.log("Error AJAX not working: "+ error );
                    }
                  });
              },
        },
  myWager:{
    fromChecksum:function(checkSumAddress,myWager){ $.ajax({
          url  : host + "api/postapi/updateWager.php",
          type : "POST",
          data :{
            myWager: myWager,
            checkSumAddress:checkSumAddress,
            submitType:"updateWager"
              },
              success:function(data){
                         if($.trim(data) === "wager updated"){
                            console.log("successfull");
                            console.log(data);
                          } else { console.log(data);}
                        },
              error: function(error){
                      console.log("Error AJAX not working: "+ error );
                    }
            });
        },
  fromBase58:function(_addr,myWager){ $.ajax({
        url  : host + "api/postapi/updateWager.php",
        type : "POST",
        data :{
          myWager: myWager,
          address   : _addr,
          submitType:"updateWager"
            },
            success:function(data){
                       if($.trim(data) !== "wager updated"){
                          console.log(data);
                        }
                      },
            error: function(error){
                    console.log("Error AJAX not working: "+ error );
                  }
                });
            },
      },
  myWon:function(){},
  myLost:function(){},
  myChecksum:function(_addr,myWager){ $.ajax({
        url  : host + "api/postapi/updateChecksumAddr.php",
        type : "POST",
        data :{
          myWager: myWager,
          address   : _addr,
          submitType:"updatedchecksum"
            },
            success:function(data){
                       if($.trim(data) === "check sum address  updated"){
                          console.log("successfull");
                          console.log(data);
                        } else { console.log(data);}
                      },
            error: function(error){
                    console.log("Error AJAX not working: "+ error );
                  }
                });
            },
  myBetRecord:async function(checkSumAddress,betAmount,paidVal){
               $.ajax({
                url  : host + "api/postapi/insertBetResult.php",
                type : "POST",
                data : {
                        betAmount:betAmount,
                        paidVal:paidVal,
                        checkSumAddress:checkSumAddress,
                        submitType:"newBet"
                          },
              success:function(data)
                       {
                 if($.trim(data) !== "success submit")
                               {
                      console.log(data);
                                  }
                          },
               error: function(error)
                       {
                console.log("Error AJAX not working: "+ error );
                          }
            });
          },
  newUser:async function(index,_addr,checkSumAddress,myname){
               $.ajax({
                url  : host + "api/postapi/insertUser.php",
                type : "POST",
                data : {
                        index:index,
                        name: myname,
                        address   : _addr,
                        checkSumAddress:checkSumAddress,
                        submitType:"newUser"
                          },
              success:function(data)
                       {
                 if($.trim(data) !== "success submit")
                               {
                      console.log(data);

                    }else {
                      return  true;
                    }
                          },
               error: function(error)
                       {
                console.log("Error AJAX not working: "+ error );
                          }
            });
          },
      newVisitor:async function(_addr,code,active){
                let build = {
                  address:_addr,
                  ref   : code,
                  submitType:"newVisitor"
                }
                if (active == 1) {
                  build.active = active;
                }
                   return $.ajax({
                    url  : host + "api/postapi/insertVisitor.php",
                    type : "POST",
                    data : build,
                  success:function(data)
                           {
                     if($.trim(data) !== "already a visitor or user" || $.trim(data) !== "in valid address"){
                          //console.error(data);
                      }else {

                      }
                              },
                   error: function(error)
                           {
                    console.error("Error AJAX not working: "+ error );
                              }
                });
              },
      markActiveVisitor:async function(_addr){
                let build = {
                  address:_addr,
                  submitType:"markActive"
                }
                let x = null;
                    return $.ajax({
                    url  : host + "api/postapi/activateVisitor.php",
                    type : "POST",
                    data : build,
                  success:function(data)
                           {
                              x = $.trim(data);
                            //console.log(x);

                              },
                   error: function(error)
                           {
                    console.error("Error AJAX not working: "+ error );
                              }
                });


              }
          },



  withTronWeb:{ myName:function(){},
                myWager:function(){},
                myChecksum:function(){},
                totalUserCount:function(){},
                isUser:function(){},
                playerIndex:function(){},
                playerAddress:function(){},
                myMined:function(){},
                myShine:function(){},
                myFrozen:function(){},
                myUnfreezeTime:function(){}

              }
}
let usersDatabase = [];
(async function (){
  try {
     usersDatabase = await prakash.allUser.queryUser();
     // console.log(usersDatabase);
  } catch (e) {
    console.log('could not get usersDatabase');
  }
})();

async function test(){

   // let y = await prakash.isUser.fromBase58("TP1uPb3cVau52DNicAvQU9fgm73iPh4tXC");
   // console.log(y);
  // let z = await prakash.isUser.fromChecksum("0xecc957751977bae0847c50bb10e2203e04509ab2");
  // console.log(z);
  // let a =await prakash.userData.myName.fromChecksum("0xecc957751977bae0847c50bb10e2203e04509ab2");
  // console.log(a);
  // let b = await prakash.userData.myName.fromBase58("TXZDfnvxwy6CCdZygWnhunK2XSjokuBHCX");
  // console.log(b);
  // let c = await prakash.userData.myName.fromPlayerIndex("78");
  // console.log(c);
  // let d =await prakash.userData.myWager.fromChecksum("0xecc957751977bae0847c50bb10e2203e04509ab2");
  // console.log(d);
  // let e = await prakash.userData.myWager.fromBase58("TXZDfnvxwy6CCdZygWnhunK2XSjokuBHCX");
  // console.log(e);
  // let f = await prakash.userData.myWager.fromPlayerIndex("78");
  // console.log(f);
  // let g =await prakash.userData.myWon.fromChecksum("0xecc957751977bae0847c50bb10e2203e04509ab2");
  // console.log(g);
  // let h = await prakash.userData.myWon.fromBase58("TXZDfnvxwy6CCdZygWnhunK2XSjokuBHCX");
  // console.log(h);
  // let i = await prakash.userData.myWon.fromPlayerIndex("78");
  // console.log(i);
  // let k =await prakash.userData.myLost.fromChecksum("0xecc957751977bae0847c50bb10e2203e04509ab2");
  // console.log(k);
  // let l = await prakash.userData.myLost.fromBase58("TXZDfnvxwy6CCdZygWnhunK2XSjokuBHCX");
  // console.log(l);
  // let m = await prakash.userData.myLost.fromPlayerIndex("78");
  // console.log(m);
  // let n =await prakash.userData.myDetail.fromChecksum("0xecc957751977bae0847c50bb10e2203e04509ab2");
  // console.log(n);
  // let o = await prakash.userData.myDetail.fromBase58("TXZDfnvxwy6CCdZygWnhunK2XSjokuBHCX");
  // console.log(o);
  // let p = await prakash.userData.myDetail.fromPlayerIndex("78");
  // console.log(p);
  // let q = await prakash.totalUserCount();
  // console.log(q);
  //  let r = await prakash.allUser.blankCheckSum();
  //  console.log(r);
  // let s = await prakash.allUser.blankName();
  // console.log(s);
  // let t = await prakash.allUser.topPlayer();
  // console.log(t);
  // let u = await prakash.allUser.queryUser();
  // console.log(u);
  // let v = await prakash.updateDB.newUser("124","TP1uPb3cVau52DNicAvQU9fgm73iPh4tXC","0x8f1c2e82332821ce8b0c389f4033d05475ee5aec", "noname");
  // console.error(v);
}
test();

/***************/
