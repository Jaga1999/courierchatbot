<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "courier_chatbox";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Check if franchise data was provided
if (isset($_POST["fname"]) && isset($_POST["femail"]) && isset($_POST["fmobile"]) && isset($_POST["fcity"]) && isset($_POST["faddress"])&& isset($_POST["fpincode"])) {
  $fname = $_POST['fname'];
  $femail = $_POST['femail'];
  $fmobile = $_POST['fmobile'];
  $fcity = $_POST['fcity'];
  $faddress = $_POST['faddress'];
  $fpincode = $_POST['fpincode'];

  // prepare query using prepared statement
  $stmt = mysqli_prepare($conn, "INSERT INTO franchise (fname, femail, fmobile, fcity, faddress, fpincode) VALUES (?, ?, ?, ?, ?, ?)");
  mysqli_stmt_bind_param($stmt, "ssssss", $fname, $femail, $fmobile, $fcity, $faddress, $fpincode);

  // execute query
  if (mysqli_stmt_execute($stmt)) {
    // Successfully saved franchise data
    echo "success";
  } else {
    // Failed to save franchise data
    echo "fail";
  }
  mysqli_stmt_close($stmt);
}



// Check if username and password were provided
if (isset($_POST["tracker_id"])) {
  $tracker_id = $_POST["tracker_id"];

  // prepare query using prepared statement
  $stmt = mysqli_prepare($conn, "SELECT * FROM tracker WHERE tracker_id=?");
  mysqli_stmt_bind_param($stmt, "s", $tracker_id);

  // execute query
  mysqli_stmt_execute($stmt);
  $result = mysqli_stmt_get_result($stmt);

  if (mysqli_num_rows($result) > 0) {
    // Successfully logged in
    $row = mysqli_fetch_assoc($result);
    $response = array(
      'status' => $row['status'],
      'city' => $row['city']
    );
    echo json_encode($response);
  } else {
    // Login failed
    echo "error";
  }
  mysqli_stmt_close($stmt);
}


// Check if username and password were provided
if (isset($_POST["username"]) && isset($_POST["password"])) {
  $c_username = $_POST["username"];
  $c_password = $_POST["password"];

  // prepare query using prepared statement
  $stmt = mysqli_prepare($conn, "SELECT * FROM c_login WHERE c_username=? AND c_password=?");
  mysqli_stmt_bind_param($stmt, "ss", $c_username, $c_password);

  // execute query
  mysqli_stmt_execute($stmt);
  $result = mysqli_stmt_get_result($stmt);

  if (mysqli_num_rows($result) > 0) {
    // Successfully logged in
    echo "success";
  } else {
    // Login failed
    echo "fail";
  }
  mysqli_stmt_close($stmt);
}

// Check if a question was provided
if (isset($_GET["q"])) {
    $q = $_GET["q"];
    $response = "";
  
    if ($q != "") {
      // prepare query using prepared statement
      $search = "%$q%";
      $stmt = mysqli_prepare($conn, "SELECT answer FROM faq WHERE question LIKE ?");
      mysqli_stmt_bind_param($stmt, "s", $search);
  
      // execute query
      mysqli_stmt_execute($stmt);
      $result = mysqli_stmt_get_result($stmt);
  
      if (mysqli_num_rows($result) > 0) {
        // fetch answer from database
        $row = mysqli_fetch_assoc($result);
        $response = $row['answer'];
      } else {
        $noresponse = "Sorry, I'm still learning. Hence my responses are limited. Ask something else.";
        $response = $noresponse;
      }
      mysqli_stmt_close($stmt);
    }
  
    echo $response;
  }
  

// close database connection
mysqli_close($conn);
?>
