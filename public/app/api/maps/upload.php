<?php
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
