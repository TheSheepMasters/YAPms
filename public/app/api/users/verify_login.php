<?php
session_start();

if(isset($_SESSION["id"]) && isset($_SESSION["email"])) {
	$userID_36 = base_convert($_SESSION["id"], 10, 36);
	echo "good {$_SESSION["email"]} {$userID_36}";	
} else {
	echo "bad {$_SESSION["email"]} {$_SESSION["id"]}";
	session_destroy();
}
?>
