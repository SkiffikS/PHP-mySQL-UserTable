<?php

require("db.php");

$request = $_REQUEST;

$action = $request["action"];
$user_list = $request["id_list"];
$id_list_string = implode(',', $user_list);

if ($action == "set-active") {
  $main_query = "UPDATE user SET status = 1 WHERE id IN ($id_list_string)";
} elseif ($action == "set-not-active") {
  $main_query = "UPDATE user SET status = 0 WHERE id IN ($id_list_string)";
} elseif ($action == "delete-multiple-users") {
  $main_query = "DELETE FROM user WHERE id IN ($id_list_string)";
}

$not_found = array();

foreach ($user_list as $user_id) {
  $sql = "SELECT * FROM user WHERE id = $user_id";
  $result = mysqli_query($conn, $sql);
  if ($result->num_rows == 0) {
    $not_found[] = $user_id;
  }
}

if (count($not_found) === 0) {
  $query_run = mysqli_query($conn, $main_query);
  if ($query_run) {
    echo '{"status": true, "error": null, "action": "'.$action.'", "ids": "'.$id_list_string.'"}';
  } else {
    $error_number = mysqli_errno($conn);
    $error_text = mysqli_error($conn);
    echo '{"status": false, "error": {"code": '.$error_number.', "message": "'.$error_text.'"}}';
  }
} else {
  echo '{"status": false, "error": {"code": 140, "message": "User not found", "ids": "'. implode(',', $not_found) .'"}}';
}

mysqli_close($conn);