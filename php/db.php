<?php
//$con = mysqli_connect('localhost', 'root', '', 'userDB');


$con = mysqli_connect('localhost', 'u969387606_tronshine', 'tronshine@dep', 'u969387606_userDB');


function row_count($result){


return mysqli_num_rows($result);

}



function escape($string) {
	global $con;

	return mysqli_real_escape_string($con, $string);


}

function confirm($result) {

	global $con;

	if(!$result) {

		die("QUERY FAILED" . mysqli_error($con));

	}

}



function query($query) {

	global $con;

	$result =  mysqli_query($con, $query);

	confirm($result);

	return $result;


}





function fetch_array($result) {

	global $con;


	return mysqli_fetch_array($result);



}









 ?>
