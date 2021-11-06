<?php
session_start();
if(isset($_SESSION["id"]) === false || isset($_SESSION["email"]) === false) {
	session_destroy();
	die("bad no_login");
}

if(isset($_POST["current"]) && isset($_POST["new"]) && isset($_POST["verify"])) {
	if($_POST["new"] !== $_POST["verify"]) {
		die("bad verify_incorrect");
	}
	$currentPass = $_POST["current"];
	$newPass = $_POST["new"];
	$newHash = password_hash($newPass, PASSWORD_DEFAULT);

	$email = $_SESSION["email"];

	$dbh = new PDO("mysql:host=localhost;dbname=yapms", "yapms");
	$stmt = $dbh->prepare("SELECT id, email, password, active FROM client WHERE email = ?");
	$stmt->execute([$email]);
	$data = $stmt->fetchAll();
	$exists = count($data) > 0;

	if($exists) {
		$currentHash = $data[0]["password"];
		$active = $data[0]["active"];

		if($active === 0) {
			session_unset();
			session_destroy();
			echo "bad account_inactive";
		} else if(strlen($newPass) > 100) {
			echo "bad pass_to_long";
		} else if(password_verify($currentPass, $currentHash)) {
			$stmt = $dbh->prepare("UPDATE client SET password = ? WHERE email = ?");
			$stmt->execute([$newHash, $email]);
			echo "good password_set";
		} else {
			echo "bad incorrect_pass";
		}
	} else {
		echo "bad no_account";
	}
} else {
	echo "bad no_post";
}
$dbh = null;
?>
