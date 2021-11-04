<?php
function scrape($preTitle, $url, $db) {

	$content = file_get_contents($url);
	if(!$content) {
		return;
	}

	$xml = new SimpleXMLElement($content);

	echo "<ul>";
	foreach($xml->channel->item as $entry) {
		$title = $preTitle . $entry->title;

		$sql = "SELECT title FROM article WHERE title = ?";
		$stmt = $db->prepare($sql);
		$stmt->execute([$title]);
		if($stmt->rowCount() !== 0) {
			echo "skipped upload -- {$title}<br>";
			continue;
		}
		
		echo "<li><a href='" . $entry->link . ' title=' . $entry->title . '>'. $entry->title . '</a></li>' . $entry->description . '<br>';

		$source = $entry->link;
		$author = "Congress";
		$published = date('Y-m-d', strtotime($xml->channel->pubDate));
		$snippet = $entry->description;
		
		$sql = "INSERT INTO article (source, title, author, published, snippet) VALUES (?,?,?,?,?)";
		$stmt = $db->prepare($sql);

		if($stmt->execute([$source, $title, $author, $published, $snippet])) {
			echo "executed upload -- {$title}<br>";
		} else {
			echo "failed upload -- {$tilte}<br>";
		}
	}
	echo "</ul><br>";
}

$db = new PDO("mysql:host=localhost;dbname=yapms", "yapms");

scrape("Presidential Signature: ", "https://www.congress.gov/rss/presented-to-president.xml", $db);
scrape("House Floor: ", "https://www.congress.gov/rss/house-floor-today.xml", $db);
scrape("Senate Floor: ", "https://www.congress.gov/rss/senate-floor-today.xml", $db);
scrape("", "https://www.congress.gov/rss/most-viewed-bills.xml", $db);
?>
