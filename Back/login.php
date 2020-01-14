<?php
//require_once 'headers.php';
//$redicet = $_SERVER['HTTP_REFERER'];
if(isset($_POST['login'])){
	$login = $_POST['login'];
	$email = $_POST['email'];
	$pass = $_POST['pass'];
	$response = new Response();
	$response->sendResponse($login, $pass, $email);
}

class Response{
	function sendResponse($login, $pass, $email){
		$json = '{"operation":"login","result":"No Results Found"}';
		// Create connection
		require_once 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
		if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
		} 
		$sql = "SELECT idUsers, 
				username, 
				FirstName, 
				LastName, 
				Birthday, 
				Status, 
				email, 
				phone, 
				rating, 
				avatar 
			FROM Users WHERE username='".$login."' AND crypt_pass='".$pass."'";
		$result = $conn->query($sql);
		if ($result->num_rows >0) {
			while($row = $result->fetch_assoc()) {
			 $res = json_encode($row);
			$json = '{"operation":"login","result":'.$res.'}';
			 }
		} else {
			$json = '{"operation":"login","result":"No Results Found"}';
		}
		echo $json;
		$conn->close();	
	}
}
	
?>
