<?php
//require_once 'headers.php';

$postData= file_get_contents('php://input');

if(isset($postData)){
	$userData = json_decode($postData);
	$operation = $userData->operation;
	$getter = new postGetter();
	if($operation === "get all posts"){
		$postposition = $userData->postnumber;
		$sql = "SELECT Post.comment AS description, Post.date, Post.Name, Post.idPost, Post.lat, Post.lng, Post.type, Post.isPrivate, Users.username, Users.idUsers AS 'idUser' FROM Post JOIN Users WHERE Post.Users_idUsers=Users.idUsers LIMIT ".$postposition.", 4";
	echo $getter->getAllPosts($sql, $userData->currentUser);
	}
	else if($operation === "get user public posts"){
		$postposition = $userData->json->postnumber;
		$currentUser = $userData->json->currentUser;
		$sql = "SELECT Post.comment AS description, Post.date, Post.Name, Post.idPost, Post.lat, Post.lng, Post.type, Post.isPrivate, Users.username, Users.idUsers AS 'idUser' FROM Post JOIN Users WHERE Post.isPrivate=0 AND Post.Users_idUsers=Users.idUsers AND Users.username='".$userData->json->username."' LIMIT ".$postposition.", 4";
		$getter = new postGetter();
	echo $getter->getUserPosts($sql, $operation, $currentUser);
	}
	else if($operation === "get user private posts"){
		$postposition = $userData->json->postnumber;
		$currentUser = $userData->json->currentUser;
		$sql = "SELECT Post.comment AS description, Post.date, Post.Name, Post.idPost, Post.lat, Post.lng, Post.type, Post.isPrivate, Users.username, Users.idUsers AS 'idUser' FROM Post JOIN Users WHERE Post.isPrivate=1 AND Post.Users_idUsers=Users.idUsers AND Users.username='".$userData->json->username."' LIMIT ".$postposition.", 4";
		$getter = new postGetter();
	echo $getter->getUserPosts($sql, $operation, $currentUser);
	}
	else if($operation === "get one post"){
		$sql = "SELECT Post.comment AS description, Post.date, Post.Name, Post.idPost, Post.lat, Post.lng, Post.type, Post.isPrivate, Users.username, Users.idUsers AS 'idUser' FROM Post JOIN Users WHERE Post.Users_idUsers=Users.idUsers AND Post.idPost=".$userData->postID."";
		$getter = new postGetter();
		echo $getter->getOnePost($sql);
	}
	else if($operation === "get comments"){
		$getComments = "SELECT	Comments.Content AS 'content',
							Users.avatar AS 'userAvatar', 
							Users.username AS 'author',
							Users.rating AS 'userRating', 
							Comments.date,
							Comments.rating 
						FROM Comments JOIN Users JOIN Post 
						WHERE Comments.Post_idPost=Post.idPost 
						AND Comments.Users_idUsers=Users.idUsers 
						AND Post.idPost='".$userData->postID."'";
		$getter = new postGetter;
		echo $getter->getComments($getComments);
	}
	else echo '{"operation":"'.$operation.'","result":"Invalid Operation"}';
	
}
else echo '{"operation":"post getter","result":"I don\'t see anything"}';


