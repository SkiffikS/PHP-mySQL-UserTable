<?php

require("db.php");

$request = $_REQUEST;

$action = $request["action"];
$user_list = $request["id_list"];
$id_list_string = implode(',', $user_list);

if ($action == "set-active") {
  $query = "UPDATE user SET status = 1 WHERE id IN ($id_list_string)";
} elseif ($action == "set-not-active") {
  $query = "UPDATE user SET status = 0 WHERE id IN ($id_list_string)";
} elseif ($action == "delete-multiple-users") {
  $query = "DELETE FROM user WHERE id IN ($id_list_string)";
}

$query_run = mysqli_query($conn, $query);

if ($query_run) {
  echo '{"status": true, "error": null, "action": "'.$action.'", "ids": "'.$id_list_string.'"}';
} else {
  $error_number = mysqli_errno($conn);
  $error_text = mysqli_error($conn);
  echo '{"status": false, "error": {"code": '.$error_number.', "message": '.$error_text.'}}';
}

mysqli_close($conn);