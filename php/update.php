<?php

require("db.php");

$request = $_REQUEST;

$id = $request["update_id"];
$fname = $request["user_first_name"];
$lname = $request["user_last_name"];
$status = $request["user_status"];
$role = $request["user_select"];

if (!preg_match("/^[a-zA-Zа-яА-Я ]*$/u", $fname) || $fname == "") {
  // check if fmane not empty, have Cyrillic and Latin letters, dont have numbers
  echo '{"status": false, "error": {"code": 136, "message": "incorrect first name"}}';
} else if (!preg_match("/^[a-zA-Zа-яА-Я ]*$/u", $lname) || $lname == "") {
  // check if lmane not empty, have Cyrillic and Latin letters, dont have numbers
  echo '{"status": false, "error": {"code": 137, "message": "incorrect last name"}}';
} else if ($role == "") {
  // check if action not empty
  echo '{"status": false, "error": {"code": 138, "message": "incorrect User Type"}}';
} else {
  if($id == -1) {
    $query = "INSERT INTO user (`first_name`,`last_name`,`status`, `role`) VALUES ('$fname','$lname','$status','$role')";
    $query_run = mysqli_query($conn, $query);

    if ($query_run) {
      $query_get = "SELECT * FROM user ORDER BY id DESC LIMIT 1";
      $result = mysqli_query($conn, $query_get);
      if($result) {
        $row = mysqli_fetch_array($result);
        $new_id = $row["id"];
        echo '{"status": true, "error": null, "id": '.$new_id.'}';
      } else {
        $error_number = mysqli_errno($conn);
        $error_text = mysqli_error($conn);
        echo '{"status": false, "error": {"code": '.$error_number.', "message": "$error_text"}}';
      }
    } else {
      $error_number = mysqli_errno($conn);
      $error_text = mysqli_error($conn);
      echo '{"status": false, "error": {"code": '.$error_number.', "message": "$error_text"}}';
    }
  } else {
    $query = "UPDATE user SET first_name='$fname', last_name='$lname', status='$status', role='$role' WHERE id='$id'";
    $result = mysqli_query($conn, $query);
    if($result) {
      echo '{"status": true, "error": null, "id": '.$id.'}';
    } else {
      $error_number = mysqli_errno($conn);
      $error_text = mysqli_error($conn);
      echo '{"status": false, "error": {"code": '.$error_number.', "message": "$error_text"}}';
    }
  }
}

mysqli_close($conn);
?>