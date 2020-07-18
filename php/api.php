<?
$domain =$_SERVER['HTTP_HOST'];
$domain1 = $_SERVER['SERVER_NAME'];
echo  $domain.'<br>';
echo $domain1.'<br>';
$a = $_SERVER['DOCUMENT_ROOT'];
echo $a.'<br>';
$b = $_SERVER['REQUEST_URI'];
echo $b.'<br>';
?>
