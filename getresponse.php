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
if (isset($_POST["fname"]) && isset($_POST["femail"]) && isset($_POST["fmobile"]) && isset($_POST["fcity"]) && isset($_POST["faddress"]) && isset($_POST["fpincode"]) && isset($_POST["user"])) {
  $fname = $_POST['fname'];
  $femail = $_POST['femail'];
  $fmobile = $_POST['fmobile'];
  $fcity = $_POST['fcity'];
  $faddress = $_POST['faddress'];
  $fpincode = $_POST['fpincode'];
  $user = $_POST['user'];

  $stmt = mysqli_prepare($conn, "INSERT INTO franchise (fname, femail, fmobile, fcity, faddress, fpincode) VALUES (?, ?, ?, ?, ?, ?)");
  mysqli_stmt_bind_param($stmt, "ssssss", $fname, $femail, $fmobile, $fcity, $faddress, $fpincode);

  if (mysqli_stmt_execute($stmt)) {
    $action = "franchise_data added successfully";
    $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
    mysqli_stmt_bind_param($stmt, "ss", $action, $user);
    mysqli_stmt_execute($stmt);
    // Successfully saved franchise data
    echo "success";
  } else {
    $action = "franchise_data added failed";
    $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
    mysqli_stmt_bind_param($stmt, "ss", $action, $user);
    mysqli_stmt_execute($stmt);
    // Failed to save franchise data
    echo "fail";
  }
  mysqli_stmt_close($stmt);
}

if (isset($_POST["quotationuser"])) {
  $user = $_POST["quotationuser"];
  $action = "quotation_data added successfully";

  $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
  mysqli_stmt_bind_param($stmt, "ss", $action, $user);
  if (!mysqli_stmt_execute($stmt)) {
    echo "Error: " . mysqli_error($conn);
    exit;
  } else {
    echo "success";
  }
  mysqli_stmt_close($stmt);
}



if (isset($_FILES['file'])) {
  $file = $_FILES['file'];
  $fileName = $file['name'];
  $fileTmpName = $file['tmp_name'];
  $fileSize = $file['size'];
  $fileError = $file['error'];
  $fileType = $file['type'];
  $username = $_POST["user"];

  // Check if file has no errors
  if ($fileError === 0) {
    // Read file content
    $fileContent = file_get_contents($fileTmpName);

    // prepare query using prepared statement
    $stmt = mysqli_prepare($conn, "INSERT INTO files (filename, filetype, filedata) VALUES (?, ?, ?)");
    if (!$stmt) {
      die("Error preparing query: " . mysqli_error($conn));
    }
    mysqli_stmt_bind_param($stmt, "sss", $fileName, $fileType, $fileContent);

    // execute query
    if (mysqli_stmt_execute($stmt)) {
      $action = "successfully saved the file";
      $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
      mysqli_stmt_bind_param($stmt, "ss", $action, $username);
      mysqli_stmt_execute($stmt);
      // Successfully saved file
      echo "success";
    } else {
      $action = "failed to save the file";
      $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
      mysqli_stmt_bind_param($stmt, "ss", $action, $username);
      mysqli_stmt_execute($stmt);
      // Failed to save file
      echo "fail";
    }
    mysqli_stmt_close($stmt);
  } else {
    $action = "failed to upload file";
      $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
      mysqli_stmt_bind_param($stmt, "ss", $action, $username);
      mysqli_stmt_execute($stmt);
    // Failed to upload file
    echo "fail";
  }
}


// Check if username and password were provided
if (isset($_POST["tracker_id"]) && isset($_POST["trackuser"])) {
  $tracker_id = $_POST["tracker_id"];
  $trackuser = $_POST["trackuser"];

  $stmt = mysqli_prepare($conn, "SELECT * FROM tracker WHERE tracker_id=?");
  mysqli_stmt_bind_param($stmt, "s", $tracker_id);

  mysqli_stmt_execute($stmt);
  $result = mysqli_stmt_get_result($stmt);

  if (mysqli_num_rows($result) > 0) {

    $action = "Parcel tracked successfully";
    $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
    mysqli_stmt_bind_param($stmt, "ss", $action, $trackuser);
    mysqli_stmt_execute($stmt);
    // Successfully logged in
    $row = mysqli_fetch_assoc($result);
    $response = array(
      'status' => $row['status'],
      'city' => $row['city']
    );
    echo json_encode($response);
  } else {
    $action = "Parcel tracked failed";
    $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
    mysqli_stmt_bind_param($stmt, "ss", $action, $trackuser);
    mysqli_stmt_execute($stmt);
    // Login failed
    echo "error";
  }
  mysqli_stmt_close($stmt);
}


