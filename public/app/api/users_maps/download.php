<?php
$map = basename($_GET['m']);
$mapName = base64_decode($map);
$user = basename($_GET['u']);
header("Content-type: application/octet-stream");
header("Content-disposition: attachment; filename={$mapName}.yapms");
header("Expired: 0");
header("Cache-Control: must-revalidate");
header("Pragma: public");
//header("Content-Lenth: " . filesize("./temp/{$user}{$map}.yapms"));
readgzfile("../../www-data/users/{$user}/{$map}.txt.gz");
?>
