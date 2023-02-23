<?php

require("db.php");

$request = $_REQUEST;

$id = $request["id"];
$fname = $request["firstName"];
$lname = $request["lastName"];
$status = $request["active"];
$role = $request["role"];

if (checkForSqlInjection($id) === false || checkForSqlInjection($fname) === false || checkForSqlInjection($lname) === false || checkForSqlInjection($status) === false) {
  echo json_encode(['status' => false, 'error' => ['code' => 100, 'message' => 'SQL injection atack']]);
  exit;
}

if (!preg_match("/^[\p{L} ]*$/u", $fname) || $fname == "") {
  echo json_encode(array("status" => false, "error" => array("code" => 136, "message" => "incorrect first name")));
  exit;
}

if (!preg_match("/^[\p{L} ]*$/u", $lname) || $lname == "") {
  echo json_encode(array("status" => false, "error" => array("code" => 137, "message" => "incorrect last name")));
  exit;
}

if ($role == "") {
  echo json_encode(["status"=> false, "error"=> ["code"=> 138, "message"=> "incorrect user Role"]]);
  exit;
}

if($id == -1) {
  $query = "INSERT INTO user (`first_name`,`last_name`,`status`, `role`) VALUES ('$fname','$lname','$status','$role')";
  $query_run = mysqli_query($conn, $query);
  if ($query_run) {
    $query_get = "SELECT * FROM user ORDER BY id DESC LIMIT 1";
    $result = mysqli_query($conn, $query_get);
    if($result) {
      $row = mysqli_fetch_array($result);
      $new_id = $row["id"];
      echo json_encode(["status" => true, "error" => null, "id" => $new_id]);
    } else {
      $error_number = mysqli_errno($conn);
      $error_text = mysqli_error($conn);
      echo json_encode(["status" => false, "error" => ["code" => $error_number, "message" => $error_text]]);
    }
  } else {
    $error_number = mysqli_errno($conn);
    $error_text = mysqli_error($conn);
    echo json_encode(["status" => false, "error" => ["code" => $error_number, "message" => $error_text]]);
  }
  exit;
}

$sql = "SELECT * FROM user WHERE id = $id";
$is_true = mysqli_query($conn, $sql);
if ($is_true->num_rows > 0) {
  $query = "UPDATE user SET first_name='$fname', last_name='$lname', status='$status', role='$role' WHERE id='$id'";
  $result = mysqli_query($conn, $query);
  if($result) {
    echo json_encode(["status" => true, "error" => null, "id" => $id]);
  } else {
    $error_number = mysqli_errno($conn);
    $error_text = mysqli_error($conn);
    echo json_encode(["status" => false, "error" => ["code" => $error_number, "message" => $error_text]]);
  }
} else {
  echo json_encode(array("status" => false, "error" => array("code" => 140, "message" => "User not found")));
}

mysqli_close($conn);