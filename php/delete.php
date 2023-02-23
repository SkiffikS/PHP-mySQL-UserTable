<?php

// delete user for id file

require("db.php"); // impport database

$request = $_REQUEST; // AJAX data

$id = $request["delete_id"]; // del id

if (checkForSqlInjection($id) === false) {
  echo json_encode(['status' => false, 'error' => ['code' => 100, 'message' => 'SQL injection atack']]);
  exit;
}

$query = "DELETE FROM user WHERE id='$id'"; // SQL request for delete user
$sql = "SELECT * FROM user WHERE id = $id";

$is_true = mysqli_query($conn, $sql);

if ($is_true->num_rows > 0) {
  $query_run = mysqli_query($conn, $query);
  if ($query_run) {
    echo json_encode(array("status" => true, "error" => null, "id" => $id));
  }
  else {
    $error_number = mysqli_errno($conn);
    $error_text = mysqli_error($conn);
    echo json_encode(['status' => false, 'error' => ['code' => $error_number, 'message' => $error_text]]);
  }
} else {
  echo json_encode(['status' => false, 'error' => ['code' => 140, 'message' => 'User not found']]);
}

mysqli_close($conn); // close database