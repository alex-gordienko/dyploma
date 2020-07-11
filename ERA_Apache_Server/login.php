<?php
//require_once 'headers.php';
//$redicet = $_SERVER['HTTP_REFERER'];
if(isset($_POST['login'])){
	$username = $_POST['login'];
	$pass = $_POST['pass'];
	$response = new Response();
	$response->sendResponse($username, $pass);
}

else if(isset($_POST['logout'])){
	$response = new Response();
	$response->Logout($_POST['logout']);
}

class Response{
	function sendResponse($username, $pass){
		$json = '{"operation":"login","result":"No Results Found"}';
		// Create connection
		require_once 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
		if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
		} 
		$sql = "SELECT idUsers,
				regDate,
				isConfirm,
				isBanned, 
				username, 
				FirstName, 
				LastName, 
				Birthday,
				Country,
				City, 
				Status, 
				email, 
				phone, 
				rating, 
				avatar,
				crypt_pass AS password
			FROM Users WHERE username='$username' AND crypt_pass='$pass' OR email= '$username' AND crypt_pass='$pass'";
		$result = $conn->query($sql);
		if ($result->num_rows >0) {
			while($row = $result->fetch_assoc()) {
			$row["idUsers"] = (int)$row["idUsers"];
			if($row["isConfirm"]==="1") $row["isConfirm"] = true; else $row["isConfirm"] = false;
			if($row["isBanned"]==="1") $row["isBanned"] = true; else $row["isBanned"] = false;
			$row["rating"] = (int)$row["rating"];
			$res = json_encode($row);
			$conn->query("UPDATE Users SET isOnline=1 WHERE idUsers=".$row['idUsers']);
			$json = '{"operation":"login","result":'.$res.'}';
			 }
		} else {
			$json = '{"operation":"login","result":"No Results Found"}';
		}
		echo $json;
		$conn->close();	
	}
	function Logout($username){
		// Create connection
		date_default_timezone_set('Europe/Kiev');
		$t =time();
		require_once 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
		if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
		} 
		$conn->query("UPDATE Users SET isOnline=0, lastOnline='".date('Y-m-d H:i:s',$t)."' WHERE username='$username'");
		$conn->close();	
		echo '{"operation":"logout","result":"Success"}';
	}
}
	
?>
