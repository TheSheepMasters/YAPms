<?php
session_start();

if(!isset($_SESSION['id']) || !isset($_SESSION['email'])) {
        echo 'bad no_login';
        die();
}

$userID = $_SESSION['id'];
$userID_36 = base_convert($userID, 10, 36);

$dir = "../../www-data/users/{$userID_36}";

$files = glob("{$dir}/*.txt.gz", GLOB_BRACE);

$res = "";

foreach($files as $file) {
        $res .= $file . ' ';
}

$res = rtrim($res, ' ');

echo $res;
?>
