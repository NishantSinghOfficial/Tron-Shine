
var adminFunc = (function(){
  function updateAllUserName(){
  fetch("./php/api/blankName.php")
  .then((resp) => resp.json())
  .then(res =>{
    //console.log(res);
    let _uint = 0
    getaddr();
    async function getaddr(){

      let _addr = res[_uint].address;
      //console.log(_addr);
      await tronWeb.trx.getAccount(_addr).then(async result =>{
        if(result.account_name){
        let  myname =  tronWeb.toAscii(result.account_name);
        //console.log(myname);
        $.ajax({
          url  : "./php/api/postapi/updatename.php",
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



      }else {
        console.log('no name available');
      }
      _uint +=1;
      if(res.length > _uint){
        getaddr();
      }

      })
    .catch(e =>{
      console.log(e);
      getaddr();
    });
    }
  });
  }

  /////////////
  function checksumUpdate(){
    fetch("./php/main.php")
    .then((resp) => resp.json())
    .then(res =>{
      console.log(res);
      let _uint = 0
      getaddr();
      function getaddr(){

        let addr = res[_uint].address;
        console.log(addr);
        let addrCheck = hexChecksum(tronWeb.address.toHex(addr));

          console.log(addrCheck);
          $.ajax({
            url  : "./php/api/postapi/updateChecksumAddr.php",
            type : "POST",
            data : {
                    checksumAddr: addrCheck,
                    address   : addr,
                    submitType:"updatechecksum"
                      },
          success:function(data)
                   {
             if($.trim(data) === "check sum address  updated")
                           {
                             _uint +=1;
                             if(res.length > _uint){
                               getaddr();
                             }
                   console.log("successfull");
                  console.log(data);
                              } else { console.log(data);}
                      },
           error: function(error)
                   {
            console.log("Error AJAX not working: "+ error );
                      }

       });


      }
    });

  }
  async function adminIn(){
    //updateAllUserName();
    //checksumUpdate();
  }
  return{
    "adminIn":adminIn
  }
})();
$(window).load(function(){
  //console.log('adminFunc.adminIn();');
  adminFunc.adminIn();
});
