<?php
//require_once 'headers.php';
//$redicet = $_SERVER['HTTP_REFERER'];

$postData= file_get_contents('php://input');

if(isset($postData)){
	$userData = json_decode($postData);
	$operation = $userData->operation;
	$content = $userData->json;
	$response = new userSearcher();
	if($operation === "Search User"){
		$currentUser=$content->currentUser;
		$searchedUser=$content->searchedUser;
		$response->getProfile($currentUser, $searchedUser);
	}
	else if($operation === "Search Peoples"){
		$response->searchPeople($content->username, $content->filters, $content->page);
	}
	else if($operation === "Search Friends"){
		$response->searchFriends($content->username, $content->filters, $content->page);
	}
	else if($operation === "Search Invites"){
		$response->searchInvites($content->username, $content->filters, $content->page);
	}
	else if($operation === "Search Blocked"){
		$response->searchBlocked($content->username, $content->filters, $content->page);
	}
	else echo '{"operation":"'.$operation.'","result":"Invalid Operation"}';
	
}
else echo '{"operation":"userSearcher","result":"I don\'t see anything"}';

class userSearcher{
	function searchPeople($username, $filters, $page){
		require_once 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
		if ($conn->connect_error) {
		 $result = "Connection failed: " . $conn->connect_error;
		}
		$sql = "SELECT idUsers,
				Country,
				City,
				isOnline,
				isBanned,
				isConfirm,
				lastOnline,  
				username, 
				FirstName, 
				LastName, 
				Birthday, 
				Status, 
				email, 
				phone, 
				rating, 
				avatar
			FROM Users WHERE";
		if($filters->username!==""){
			$sql.=" username LIKE '%".$filters->username."%'";	
		}
		if($filters->date!==""){
			$sql.=" Birthday='".$filters->date."'";	
		}
		if($filters->country!==""){
			$sql.=" Country='".$filters->country."'";
		}
		if($filters->city!==""){
			$sql.=" City='".$filters->city."'";
		}
		if($filters->username==="" && $filters->date==="" && $filters->country==="" && $filters->city==="") {
			$sql.=" 1";	
		}
		$sql.= " AND Users.idUsers NOT IN(
    				SELECT BlackList.black_two FROM Users JOIN BlackList 
				WHERE Users.idUsers=BlackList.black_one
    				AND BlackList.black_one=(SELECT idUsers from Users WHERE username='$username')
			) AND Users.idUsers NOT IN(
    				SELECT BlackList.black_one FROM Users JOIN BlackList 
				WHERE Users.idUsers=BlackList.black_two
    				AND BlackList.black_two=(SELECT idUsers from Users WHERE username='$username')
			) LIMIT $page,10";
		$res = $conn->query($sql);
		if ($res->num_rows >0) {
			while($row = $res->fetch_assoc()) {
			 	$row["idUsers"] = (int)$row["idUsers"];
				$row["rating"] = (int)$row["rating"];
				if($row["isConfirm"]==="1") $row["isConfirm"] = true; else $row["isConfirm"] = false;
				if($row["isBanned"]==="1") $row["isBanned"] = true; else $row["isBanned"] = false;
				if($row["isOnline"]==="1") $row["isOnline"] = true; else $row["isOnline"] = false;
				$result[] = $row;
			 }
		} else {
			$result = 'No Results Found';
		}
		$conn->close();

