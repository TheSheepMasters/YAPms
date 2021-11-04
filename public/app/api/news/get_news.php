<?php
$dbh = new PDO("mysql:host=localhost;dbname=yapms", "yapms");;
$sql = "SELECT id, title, author, snippet, source FROM article ORDER BY published DESC LIMIT 10 OFFSET 0";
$statement = $dbh->prepare($sql);;
$statement->execute();
$data = $statement->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($data);
?>