// Check if username and password were provided
if (isset($_POST["username"]) && isset($_POST["password"])) {
  $username = $_POST["username"];
  $c_password = $_POST["password"];

  $stmt = mysqli_prepare($conn, "SELECT * FROM c_login WHERE c_username=?");
  mysqli_stmt_bind_param($stmt, "s", $username);

  mysqli_stmt_execute($stmt);
  $result = mysqli_stmt_get_result($stmt);

  if (mysqli_num_rows($result) > 0) {
    // Successfully found user
    $row = mysqli_fetch_assoc($result);
    $hashed_password = $row["c_password"];
    if (password_verify($c_password, $hashed_password)) {
      // Successfully logged in
      $action = "login_success";
      $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
      mysqli_stmt_bind_param($stmt, "ss", $action, $username);
      mysqli_stmt_execute($stmt);
      echo "success";
    } else {
      $action = "login_failed password incorrect";
      $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
      mysqli_stmt_bind_param($stmt, "ss", $action, $username);
      mysqli_stmt_execute($stmt);
      // Password incorrect
      echo "password incorrect";
    }
  } else {
    $action = "login_failed username not found";
    $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
    mysqli_stmt_bind_param($stmt, "ss", $action, $username);
    mysqli_stmt_execute($stmt);
    // Username not found
    echo "username not found";
  }
  mysqli_stmt_close($stmt);
}



// Check if the username, password, and email for register
if (isset($_POST["newuser"]) && isset($_POST["pass"]) && isset($_POST["email"])) {
  $c_username = $_POST["newuser"];
  $c_password = $_POST["pass"];
  $email = $_POST["email"];

  // Check if the username is already taken
  $stmt = mysqli_prepare($conn, "SELECT * FROM c_login WHERE c_username=?");
  mysqli_stmt_bind_param($stmt, "s", $c_username);
  mysqli_stmt_execute($stmt);
  $result = mysqli_stmt_get_result($stmt);
  if (mysqli_num_rows($result) > 0) {
    $action = "new_register username_already_taken";
    $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
    mysqli_stmt_bind_param($stmt, "ss", $action, $c_username);
    mysqli_stmt_execute($stmt);
    // Username already taken
    echo "username_taken";
    exit;
  } else {
    // Check if the email is already taken
    $stmt = mysqli_prepare($conn, "SELECT * FROM c_login WHERE email=?");
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if (mysqli_num_rows($result) > 0) {
      $action = "new_register email_already_taken";
      $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
      mysqli_stmt_bind_param($stmt, "ss", $action, $c_username);
      mysqli_stmt_execute($stmt);
      // Email already taken
      echo "email_taken";
      exit;
    } else {
      // Hash the password using the bcrypt algorithm
      $hashed_password = password_hash($c_password, PASSWORD_DEFAULT);

      // Insert the user's data into the database
      $stmt = mysqli_prepare($conn, "INSERT INTO c_login (c_username, c_password, email) VALUES (?, ?, ?)");
      mysqli_stmt_bind_param($stmt, "sss", $c_username, $hashed_password, $email);
      if (mysqli_stmt_execute($stmt)){
        $action = "new_register user_added";
        $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
        mysqli_stmt_bind_param($stmt, "ss", $action, $c_username);
        mysqli_stmt_execute($stmt);
        echo "success";
      }
    }
    mysqli_stmt_close($stmt);
  }
}



// Check if a question was provided
if (isset($_GET["q"])) {
    $q = $_GET["q"];
    $response = "";
    $c_username = "questions";
  
    if ($q != "") {
      // prepare query using prepared statement
      $search = "%$q%";
      $stmt = mysqli_prepare($conn, "SELECT answer FROM faq WHERE question LIKE ?");
      mysqli_stmt_bind_param($stmt, "s", $search);
  
      // execute query
      mysqli_stmt_execute($stmt);
      $result = mysqli_stmt_get_result($stmt);
  
      if (mysqli_num_rows($result) > 0) {
        $action = "answers send successfully";
      $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
      mysqli_stmt_bind_param($stmt, "ss", $action, $c_username);
      mysqli_stmt_execute($stmt);
        // fetch answer from database
        $row = mysqli_fetch_assoc($result);
        $response = $row['answer'];
      } else {
        $action = "no answer for the user question";
      $stmt = mysqli_prepare($conn, "INSERT INTO chatbot_stats (action, createdat, username) VALUES (?, NOW(), ?)");
      mysqli_stmt_bind_param($stmt, "ss", $action, $c_username);
      mysqli_stmt_execute($stmt);
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
