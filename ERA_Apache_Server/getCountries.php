<?php
//require_once 'headers.php';

$postData= file_get_contents('php://input');

if(isset($postData)){
	$userData = json_decode($postData);
	$operation = $userData->operation;
	$getter = new countryGetter();
	if($operation === "get contries"){
		echo $getter->getAllCountries();
	}
	else echo '{"operation":"'.$operation.'","result":"Invalid Operation"}';
}
else echo '{"operation":"post getter","result":"I don\'t see anything"}';


class countryGetter{
	function getAllCountries(){
		$json=[];
		include 'DBconfig.php';
		$conn = new mysqli($HostName, $HostUser, $HostPass, "ContryCity");
		if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
		} 
		$sql = "SELECT id, name_en FROM net_country";
		$sql1 = "SELECT id, country_id, name_en FROM net_city";
		$result = $conn->query($sql);
		$result1 = $conn->query($sql1);
		if ($result->num_rows >0 && $result1->num_rows>0) {
			while($row = $result->fetch_assoc()) {
				$row["id"]= (int)$row["id"];
			$json["country"][] = $row;
			}
			while($row1 = $result1->fetch_assoc()) {
				$row1["id"]= (int)$row1["id"];
				$row1["country_id"]= (int)$row1["country_id"];
			$json["city"][] = $row1;
			}
		} else {
		 	$json = "No Results Found.";
		}
		echo '{"operation":"get contries","result":'.json_encode($json).'}';
		$conn->close();
	}
}

?>
