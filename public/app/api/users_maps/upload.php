<?php
session_start();

if(!isset($_SESSION['id']) || !isset($_SESSION['email'])) {
        echo 'bad no_login';
        die();
}

if(isset($_POST['data']) === false ||
        is_null($_POST['data'])) {
        echo 'bad no_data';
        die();
}

if(isset($_POST['mapName']) === false ||
        is_null($_POST['mapName']) ||
        empty($_POST['mapName'])) {
        echo 'bad no_map_name';
        die();
}

if(strlen($_POST['mapName']) > 30) {
        echo 'bad long_name';
        die();
}

if(isset($_POST['img']) === false ||
        is_null($_POST['img'])) {
        echo 'bad no_image';
        die();
}

$mapName = $_POST["mapName"];
$mapName = base64_encode($mapName);

$userID = $_SESSION["id"];
$userID_36 = base_convert($userID, 10, 36);

$dir = "../../www-data/users/{$userID_36}";
mkdir($dir);

$files = glob("{$dir}/*", GLOB_BRACE);
if($files) {
        if(count($files) >= 100) {
                echo "bad file_limit";
                die();
        }
}

$imgData = $_POST["img"];
$imgData = str_replace(" ", "+", $imgData);
$imgData = substr($imgData, strpos($imgData, ",") + 1);
$imgData = base64_decode($imgData);

$file = fopen("../../www-data/users/{$userID_36}/{$mapName}.png", "w");
if($file) {
        fwrite($file, $imgData);
        fclose($file);
        shell_exec("pngquant -f --ext .png --quality=0-70 -s1 ../../www-data/users/{$userID}/{$mapName}.png > /dev/null 2>/dev/null &");
}

$file = gzopen("../../www-data/users/{$userID_36}/{$mapName}.txt.gz", "w");
if($file) {
        gzwrite($file, $_POST["data"]);
        gzclose($file);

        //echo "https://yapms.org/users/{$userID_36}/{$mapName}.txt.gz";
        echo "good {$mapName}";
} else {
        echo "bad failed_write";
}
?>
