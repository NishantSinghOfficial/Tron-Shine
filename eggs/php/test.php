<?php include("init.php"); ?>
<?php
$sql = "SELECT * FROM userlist ORDER BY cast(myWager as unsigned) DESC LIMIT 25";
query($sql);
 ?>
