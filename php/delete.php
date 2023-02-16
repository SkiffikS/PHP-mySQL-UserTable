<?php

// delete user for id file

require("db.php"); // impport database

$request = $_REQUEST; // AJAX data

$id = $request["delete_id"]; // del id

$query = "DELETE FROM user WHERE id='$id'"; // SQL request for delete user
$query_run = mysqli_query($conn, $query);

if ($query_run) {
  echo '{"status": true, "error": null, "id": '.$id.'}';
} else {
  $error_number = mysqli_errno($conn);
  $error_text = mysqli_error($conn);
  echo '{"status": false, "error": {"code": '.$error_number.', "message": '.$error_text.'}}';
}

mysqli_close($conn); // close database
?>