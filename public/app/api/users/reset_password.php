<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
require "vendor/autoload.php";

function sendPassword($email, $password) {

	$config = json_decode(file_get_contents("../../../../external/config.json"), true);

	$mail = new PHPMailer(true);
	$subject = "YAPms Auto Password";
	$message = 
	"<html>
		<body>
			<h1>YAPms Password Reset</h1>
			<p>
				Here is your temporary new password.
			</p>
			<h3>Password</h3>
			<p>
				{$password}
			</p>
		</body>
	</html>";
	$altmessage = 
	"YAPms Password Reset
	Here is your temporary new password.
	Password: {$password}";

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

	$mail->isHTML(true);
	$mail->Subject = $subject;
	$mail->Body    = $message;
	$mail->AltBody = $altmessage;

	$mail->send();

	echo "New Password Emailed";
}

if(isset($_GET["email"]) === false || isset($_GET["token"]) === false) {
	die("bad no_data");
}

$email = $_GET["email"];
$token = $_GET["token"];

$dbh = new PDO("mysql:host=localhost;dbname=yapms", "yapms");
$dbh->beginTransaction();

$stmt = $dbh->prepare("SELECT email, token, UNIX_TIMESTAMP(tokentime) AS tokentime, active FROM client WHERE email = ? AND active = 1");
$stmt->execute([$email]);
$data = $stmt->fetchAll();
$exists = count($data) > 0;

if($exists) {
	$tokenHash = $data[0]["token"];
	$diff = time() - $data[0]["tokentime"];
	if($diff > 600) {
		$dbh = null;
		die("token expired");
	} else if(password_verify($token, $tokenHash)) {
		$password = bin2hex(openssl_random_pseudo_bytes(random_int(8, 10)));
		$password_hash = password_hash($password, PASSWORD_DEFAULT);
		$stmt = $dbh->prepare("UPDATE client SET password = ?, tokentime = 0 WHERE email = ? AND active = 1");
		$stmt->execute([password_hash($password, PASSWORD_DEFAULT), $email]);
		sendPassword($email, $password);
	}
}

$dbh->commit();
?>
