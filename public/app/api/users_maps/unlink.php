<?php
session_start();

if(!isset($_SESSION['id']) || !isset($_SESSION['email'])) {
        echo 'bad no_login';
        die();
}

if(!isset($_POST['mapName'])) {
        echo 'bad no_map';
        die();
}

$map = $_POST['mapName'];
$userID = $_SESSION['id'];
$userID_36 = base_convert($userID, 10, 36);

$file = "../../www-data/users/{$userID_36}/{$map}.txt.gz";
$img = "../../www-data/users/{$userID_36}/{$map}.png";

if(unlink($file) && unlink($img)) {
        echo 'good';
} else {
        echo "bad unlink_failed {$file}";
}
?>
~         
