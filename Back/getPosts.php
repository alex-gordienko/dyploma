<?php
//require_once 'headers.php';

include 'DBconfig.php';
 
// Create connection
$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
 
if ($conn->connect_error) {
 
 die("Connection failed: " . $conn->connect_error);
} 
 
$sql = "SELECT comment, date, Name, idPost, lat, lng, rating, type, username FROM Post JOIN Users WHERE Post.Users_idUsers=Users.idUsers";
 
$result = $conn->query($sql);
 
if ($result->num_rows >0) {
	while($row = $result->fetch_assoc()) {
		$getPhotoes = "SELECT fileName AS 'name', Content AS 'blob' FROM Photoes JOIN Post 
				WHERE Post.idPost=Photoes.Post_idPost 
				AND Post.idPost='".$row['idPost']."'";
		$res = $conn->query($getPhotoes);
		while($photo = $res->fetch_assoc()) {
			$row["photoes"][] = $photo;
		}
	$json[] = $row;
	}
} else {
 	$json = "No Results Found.";
}
 echo json_encode($json);
$conn->close();
?>
