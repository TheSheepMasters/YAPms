<?php
if(isset($_GET["email"]) && isset($_GET["token"])) {
	$email = $_GET["email"];
	$token = $_GET["token"];

	$dbh = new PDO("mysql:host=localhost;dbname=yapms", "yapms");
	$stmt = $dbh->prepare("SELECT email, token, UNIX_TIMESTAMP(tokentime) AS tokentime, active FROM client WHERE email = ? AND active = 0");
	$stmt->execute([$email]);
	$data = $stmt->fetchAll();
	$exists = count($data) > 0;

	if($exists) {
		$tokenHash = $data[0]["token"];
		$diff = time() - $data[0]["tokentime"];
		if($diff > 1800) {
			$dbh = null;
			$msg = "verification_expired";
		} else if(password_verify($token, $tokenHash)) {
			$stmt = $dbh->prepare("UPDATE client SET active = 1 WHERE email = ? AND active = 0");
			$stmt->execute([$email]);
			$dbh = null;
			$msg = "account_verified";
		}
	} else {
		$msg = "Verification Failed";
	}
}

echo $msg;
?>
