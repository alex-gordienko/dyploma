<?php
//require_once 'headers.php';
//$redicet = $_SERVER['HTTP_REFERER'];

if(isset($_REQUEST['user'])&&isset($_REQUEST['token'])){
	$response = new UserEditor();
	echo $response->validUser($_REQUEST['user'],$_REQUEST['token']);
}
else{
	$postData= file_get_contents('php://input');

	if(isset($postData)){
		$userData = json_decode($postData);
		$operation = $userData->operation;
		$content = $userData->json;
		$response = new UserEditor();
		if($operation === "Edit User"){
			$response->editUser($content);
		}
		else if($operation === "Create User"){
			$response->createUser($content);
		}
		else echo '{"operation":"'.$operation.'","result":"Invalid Operation"}';
		
	}
	else echo '{"operation":"usereditor","result":"I don\'t see anything"}';
}



class UserEditor{
	function editUser($json){
		$result = "";
		$username = "";
		$firstname = "";
		$lastname = "";
		$status = "";
		$city = "";
		$country = "";
		$email = "";
		$phone = "";
		$avatar = "";
		$password = "";
		require_once 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
		if ($conn->connect_error) {
		 $result = "Connection failed: " . $conn->connect_error;
		}
		$sql = "SELECT idUsers, 
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
			FROM Users WHERE username='".$json->username."'";
		$res = $conn->query($sql);
		if ($res->num_rows >0) {
			while($row = $res->fetch_assoc()) {
			 	$username = $row["username"];
				$firstname = $row["FirstName"];
				$lastname = $row["LastName"];
				$status = $row["Status"];
				$country = $row["Country"];
				$city = $row["City"];
				$email = $row["email"];
				$phone = $row["phone"];
				$avatar = $row["avatar"];
				$password = $row["password"];
			 }
		$update = "UPDATE Users SET ";
			if($json->username != $username){ 
				$update.= "username = '".$json->username."', ";
				$result.= "The name was edited from ".$username." to ".$json->username."; ";
			}
			if($json->FirstName != $firstname){ 
				$update.= "FirstName = '".$json->FirstName."', ";
				$result.= "The Firstname was edited from ".$firstname." to ".$json->FirstName."; ";
			}
			if($json->LastName != $lastname){ 
				$update.= "LastName = '".$json->LastName."', ";
				$result.= "The Lastname was edited from ".$lastname." to ".$json->LastName."; ";
			}
			if($json->Status != $status){ 
				$update.= "Status = '".$json->Status."', ";
				$result.= "The Status was edited from ".$status." to ".$json->Status."; ";
			}
			if($json->Country != $country){ 
				$update.= "Country = '".$json->Country."', ";
				$result.= "The Country was edited from ".$country." to ".$json->Country."; ";
			}
			if($json->City != $city){ 
				$update.= "City = '".$json->City."', ";
				$result.= "The City was edited from ".$city." to ".$json->City."; ";
			}
			if($json->email != $email){ 
				$update.= "email = '".$json->email."', ";
				$result.= "The email was edited from ".$email." to ".$json->email."; ";
			}
			if($json->phone != $phone){ 
				$update.= "phone = '".$json->phone."', ";
				$result.= "The Phone was edited from ".$phone." to ".$json->phone."; ";
			}
			if($json->avatar != $avatar){
				$blob = str_replace("data:image/jpeg;base64,", "", $json->avatar);
				$image = base64_decode($blob);
				file_put_contents("/srv/windows/dyploma/Photoes/All/".$json->idUsers."/avatar.jpg",$image); 
				$update.= "avatar = '".$json->avatar."', ";
				$result.= "The Avatar was changed; ";
			}
			if($json->password != $password){ 
				$update.= "crypt_pass = '".$json->password."', ";
				$result.= "The Password was changed; ";
			}
		$update = substr($update,0,(strlen($update)-2));
		$update.= " WHERE idUsers=".$json->idUsers."";
		if($conn->query($update)){
			$result.= "Operation Successful";
		}
		else{
			$result.= "Insert Error ".$conn->error;				
		}
		$conn->close();
		} else {
			$result = 'No Results Found';
		}

		echo '{"operation":"Edit User","result":"'.$result.'"}';
	}
	function createUser($json){
		$permitted_chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		$activation_token = substr(str_shuffle($permitted_chars),0, 16);

		$result = "Empty";
		require_once 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
		if ($conn->connect_error) {
		 $result = "Connection failed: " . $conn->connect_error;
		}
		$sql = "SELECT idUsers FROM Users WHERE username='".$json->username."'";
		$res = $conn->query($sql);
		if ($res->num_rows >0) {
			$result = "User ".$json->username." is already exist";
		}
		else{
			$createUser = "INSERT INTO Users
			(username, regToken, crypt_pass, FirstName, LastName, Country, City, Birthday,";
			if($json->Status !=""){
				$createUser.= "Status, ";
			} 
			$createUser.= "email, phone, rating";
			if($json->avatar !="") {
				$createUser.= ", avatar";
			}
			$createUser.= ") 
				VALUES('".$json->username."',
					'".$activation_token."',
					'".$json->password."',
					'".$json->FirstName."',
					'".$json->LastName."',
					'".$json->Country."',
					'".$json->City."',
					'".$json->Birthday."',";
				if($json->Status !=""){
					$createUser.= " '".$json->Status."',";
				}
				$createUser.="
					'".$json->email."',
					'".$json->phone."',
					80";
				if($json->avatar !=""){
					$createUser.= ", '".$json->avatar."'";
				}
				$createUser.=")";

			if($conn->query($createUser)){
				$this->sendMessage($json->email, $json->username, $activation_token, "registration");
				$result = "Successful";
			}
			else{
				$result = "Create User Error: ".$conn->error." ".$createUser;				
			}
		}
		$conn->close();
		echo '{"operation":"Create User","result":"'.$result.'"}';
	}
	function validUser($username, $token){
		$ip = file_get_contents("https://api.ipify.org");
		$result = "Empty";
		require_once 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
		if ($conn->connect_error) {
		 $result = "Connection failed: " . $conn->connect_error;
		}
		$sql = "SELECT regToken FROM Users WHERE username='$username'";
		$res = $conn->query($sql);
		if ($res->num_rows >0) {
			while($row = $res->fetch_assoc()) {
				if($row["regToken"]==$token){
					$update = "UPDATE Users SET isConfirm=1 WHERE username='$username'";
					if($conn->query($update)){
						$result = "Operation Successful";
					}
					else{
						$result = "Validation Error: ".$conn->error;				
					}
				}
				else{
					$result = "Validation Error: Registration token is not correct";				
				}
			}
		}
		else{
			$result = "Validation Error: User not found";				
		}
		$conn->close();
		if($result==="Operation Successful"){
			echo "<div>
				<h1>Success!</h1>
				<p>$username, You registered in the new ERA<br/>
					Let's go to <a href='http://$ip/build'> a main page</a>
				</p>
			     </div>";
		}
		else echo '{"operation":"Valid User","result":"'.$result.'"}';
	}
	function sendMessage($to, $user, $token, $reason){
		require_once "Mail.php";
		require "Mail/mime.php";

		$ip = file_get_contents("https://api.ipify.org");
		$crlf = "\r\n";

		$from = "ERA-system <ERA@noreply.com>";
		$host = "ssl://smtp.gmail.com";
		$port = "465";
		$username = 'alexoid1999@gmail.com';
		$password = 'eetgzbmuhlxuyanz';

		$subject = "ERA no-reply";
		$message="";
		
		if($reason==="registration"){
			$message="<div>
				<h1>Welcome, $user </h1>
				<p>If you see this message, <br/>
					your e-mail was used to registration in new social network 'Eternal Radiance'
				</p>
				<p>If that was really you, please 
					<a href='http://$ip/dyploma/userEditor.php?token=$token&user=$user'>confirm this</a>
				</p>
			</div>";
		}

		$headers = array (
			'From' 		=> $from, 
			'To' 		=> $to,
			'Subject' 	=> $subject,
			'Content-type' 	=> "text/html; charset=windows-1251"
			);
		$smtp = Mail::factory('smtp',
		 array (
			'host' => $host,
			'port' => $port,
			'auth' => true,
			'username' => $username,
			'password' => $password));
		$mail = $smtp->send($to, $headers, $message);
		if (PEAR::isError($mail)) {
		 echo($mail->getMessage());
		} else {
		 echo("Message successfully sent!");
		}
	}

}
	
?>
