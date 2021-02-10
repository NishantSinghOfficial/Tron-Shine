var rank = {
    totalplayer:0,
    totalFetched:0,
    totalSetinArray:0
}

var topPlayer = (function(){
  function shortAddress(address) {
    if(address != ''){
      let start = address.substring(0, 4);
      let end = address.substring(address.length - 4, address.length)
      let short = start + "..." + end;
      return short;
    }

  }
  const fetchAndDisTopPlayer = async() =>{
    let alltab = '';
    let _n = 1;
    let res = await prakash.allUser.topPlayer();
     //console.log(res)
      res.forEach((data) => {
        //console.log(data);
        let _addr = shortAddress(data.address);
        if(data.name != ''){
          _addr = data.name;
        }

        alltab += '<tr><td><span>'+ _n+
        '</span></td><td class="chopCellRank">'+ _addr+
        '</td><td>'+ data.myWager+
        '</td></tr>';
        _n += 1;
      });
      $('tbody.rankTable-body').html(alltab);

  }








const rankIn = async () =>{
}
return{
  "rankIn":rankIn,
  "fetchAndDisTopPlayer":fetchAndDisTopPlayer
}

})();
$(window).load(function(){
  topPlayer.fetchAndDisTopPlayer();
});
