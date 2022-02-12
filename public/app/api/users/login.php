<?php
session_start();

if(isset($_POST["email"]) && isset($_POST["password"])) {
	$email = $_POST["email"];
	$password = $_POST["password"];

	$dbh = new PDO("mysql:host=localhost;dbname=yapms", "yapms");
	$stmt = $dbh->prepare("SELECT id, email, password, active FROM client WHERE email = ?");
	$stmt->execute([$email]);
	$data = $stmt->fetchAll();
	$exists = count($data) > 0;

	if($exists) {
		$hashPassword = $data[0]["password"];
		$id = $data[0]["id"];
		$active = $data[0]["active"];
		if($active === 0) {
			session_destroy();
			echo "bad account_inactive";
		} else if(password_verify($password, $hashPassword)) {
			$_SESSION["email"] = $email;
			$_SESSION["id"] = $id;
			session_write_close();
			$userID_36 = base_convert($_SESSION["id"], 10, 36);
			echo "good {$_SESSION["email"]} {$userID_36}";
		} else {
			session_destroy();
			echo "bad incorrect_login {$email}" //{$password} {$hashPassword}";
		}
	} else {
		session_destroy();
		echo "bad inccorrect_login 2";
	}
	$dbh = null;
} else {
	session_destroy();
}
?>