		echo '{"operation":"Search Peoples","result":'.json_encode($result).'}';
	}
	function getProfile($currentUser, $searchedUser){
		$result = "Empty";
		$isMyFriend = false;
		$isInBlackList = false;
		$isMySubscribition = false;
		require_once 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
		if ($conn->connect_error) {
		 $result = "Connection failed: " . $conn->connect_error;
		}
		$sql = "SELECT idUsers,
				isOnline,
				isBanned,
				isConfirm,
				lastOnline, 
				username,
				Country,
				City, 
				FirstName, 
				LastName, 
				Birthday, 
				Status, 
				email, 
				phone, 
				rating, 
				avatar
			FROM Users WHERE username='".$searchedUser."'";
		$res = $conn->query($sql);
		if($currentUser!==$searchedUser){
			$checkIsFriend = "SELECT idUsers				
				FROM Users WHERE Users.idUsers IN(
	    				SELECT FriendList.friend_two FROM Users JOIN FriendList 
					WHERE Users.idUsers=FriendList.friend_one
					AND status='good'
	    				AND FriendList.friend_one=(SELECT idUsers from Users WHERE username='$currentUser')
					AND FriendList.friend_two=(SELECT idUsers from Users WHERE username='$searchedUser')
				) OR Users.idUsers IN(
	    				SELECT FriendList.friend_one FROM Users JOIN FriendList 
					WHERE Users.idUsers=FriendList.friend_two
					AND status='good'
					AND FriendList.friend_one=(SELECT idUsers from Users WHERE username='$searchedUser')
	    				AND FriendList.friend_two=(SELECT idUsers from Users WHERE username='$currentUser')
				)";
			$checkIsBlocked = "SELECT idUsers				
				FROM Users WHERE Users.idUsers IN(
	    				SELECT BlackList.black_two FROM Users JOIN BlackList 
					WHERE Users.idUsers=BlackList.black_one
	    				AND BlackList.black_one=(SELECT idUsers from Users WHERE username='$currentUser')
					AND BlackList.black_two=(SELECT idUsers from Users WHERE username='$searchedUser')
				) OR Users.idUsers IN(
	    				SELECT BlackList.black_one FROM Users JOIN BlackList 
					WHERE Users.idUsers=BlackList.black_two
					AND BlackList.black_one=(SELECT idUsers from Users WHERE username='$searchedUser')
	    				AND BlackList.black_two=(SELECT idUsers from Users WHERE username='$currentUser')
				)";
			$checkBlock = $conn->query($checkIsBlocked);
			$checkFriend = $conn->query($checkIsFriend);
			if ($checkFriend && $checkFriend->num_rows >0) { $isMyFriend=true; } else { $isMyFriend=false; }
			if ($checkBlock->num_rows >0) { $isInBlackList=true; } else { $isInBlackList=false; }
		}
		
		if ($res->num_rows >0) {
			while($row = $res->fetch_assoc()) {
				$row["idUsers"] = (int)$row["idUsers"];
				$row["rating"] = (int)$row["rating"];
				if($row["isConfirm"]==="1") $row["isConfirm"] = true; else $row["isConfirm"] = false;
				if($row["isBanned"]==="1") $row["isBanned"] = true; else $row["isBanned"] = false;
				if($row["isOnline"]==="1") $row["isOnline"] = true; else $row["isOnline"] = false;
				$row["isMyFriend"] = $isMyFriend;
				$row["isBlocked"] = $isInBlackList;
				$result = json_encode($row);
			}
		}
		else {
			$result = json_encode("User not found. Try again");
		}
		$conn->close();
		echo '{"operation":"Search User","result":'.$result.'}';
	}
	function searchFriends($username, $filters, $page){
		$result = [];
		require_once 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
		if ($conn->connect_error) {
		 $result = "Connection failed: " . $conn->connect_error;
		}
		$sql = "SELECT	username,
				isOnline,
				isBanned,
				isConfirm,
				lastOnline, 
				Country,
				City, 
				FirstName, 
				LastName, 
				Birthday,
				rating, 
				avatar 
			FROM Users WHERE ";
			if($filters->username!==""){
				$sql.="username LIKE '%".$filters->username."%'";	
			}
			if($filters->date!==""){
				$sql.="Birthday='".$filters->date."'";	
			}
			if($filters->country!==""){
				$sql.="Country='".$filters->country."'";
			}
			if($filters->city!==""){
				$sql.="City='".$filters->city."'";
			}
			if($filters->username==="" && $filters->date==="" && $filters->country==="" && $filters->city==="") {
				$sql.="1";	
			}
			$sql.=" AND Users.idUsers IN(
    				SELECT FriendList.friend_two FROM Users JOIN FriendList 
				WHERE Users.idUsers=FriendList.friend_one
				AND FriendList.status='good'
    				AND FriendList.friend_one=(SELECT idUsers from Users WHERE username='$username')
			) OR Users.idUsers IN(
    				SELECT FriendList.friend_one FROM Users JOIN FriendList 
				WHERE Users.idUsers=FriendList.friend_two
				AND FriendList.status='good'
    				AND FriendList.friend_two=(SELECT idUsers from Users WHERE username='$username')
			) AND Users.idUsers NOT IN(
    				SELECT BlackList.black_two FROM Users JOIN BlackList 
				WHERE Users.idUsers=BlackList.black_one
    				AND BlackList.black_one=(SELECT idUsers from Users WHERE username='$username')
			) AND Users.idUsers NOT IN(
    				SELECT BlackList.black_one FROM Users JOIN BlackList 
				WHERE Users.idUsers=BlackList.black_two
    				AND BlackList.black_two=(SELECT idUsers from Users WHERE username='$username')
			) LIMIT $page,10";
		$res = $conn->query($sql);
		if ($res->num_rows >0) {
			while($row = $res->fetch_assoc()) {
				$row["rating"] = (int)$row["rating"];
				if($row["isConfirm"]==="1") $row["isConfirm"] = true; else $row["isConfirm"] = false;
				if($row["isBanned"]==="1") $row["isBanned"] = true; else $row["isBanned"] = false;
				if($row["isOnline"]==="1") $row["isOnline"] = true; else $row["isOnline"] = false;
				$row["isMyFriend"] = true;
				$result[] = $row;
			}
		}
		else {
			$result = "Friends not found";
		}
		$conn->close();
		echo '{"operation":"Search Friends","result":'.json_encode($result).'}';
	}
	function searchInvites($username, $filters, $page){
		$result = [];
		require_once 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
		if ($conn->connect_error) {
		 $result = "Connection failed: " . $conn->connect_error;
		}
		$sql = "SELECT	username,
				isOnline,
				isBanned,
				isConfirm,
				lastOnline, 
				Country,
				City, 
				FirstName, 
				LastName, 
				Birthday,
				rating, 
				avatar 
			FROM Users WHERE ";
			if($filters->username!==""){
				$sql.="username LIKE '%".$filters->username."%'";	
			}
			if($filters->date!==""){
				$sql.="Birthday='".$filters->date."'";	
			}
			if($filters->country!==""){
				$sql.="Country='".$filters->country."'";
			}
			if($filters->city!==""){
				$sql.="City='".$filters->city."'";
			}
			if($filters->username==="" && $filters->date==="" && $filters->country==="" && $filters->city==="") {
				$sql.="1";	
			}
			$sql.=" AND Users.idUsers IN(
    				SELECT FriendList.friend_two FROM Users JOIN FriendList 
				WHERE Users.idUsers=FriendList.friend_one
				AND FriendList.status='almost'
    				AND FriendList.friend_one=(SELECT idUsers from Users WHERE username='$username')
			) OR Users.idUsers IN(
    				SELECT FriendList.friend_one FROM Users JOIN FriendList 
				WHERE Users.idUsers=FriendList.friend_two
				AND FriendList.status='almost'
    				AND FriendList.friend_two=(SELECT idUsers from Users WHERE username='$username')
			) AND Users.idUsers NOT IN(
    				SELECT BlackList.black_two FROM Users JOIN BlackList 
				WHERE Users.idUsers=BlackList.black_one
    				AND BlackList.black_one=(SELECT idUsers from Users WHERE username='$username')
			) AND Users.idUsers NOT IN(
    				SELECT BlackList.black_one FROM Users JOIN BlackList 
				WHERE Users.idUsers=BlackList.black_two
    				AND BlackList.black_two=(SELECT idUsers from Users WHERE username='$username')
			) LIMIT $page,10";
		$res = $conn->query($sql);
		if ($res->num_rows >0) {
			while($row = $res->fetch_assoc()) {
				$row["rating"] = (int)$row["rating"];
				if($row["isConfirm"]==="1") $row["isConfirm"] = true; else $row["isConfirm"] = false;
				if($row["isBanned"]==="1") $row["isBanned"] = true; else $row["isBanned"] = false;
				if($row["isOnline"]==="1") $row["isOnline"] = true; else $row["isOnline"] = false;
				$row["isMyFriend"] = false;
				$result[] = $row;
			}
		}
		else {
			$result = "Invites not found";
		}
		$conn->close();
		echo '{"operation":"Search Invites","result":'.json_encode($result).'}';
	}
	function searchBlocked($username, $filters, $page){
		$result = [];
		require_once 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
		if ($conn->connect_error) {
		 $result = "Connection failed: " . $conn->connect_error;
		}
		$sql = "SELECT	username,
				isOnline,
				isBanned,
				isConfirm,
				lastOnline, 
				Country,
				City, 
				FirstName, 
				LastName, 
				Birthday,
				rating, 
				avatar 
			FROM Users WHERE ";
			if($filters->username!==""){
				$sql.="username LIKE '%".$filters->username."%'";	
			}
			if($filters->date!==""){
				$sql.="Birthday='".$filters->date."'";	
			}
			if($filters->country!==""){
				$sql.="Country='".$filters->country."'";
			}
			if($filters->city!==""){
				$sql.="City='".$filters->city."'";
			}
			if($filters->username==="" && $filters->date==="" && $filters->country==="" && $filters->city==="") {
				$sql.="1";	
			}
			$sql.=" AND Users.idUsers IN(
    				SELECT BlackList.black_two FROM Users JOIN BlackList 
				WHERE Users.idUsers=BlackList.black_one
    				AND BlackList.black_one=(SELECT idUsers from Users WHERE username='$username')
			) OR Users.idUsers IN(
    				SELECT BlackList.black_one FROM Users JOIN BlackList 
				WHERE Users.idUsers=BlackList.black_two
    				AND BlackList.black_two=(SELECT idUsers from Users WHERE username='$username')
			) LIMIT $page,10";
		$res = $conn->query($sql);
		if ($res->num_rows >0) {
			while($row = $res->fetch_assoc()) {
				$row["rating"] = (int)$row["rating"];
				if($row["isConfirm"]==="1") $row["isConfirm"] = true; else $row["isConfirm"] = false;
				if($row["isBanned"]==="1") $row["isBanned"] = true; else $row["isBanned"] = false;
				if($row["isOnline"]==="1") $row["isOnline"] = true; else $row["isOnline"] = false;
				$row["isMyFriend"] = false;
				$result[] = $row;
			}
		}
		else {
			$result = "Blocks not found";
		}
		$conn->close();
		echo '{"operation":"Search Blocked","result":'.json_encode($result).'}';
	}
}
	
?>
