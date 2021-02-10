<?php

/********** helper functions***********/


function clean($string){
	return htmlentities($string);
}

function redirect($location){

	return header ("Location: {$location}");
}

function set_message($message){
	if(!empty($message)){
	$_SESSION['message'] = $message;
	}else{
	$message = "";}
}

function display_message(){
	if(isset($_SESSION['message'])){
	echo $_SESSION['message'];
	//unset ($_SESSION['message']);
	}
}

function token_generator(){

$token = $_SESSION['token'] = md5(uniqid(mt_rand(), true));
return $token;

}

function token_chat(){

$token_chat = $_SESSION['token_chat'] = md5(uniqid(mt_rand(), true));
return $token_chat;

}


function validation_errors($error_message) {

$error_message = <<<DELIMITER

<div class="alert alert-danger alert-dismissible" role="alert">
  	<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  	<strong>Warning!</strong> $error_message
 </div>
DELIMITER;

return $error_message;

}


function validation_success($success_message) {

$success_message = <<<DELIMITER

<div class="alert alert-success alert-dismissible" role="alert">
  	<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  	<strong>Congratulations!</strong> $success_message
 </div>
DELIMITER;

return $success_message;

}
function address_exists($address) {

	$sql = "SELECT indexNum FROM userlist WHERE address = '$address'";

	$result = query($sql);

	if(row_count($result) >= 1 ) {

		return true;

	} else {


		return false;

	}

}
function visitor_exists($address) {

	$sql = "SELECT * FROM visitors WHERE address = '$address'";

	$result = query($sql);

	if(row_count($result) >= 1 ) {

		return true;

	} else {


		return false;

	}

}
function playerIndex_exists($index) {

	$sql = "SELECT indexNum FROM userlist WHERE playerIndex = '$index'";

	$result = query($sql);

	if(row_count($result) >= 1 ) {

		return true;

	} else {


		return false;

	}

}

function checksumAddr_exists($checkAddr) {

	$sql = "SELECT indexNum FROM userlist WHERE checkSumAddress = '$checkAddr'";

	$result = query($sql);

	if(row_count($result) >= 1 ) {

		return true;

	} else {


		return false;

	}

}
/*********main function start here***************/

function displayAddress(){
	$sql = "SELECT * FROM userlist";// WHERE playerIndex BETWEEN 0 AND 99
	$result = query($sql);
	$dbdata = array();

	//echo '';
	while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
			$dbdata[] = $row;
			//$user->b = $row['address'];



	}
	$myObj = json_encode($dbdata);
	echo $myObj;
}
function getTotalPlayerCount(){
	$sql = "SELECT * FROM userlist";
	$result = query($sql);
	$dbdata = row_count($result);
	echo $dbdata;
}
	////////insert new users//////////
function insertUser(){
	if($_SERVER['REQUEST_METHOD'] == "POST"){
		if(isset($_POST['address']) && isset($_POST['submitType'])&& isset($_POST['checkSumAddress'])&& isset($_POST['name']) && isset($_POST['index'])){
			if($_POST['submitType'] == "newUser"){
				$newUserAddress = clean($_POST['address']);
				$checkSumAddress = clean($_POST['checkSumAddress']);
				$name = clean($_POST['name']);
				$userIndex = clean($_POST['index']);
				if(strlen($newUserAddress) == 34){
					if (!address_exists($newUserAddress)) {
					$sql = "INSERT INTO userlist(playerIndex,address,myWon,myLost,myWager,myBets,name,checkSumAddress)";
					$sql.= " VALUES('$userIndex','$newUserAddress',0,0,0,0,'$name','$checkSumAddress')";
					$result = query($sql);
					echo "success submit";
				}else {
					echo "user exists";
				}
				}else {
					echo "invalid address";
				}

			}

		}
	}
}