class postGetter{
	function getAllPosts($sql, $currentUser){
		include 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
		if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
		} 
		$result = $conn->query($sql);
		if ($result->num_rows >0) {
			while($row = $result->fetch_assoc()) {
				$row["position"]["lat"]= (float)$row["lat"];
				$row["position"]["lng"]= (float)$row["lng"];
				unset($row["lat"]);
				unset($row["lng"]);
				$row["postRating"] = (int)$row["postRating"];
				$row["idPost"] = (int)$row["idPost"];
				$row["type"] = (int)$row["type"];
				$row["isPrivate"]= (int)$row["isPrivate"];
				$row["idUser"] = (int)$row["idUser"];
				$getPhotoes = "SELECT fileName AS 'name' FROM Photoes JOIN Post 
						WHERE Post.idPost=Photoes.Post_idPost 
						AND Post.idPost='".$row['idPost']."'";

				$getLikes = "SELECT userId FROM Post_has_Rate JOIN Post 
						WHERE Post.idPost=Post_has_Rate.postId
						AND Post_has_Rate.rating=1 
						AND Post_has_Rate.postId='".$row['idPost']."'";

				$getDislikes = "SELECT userId FROM Post_has_Rate JOIN Post 
						WHERE Post.idPost=Post_has_Rate.postId
						AND Post_has_Rate.rating=-1 
						AND Post_has_Rate.postId='".$row['idPost']."'";
				
				$getPostLikes = $conn->query($getLikes);
				$getPostDislikes = $conn->query($getDislikes);
				$row["rating"]["likes"] = (int)$getPostLikes->num_rows;
				$row["rating"]["dislikes"] = (int)$getPostDislikes->num_rows;
				$row["rating"]["isLikedByMe"] = false;
				$row["rating"]["isDislikedByMe"] = false;
				
				if ($getPostLikes->num_rows>0) {
					while($like = $getPostLikes->fetch_assoc()) {
						if((int)$like['userId']===$currentUser) $row["rating"]["isLikedByMe"]=true;
					}
				}
				if ($getPostDislikes->num_rows>0) {
					while($dislike = $getPostDislikes->fetch_assoc()) {
						if((int)$dislike['userId']===$currentUser) $row["rating"]["isDislikedByMe"]=true;
					}
				}
				
				$resPhotoes = $conn->query($getPhotoes);
				if ($resPhotoes->num_rows >0) {
					$directory = "/srv/windows/dyploma/Photoes/".$row['idPost'].'/';
					while($photo = $resPhotoes->fetch_assoc()) {
						$contents = file_get_contents($directory.$photo['name']);
						$base64 = base64_encode($contents);
						$data['name'] = $photo['name'];
						$data['blob'] = "data:image/jpeg;base64,".$base64;
						$row["photoes"][] = $data;
					}
				}
			$json[] = $row;
			}
		} else {
		 	$json = "No Results Found.";
		}
		echo '{"operation":"get all posts","result":'.json_encode($json).'}';
		$conn->close();
	}
	function getUserPosts($sql, $operation, $currentUser){
		include 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
		if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
		} 
		$result = $conn->query($sql);
		if ($result->num_rows >0) {
			while($row = $result->fetch_assoc()) {
				$row["position"]["lat"]= (float)$row["lat"];
				$row["position"]["lng"]= (float)$row["lng"];
				unset($row["lat"]);
				unset($row["lng"]);
				$row["postRating"] = (int)$row["postRating"];
				$row["idPost"] = (int)$row["idPost"];
				$row["type"] = (int)$row["type"];
				$row["isPrivate"]= (int)$row["isPrivate"];
				$row["idUser"] = (int)$row["idUser"];
				$getPhotoes = "SELECT fileName AS 'name' FROM Photoes JOIN Post 
						WHERE Post.idPost=Photoes.Post_idPost 
						AND Post.idPost='".$row['idPost']."'";
				
				$getLikes = "SELECT userId FROM Post_has_Rate JOIN Post 
						WHERE Post.idPost=Post_has_Rate.postId
						AND Post_has_Rate.rating=1 
						AND Post_has_Rate.postId='".$row['idPost']."'";

				$getDislikes = "SELECT userId FROM Post_has_Rate JOIN Post 
						WHERE Post.idPost=Post_has_Rate.postId
						AND Post_has_Rate.rating=-1 
						AND Post_has_Rate.postId='".$row['idPost']."'";
				
				$getPostLikes = $conn->query($getLikes);
				$getPostDislikes = $conn->query($getDislikes);
				$row["rating"]["likes"] = (int)$getPostLikes->num_rows;
				$row["rating"]["dislikes"] = (int)$getPostDislikes->num_rows;
				$row["rating"]["isLikedByMe"] = false;
				$row["rating"]["isDislikedByMe"] = false;
				
				if ($getPostLikes->num_rows>0) {
					while($like = $getPostLikes->fetch_assoc()) {
						if((int)$like['userId']===$currentUser) $row["rating"]["isLikedByMe"]=true;
					}
				}
				if ($getPostDislikes->num_rows>0) {
					while($dislike = $getPostDislikes->fetch_assoc()) {
						if((int)$dislike['userId']===$currentUser) $row["rating"]["isDislikedByMe"]=true;
					}
				}
				
				$resPhotoes = $conn->query($getPhotoes);
				if ($resPhotoes->num_rows >0) {
					$directory = "/srv/windows/dyploma/Photoes/".$row['idPost'].'/';
					while($photo = $resPhotoes->fetch_assoc()) {
						$contents = file_get_contents($directory.$photo['name']);
						$base64 = base64_encode($contents);
						$data['name'] = $photo['name'];
						$data['blob'] = "data:image/jpeg;base64,".$base64;
						$row["photoes"][] = $data;
					}
				}
			$json[] = $row;
			}
		} else {
		 	$json = "No Results Found.";
		}
		echo '{"operation":"'.$operation.'", "result":'.json_encode($json).'}';
		$conn->close();
	}
	function getOnePost($sql){
		include 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
		if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
		} 
		$result = $conn->query($sql);
		if ($result->num_rows >0) {
			while($row = $result->fetch_assoc()) {
				$row["position"]["lat"]= (float)$row["lat"];
				$row["position"]["lng"]= (float)$row["lng"];
				unset($row["lat"]);
				unset($row["lng"]);
				$row["postRating"] = (int)$row["postRating"];
				$row["idPost"] = (int)$row["idPost"];
				$row["type"] = (int)$row["type"];
				$row["isPrivate"]= (int)$row["isPrivate"];
				$row["idUser"] = (int)$row["idUser"];
				$getPhotoes = "SELECT fileName AS 'name' FROM Photoes JOIN Post 
						WHERE Post.idPost=Photoes.Post_idPost 
						AND Post.idPost='".$row['idPost']."'";

				$getLikes = "SELECT userId FROM Post_has_Rate JOIN Post 
						WHERE Post.idPost=Post_has_Rate.postId
						AND Post_has_Rate.rating=1 
						AND Post_has_Rate.postId='".$row['idPost']."'";

				$getDislikes = "SELECT userId FROM Post_has_Rate JOIN Post 
						WHERE Post.idPost=Post_has_Rate.postId
						AND Post_has_Rate.rating=-1 
						AND Post_has_Rate.postId='".$row['idPost']."'";
				
				$getPostLikes = $conn->query($getLikes);
				$getPostDislikes = $conn->query($getDislikes);
				$row["rating"]["likes"] = (int)$getPostLikes->num_rows;
				$row["rating"]["dislikes"] = (int)$getPostDislikes->num_rows;
				$row["rating"]["isLikedByMe"] = false;
				$row["rating"]["isDislikedByMe"] = false;
				
				if ($getPostLikes->num_rows>0) {
					while($like = $getPostLikes->fetch_assoc()) {
						if((int)$like['userId']===$currentUser) $row["rating"]["isLikedByMe"]=true;
					}
				}
				if ($getPostDislikes->num_rows>0) {
					while($dislike = $getPostDislikes->fetch_assoc()) {
						if((int)$dislike['userId']===$currentUser) $row["rating"]["isDislikedByMe"]=true;
					}
				}

				$resPhotoes = $conn->query($getPhotoes);
				if ($resPhotoes->num_rows >0) {
					$directory = "/srv/windows/dyploma/Photoes/".$row['idPost'].'/';
					while($photo = $resPhotoes->fetch_assoc()) {
						$contents = file_get_contents($directory.$photo['name']);
						$base64 = base64_encode($contents);
						$data['name'] = $photo['name'];
						$data['blob'] = "data:image/jpeg;base64,".$base64;
						$row["photoes"][] = $data;
					}
				}
			$json = $row;
			}
		} else {
		 	$json = '"new"';
		}
		echo '{"operation":"get one post","result":'.json_encode($json).'}';
		$conn->close();
	}
	function getComments($sql){
		include 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
		if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
		} 
		$resComments = $conn->query($sql);
		if ($resComments->num_rows >0) {
			while($comment = $resComments->fetch_assoc()) {
				$comment["userRating"] = (int)$comment["userRating"];
				$comment["rating"] = (int)$comment["rating"];
				$row["comments"][] = $comment;
			$json[] = $comment;
			}
		}
		else {
			$json = "No Results Found.";
		}
		echo '{"operation":"get comments","result":'.json_encode($json).'}';
	}
}

?>
