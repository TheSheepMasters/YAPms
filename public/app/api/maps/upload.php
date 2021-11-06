<?php

$config = json_decode(file_get_contents("../../../../external/config.json"), true);
$secret = $config["recaptcha_secret"];
$response = $_POST["captcha"];
$verify = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secret}&response={$response}");
$isVerified = json_decode($verify);

if($isVerified->success === false) {
	echo "reCaptcha_Failed(restart_web_browser)";
	die();
}

if($isVerified->score < 0.5) {
	echo "reCaptcha_Bot_Detected";
	die();
}

$mapnumber = 0;

$sql_select = "SELECT * FROM mapcount";
$sql_update = "UPDATE mapcount SET value = CASE WHEN (value < 1000000) THEN (value + 1) ELSE 0 END";
$dbh = new PDO("mysql:host=localhost;dbname=yapms", "yapms");
$dbh->beginTransaction();
$res_select = $dbh->query($sql_select);
$res_update = $dbh->exec($sql_update);
$dbh->commit();
$dbh = null;

foreach($res_select as $row) {
	$mapnumber = $row[0];
}

$filename = base_convert($mapnumber, 10, 36);

$imgData = $_POST["img"];
$imgData = str_replace(" ", "+", $imgData);
$imgData = substr($imgData, strpos($imgData, ",") + 1);
$imgData = base64_decode($imgData);

$file = fopen("../../www-data/maps/{$filename}.png", "w");
if($file) {
	fwrite($file, $imgData);
	fclose($file);
} else {
	die();
}

shell_exec("pngquant -f --ext .png --quality=0-70 -s1 ../../www-data/maps/{$filename}.png > /dev/null 2>/dev/null &");

$file = gzopen("../../www-data/maps/{$filename}.txt.gz", "w9");
if($file) {
	gzwrite($file, $_POST["data"]);
	gzclose($file);
	echo "https://www.yapms.com/app/?m={$filename} {$filename}";
} else {
	die();
}
?>