// check if a user or not
function isUser(){
	if($_SERVER['REQUEST_METHOD'] == "GET"){
		if(isset($_GET['fromBase58']) && isset($_GET['submitType'])){
			if($_GET['submitType'] == "getUser"){
				$addr = clean($_GET['fromBase58']);
				if(strlen($addr) == 34){
					if (address_exists($addr)) {
						echo "true";
					}else {
						echo "false";
					}
				}else {
					echo "invalid address";
				}
			}else if($_GET['submitType'] == "getUser"){
				$addr = clean($_GET['fromChecksum']);
					if (checksumAddr_exists($addr)) {
						echo "true";
					}else {
						echo "false";
					}

			}else if($_GET['submitType'] == "getVisitor"){
				$addr = clean($_GET['fromBase58']);
				if(strlen($addr) == 34){
					if (visitor_exists($addr)) {
						echo "true";
					}else {
						echo "false";
					}
				}else {
					echo "invalid address";
				}
			}
		}
	}
}
// user detail
function getuser(){
	if($_SERVER['REQUEST_METHOD'] == "GET"){
		if(isset($_GET['address']) && isset($_GET['submitType'])){
			if($_GET['submitType'] == "getUser"){
				$addr = clean($_GET['address']);
				if(strlen($addr) == 34){
					if (address_exists($addr)) {
						$sql = "SELECT * FROM userlist WHERE address = '$addr'";
						$result = query($sql);
						$dbdata = array();
						while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
								$dbdata[] = $row;
						}
						$myObj = json_encode($dbdata);
						echo $myObj;
					}else {
						echo "not a user";
					}
				}else {
					echo "invalid address";
				}
			}
		}else if(isset($_GET['playerIndex']) && isset($_GET['submitType'])){
			if($_GET['submitType'] == "getUser"){
				$id = clean($_GET['playerIndex']);

					if (playerIndex_exists($id)) {
						$sql = "SELECT * FROM userlist WHERE playerIndex = '$id'";
						$result = query($sql);
						$dbdata = array();
						while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
								$dbdata[] = $row;
						}
						$myObj = json_encode($dbdata);
						echo $myObj;
					}else {
						echo "index doesn't exists";
					}
				}
			}else if(isset($_GET['checkSumAddress']) && isset($_GET['submitType'])){
				if($_GET['submitType'] == "getUser"){
					$checkSumAddr = clean($_GET['checkSumAddress']);

						if (checksumAddr_exists($checkSumAddr)) {
							$sql = "SELECT * FROM userlist WHERE checkSumAddress = '$checkSumAddr'";
							$result = query($sql);
							$dbdata = array();
							while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
									$dbdata[] = $row;
							}
							$myObj = json_encode($dbdata);
							echo $myObj;
						}else {
							echo "checksum doesn't exists";
						}
					}
				}
		}
	}

	function updateUserWager(){
		if($_SERVER['REQUEST_METHOD'] == "POST"){
			if(isset($_POST['submitType'])){
				if($_POST['submitType'] == "updateWager"){
					if (isset($_POST['address'])) {
						$addr = clean($_POST['address']);
						$wager = clean($_POST['myWager']);
						$sql = "UPDATE userlist SET myWager = '$wager' WHERE address = '$addr'";
						$result = query($sql);
						echo "wager updated";
					}else if(isset($_POST['checkSumAddress'])){
						$addr = clean($_POST['checkSumAddress']);
						$wager = clean($_POST['myWager']);
						$sql = "UPDATE userlist SET myWager = '$wager' WHERE checkSumAddress = '$addr'";
						$result = query($sql);
						echo "wager updated";
					}

				}
			}
		}
	}

	///top players
	function getTopPlayers(){
		$sql = "SELECT * FROM userlist ORDER BY cast(myWager as unsigned) DESC LIMIT 25";
		$result = query($sql);
		$dbdata = array();

		//echo '';
		while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
				$dbdata[] = $row;
				//$user->b = $row['address'];



		}
		$myObj = json_encode($dbdata);
		echo $myObj;
	}
	function getblankNameAddress(){
		$sql = "SELECT address FROM userlist WHERE name LIKE '' ";
		$result = query($sql);
		$dbdata = array();

		//echo '';
		while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
				$dbdata[] = $row;
				//$user->b = $row['address'];



		}
		$myObj = json_encode($dbdata);
		echo $myObj;
	}
	function getblankChecksumAddress(){
		$sql = "SELECT address FROM userlist WHERE checkSumAddress LIKE '' ";
		$result = query($sql);
		$dbdata = array();

		//echo '';
		while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
				$dbdata[] = $row;
				//$user->b = $row['address'];



		}
		$myObj = json_encode($dbdata);
		echo $myObj;
	}
	//add use name
	function updateUserName(){
		if($_SERVER['REQUEST_METHOD'] == "POST"){
		  if(isset($_POST['address']) && isset($_POST['submitType'])&& isset($_POST['username'])){
		    if($_POST['submitType'] == "updateName"){
		      $addr = clean($_POST['address']);
		      $name = clean($_POST['username']);
		      $sql = "UPDATE userlist SET name = '$name' WHERE address = '$addr'";
		      $result = query($sql);
		      echo "name updated";
		    }
		  }
		}
	}
	function updateChecksumAddr(){
		if($_SERVER['REQUEST_METHOD'] == "POST"){
		  if(isset($_POST['address']) && isset($_POST['submitType']) && isset($_POST['checksumAddr'])){
		    if($_POST['submitType'] == "updatedchecksum"){
		      $addr = clean($_POST['address']);
		      $addrInCheck = clean($_POST['checksumAddr']);
					if(strlen($addr) != 34){
						echo "invalid base58 address ".$addr;
					}else if(empty($addrInCheck)){
						echo "invalid checksum address ".$addrInCheck;
					}else{
						$sql = "UPDATE userlist SET checkSumAddress = '$addrInCheck' WHERE address = '$addr'";
			      $result = query($sql);
			      echo "check sum address  updated";
					}

		    }
		  }
		}
	}
	function updateUser(){
		if($_SERVER['REQUEST_METHOD'] == "POST"){
			if(isset($_POST['address']) && isset($_POST['submitType'])){
				if (isset($_POST['name'])) {
					// code...
				}
				if (isset($_POST['myWon'])) {
					// code...
				}
				if (isset($_POST['myLost'])) {
					// code...
				}
				if (isset($_POST['myWager'])) {
					// code...
				}
				if (isset($_POST['myChecksum'])) {
					// code...
				}
				if (isset($_POST['betCount'])) {
					// code...
				}
			}
		}
	}

	//////////insert vistor//////////////
	//check referral code////////////////

	function insertVisitors(){
		if($_SERVER['REQUEST_METHOD'] == "POST"){
			if(isset($_POST['address']) && isset($_POST['ref']) && isset($_POST['submitType'])){
				if (isset($_POST['submitType']) == "newVisitor") {
					$addr = clean($_POST['address']);
					$code = clean($_POST['ref']);
					//todo if ref not exists
					if (strlen($code) == 0) {
						$code = "admin";
					}
					if (isset($_POST['active'])) {
						$active = clean($_POST['active']);
					}else {
						$active = 0;
					}


					if (strlen($addr) == 34) {
						if (!visitor_exists($addr)) {
							$r = random_bytes(4);
							$create_referral_code ="S".bin2hex($r);
							$sql = "INSERT INTO visitors(address,myReferral,referralFrom,totalReceived,active)";
							$sql.= " VALUES('$addr','$create_referral_code','$code',0,'$active')";
							$result = query($sql);
				      echo $create_referral_code;
						}else {
							echo "already a visitor or user";
						}
					}else {
						echo "in valid address";
					}
				}

			}
		}

	}
	//////////////
	/////////INSERT BET REUSLT AND UPDATE
	function insertBetResult(){
		if($_SERVER['REQUEST_METHOD'] == "POST"){
			if(isset($_POST['submitType'])&& isset($_POST['checkSumAddress'])&& isset($_POST['betAmount']) && isset($_POST['paidVal'])){
				if($_POST['submitType'] == "newBet"){
					$payout = clean($_POST['paidVal']);
					$won = 0;
					$lost = 0;
					$checkSumAddress = clean($_POST['checkSumAddress']);
					$betAmount = clean($_POST['betAmount']);
					if($payout == 0){
						$lost = $betAmount;
					}else {
						$won = $payout - $betAmount;
					}
						if (checksumAddr_exists($checkSumAddress)) {
							$sql = "SELECT * FROM userlist WHERE checkSumAddress = '$checkSumAddress'";// WHERE playerIndex BETWEEN 0 AND 99
							$result = query($sql);
							while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
								$won = $won + $row['myWon'];
								$lost = $lost + $row['myLost'];
							}
							$sql2 = "UPDATE userlist SET myBets = myBets + 1,myWon = $won,myLost =$lost WHERE checkSumAddress = '$checkSumAddress'";
							$result = query($sql2);
							echo "success submit";
					}else {
						echo "not a user";
					}


				}

			}
		}
	}

	//////////////////
	function getVisitor(){
		$res = array();
		$count = array();
		$count2 = array();
		if($_SERVER['REQUEST_METHOD'] == "GET"){
			if(isset($_GET['submitType']) && isset($_GET['address'])){
				 if($_GET['submitType'] == "getVisitor"){
					 $addr = clean($_GET['address']);
					 $sql = "SELECT myReferral FROM visitors WHERE address ='$addr'";
					 $result = query($sql);
					 while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
						  $res[] =  $row;
							$ref = $row['myReferral'];
							if(!empty($ref)){
								$sql2 = "SELECT * FROM visitors WHERE referralFrom ='$ref'";
		 					 $result2 = query($sql2);
							 if (row_count($result2) > 0) {
								 //$count[] =row_count($result2);
								 $count[] = array("TotalCount"=>row_count($result2));
							 }else {
							 	$count[] = array("TotalCount"=>0);
							 }
							 $sql3 = "SELECT * FROM visitors WHERE referralFrom ='$ref' AND active = 1";
							$result3 = query($sql3);
							if (row_count($result3) > 0) {
								//$count[] =row_count($result2);
								$count2[] = array("TotalActiveCount"=>row_count($result3));

							}else {
								$count2[] = array("TotalActiveCount"=>0);
							}

							}
					 }
					 $res = array_merge($res,$count,$count2);
					 $myObj = json_encode($res);
					 echo $myObj;
				 }
			}
	}
}

function markActiveVisitor(){
	if($_SERVER['REQUEST_METHOD'] == "POST"){
		if(isset($_POST['submitType']) && isset($_POST['address'])){
			 if($_POST['submitType'] == "markActive"){
				 $addr = clean($_POST['address']);
				 if (visitor_exists($addr)) {
					 $sql = "UPDATE visitors SET active = 1 WHERE address = '$addr'";
 					$result = query($sql);
					echo "true";
				}else {
					echo "false";
				}
			 }
		 }
	 }
}


?>
