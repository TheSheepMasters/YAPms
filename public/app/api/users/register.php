<?php
ini_set("display_errors", 1);
ini_set("display_startup_errors", 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
require "vendor/autoload.php";

function sendVerification($email, $password, $token) {
	
	$config = json_decode(file_get_contents("../../../../external/config.json"), true);

	$mail = new PHPMailer(true);
	$subject = "YAPms Account Verification";
	$message =
	"<html>
		<body>
			<h1>YAPms Account Verification</h1>
			<p>
				Thank you for create an account on YAPms
			</p>
			<h3>Password</h3>
			<p>
				{$password}
			</p>
			<h3>Verify Link</h3>
			<p>
				<a href='https://www.yapms.online/app/api/users/verify.php?email={$email}&token={$token}'>
					Click this link to verify your account
				</a>
			</p>
		</body>	
	</html>";
	$altmessage =
	"YAPms Account Verification
	Thank you for creating an account on YAPms
	
	Password: {$password}
	
	Verify Link: https://www.yapms.online/app/api/users/verify.php?email={$email}&token={$token}";

	//$mail->SMTPDebug = SMTP::DEBUG_SERVER;
	$mail->isSMTP();
	$mail->Host       = "smtp.ionos.com";
	$mail->SMTPAuth   = true;
	$mail->Username   = "admin@yapms.com";
	$mail->Password   = $config["smtp_password"];
	$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
	$mail->Port       = 465;

	$mail->setFrom("noreply@yapms.com", "YAPms");
	$mail->addAddress($email, "User");

	$mail->isHTML(true);                                  //Set email format to HTML
	$mail->Subject = $subject;
	$mail->Body    = $message;
	$mail->AltBody = $altmessage;

	$mail->send();
}

if(isset($_POST["email"]) === false) {
	echo "bad no_email";
	die();
}

$email = $_POST["email"];

if(filter_var($email,  FILTER_VALIDATE_EMAIL) === false) {
	echo "bad regex";
	die();
}

$token = bin2hex(openssl_random_pseudo_bytes(16));
$password = bin2hex(openssl_random_pseudo_bytes(8));

$dbh = new PDO("mysql:host=localhost;dbname=yapms", "yapms");
$dbh->beginTransaction();

$stmt = $dbh->prepare("SELECT password, token, UNIX_TIMESTAMP(tokentime) AS tokentime, active FROM client WHERE email = ?");
$stmt->execute([$email]);
$res = $stmt->fetchAll();
$accountExists = count($res) > 0;

if($accountExists) {
	$isActive = $res[0]["active"];
	$diff = time() - $res[0]["tokentime"];

	if($isActive === "0" && $diff >= 1800) {
		$tokentime = time();
		$stmt = $dbh->prepare("UPDATE client SET password = ?, token = ?, tokentime = now() WHERE email = ? AND active = 0");
		$stmt->execute([
			password_hash($password, PASSWORD_DEFAULT),
			password_hash($token, PASSWORD_DEFAULT),
			$email
		]);
		sendVerification($email, $password, $token);
		echo "bad resent";
	} else if($isActive === "0" && $diff < 1) {
		echo "bad inactive";
	} else if($isActive === "1") {
		echo "bad inuse";
	}
} else {
	$stmt = $dbh->prepare("INSERT INTO client (email, password, token, tokentime) VALUES (?,?,?,now())");
	$res = $stmt->execute([
		$email, password_hash($password, PASSWORD_DEFAULT),
		password_hash($token, PASSWORD_DEFAULT)
	]);
	sendVerification($email, $password, $token);
	echo "good sent";
}

$dbh->commit();
$dbh = null;
?>
