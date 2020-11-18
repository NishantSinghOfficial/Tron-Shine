var chattingApp = (function () {
const contractChatApi = 'https://api.trongrid.io/event/contract/'+chatContract+'?size=50&page=1';

	//////////Checksum~to~hex~offline//////////////////
	function checksumHex(checksum) {
		let res = checksum.substr(2);
		let hex = "41" + res;
		return hex;

	}

	function shortAddress(address) {
		let start = address.substring(0, 4);
		let end = address.substring(address.length - 4, address.length)
		let short = start + "..." + end;
		return short;
	}

	//send new message
	async function sendNewMsg() {

		let _newText = $(DOMStrings.textmsgBox).val();
		let chatCtrt = await tronWeb.contract().at(chatContract);
			//console.log('clicked');
			try {
				if(_newText.length == 0) throw 'empty Message';
				let msg = await chatCtrt.newMsg(_newText,0).send({
					feeLimit: 1000000,
					//shouldPollResponse: true
				});
				$(DOMStrings.textmsgBox).val('');

			}
			catch (err) {
				console.log(err);

			}finally{
				$(DOMStrings.textareaBtn).attr("disabled", false);
			}
			//let msg = await contract.

	}



	//////////fund all myBets
	const findAllMsg = async () =>{

			let allmsg = "";
			await thisTronWeb.getEventResult(chatContract, {
				eventName:'msgData',
				size: 100
				//onlyConfirmed: true
				//page: 2
			}).then(async data => {
				//console.log(data);
				execute(0);
				async function execute(_x){
					if(data.length > _x){
						let event = data[_x];
						let addr = event.result.from;
						let base = checksumHex(addr);
						base = await thisTronWeb.address.fromHex(base);
						let _nam = shortAddress(base);
	          await thisTronWeb.trx.getAccount(base).then(async res =>{

	            if(res.account_name){
	              _nam =  tronWeb.toAscii(res.account_name);

	            }
	          //  console.log(_nam);
	            });
						if (myDetails.myAddressInBase58 == base) {
							allmsg += '<div class="msg rightMsg"><p class="chat-name"> ' +
								_nam +
								'</p><p> ' +
								event.result.message +
								'</p></div>' ;
						}
						else {
							allmsg += '<div class="msg leftMsg"><p class="chat-name"> ' +
								_nam +
								'</p><p> ' +
								event.result.message +
								'</p></div>' ;
						}


						//console.log(_x);
						_x += 1;

						execute(_x);
					}else if (data.length == _x) {
						$(DOMStrings.chatBody).html(allmsg);
					}
				}


			});


	}

	async function watchNewMsg() {
		let newMsg = '';
		let contract = await thisTronWeb.contract().at(chatContract);
		let x = await contract.msgData().watch(async(err, res) => {

			if (res) {
				let addr = res.result.from;
				let base = checksumHex(addr);
				base = await thisTronWeb.address.fromHex(base);
				let _nam = shortAddress(base);
				await thisTronWeb.trx.getAccount(base).then(async res =>{

					if(res.account_name){
						_nam =  tronWeb.toAscii(res.account_name);

					}
					console.log(_nam);
					});
				//console.log(res);
				if (myDetails.myAddressInBase58 == base) {
					newMsg = '<div class="msg rightMsg"><p class="chat-name"> ' +
						_nam +
						'</p><p> ' +
						res.result.message +
						'</p></div>';
				}
				else {
					newMsg = '<div class="msg leftMsg"><p class="chat-name"> ' +
						_nam +
						'</p><p> ' +
						res.result.message +
						'</p></div>';
				}
				let _x =  $(DOMStrings.chatBody).html() ;
				_x = newMsg + _x;
				$(DOMStrings.chatBody).html(_x);
				newMsg = '';

			}
			else {
				console.log(err);
			}


		})
	}

	////////////////////////////////


	async function chatinitUi() {
		await findAllMsg();
		await watchNewMsg();
	}
	return {
		"chatinitUi": chatinitUi,
		"sendNewMsg": sendNewMsg
	}

})();

$(DOMStrings.textareaBtn).click(function(e){

	e.preventDefault();
	$(DOMStrings.textareaBtn).attr("disabled", true);
	chattingApp.sendNewMsg();
});
//block enter key in text area
$(DOMStrings.textmsgBox).keypress(async function (e) {


	if (e.keyCode == 13) {
		e.preventDefault();
    $(DOMStrings.textareaBtn).click();
		//$(this).val('');

	}
});

$(window).load(function(){
	//console.log('stage1');
 chattingApp.chatinitUi();
});
