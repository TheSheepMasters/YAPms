<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
require "vendor/autoload.php";

function sendReset($email, $token) {

	$config = json_decode(file_get_contents("../../../../external/config.json"), true);

	$mail = new PHPMailer(true);
	$subject = "YAPms Forgot Password";
	$message = 
	"<html>
		<body>
			<h1>YAPms Password Reset</h1>
			<p>
				If you did not request a password reset, you can ignore this message.
			</p>
			<h3>Password Reset Link</h3>
			<p>
				https://www.yapms.com/app/api/users/reset_password.php?email={$email}&token={$token}
			</p>
			<p>
				After clicking this link, you'll receive an email with your new temporary password.
			</p>
		</body>
	</html>";
	$altmessage = 
	"YAPms Password Reset
	If you did not request a password reset, you can ignore this message.
	
	Password Reset Link:
				https://www.yapms.com/app/api/users/reset_password.php?email={$email}&token={$token}";

	$mail->SMTPDebug = SMTP::DEBUG_SERVER;
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
}

if(isset($_POST["email"])) {
	$email = $_POST["email"];

	$dbh = new PDO("mysql:host=localhost;dbname=yapms", "yapms");
	$dbh->beginTransaction();

	$stmt = $dbh->prepare("SELECT active, tokentime FROM client WHERE email = ?");
	$stmt->execute([$email]);
	$data = $stmt->fetchAll();
	$exists = count($data) > 0;

	if($exists) {
		$active = $data[0]["active"];
		$diff = time() - $data[0]["tokentime"];

		// If account isn't active, then do not reset
		if($active === 0) {
			$dbh->commit();
			$dbh = null;
			die("bad innactive_account");
		} else if($diff < 1800) {
			$dbh->commit();
			$dbh = null;
			die("bad recent_verification");
		}

		$token = bin2hex(openssl_random_pseudo_bytes(16));
		$stmt = $dbh->prepare("UPDATE client SET token = ?, tokentime = now() WHERE email = ?");
		$stmt->execute([password_hash($token, PASSWORD_DEFAULT), $email]);
		$dbh->commit();
		$dbh = null;

		sendReset($email, $token);
		echo "good reset_sent";
	} else {
		$dbh->commit();
		$dbh = null;
		die("bad please_register");
	}
} else {
	die("bad");
}
?>
