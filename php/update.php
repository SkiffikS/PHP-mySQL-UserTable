<?php

require("db.php");

$request = $_REQUEST;

$id = $request["update_id"];
$fname = $request["user_first_name"];
$lname = $request["user_last_name"];
$status = $request["user_status"];
$role = $request["user_select"];

if (!preg_match("/^[\p{Cyrillic}\p{Latin} ]*$/u", $fname) || preg_match('/[0-9]+/', $fname) || $fname == "") {
  // check if fmane not empty, have Cyrillic and Latin letters, dont have numbers
  echo "{status: false, error: {
    code: 136, message: 'incorrect first name'
  }}";
} else if (!preg_match("/^[\p{Cyrillic}\p{Latin} ]*$/u", $lname) || preg_match('/[0-9]+/', $lname) || $lname == "") {
  // check if lmane not empty, have Cyrillic and Latin letters, dont have numbers
  echo "{status: false, error: {
    code: 136, message: 'incorrect last name'
  }}";
} else if ($role == "") {
  // check if action not empty
  echo "{status: false, error: {
    code: 137, message: 'incorrect action'
  }}";
} else {
  if($id == -1) {
    $query = "INSERT INTO user (`first_name`,`last_name`,`status`, `role`) VALUES ('$fname','$lname','$status','$role')";
  } else {
    $query = "UPDATE user SET first_name='$fname', last_name='$lname', status='$status', role='$role' WHERE id='$id'";
  }
  $query_run = mysqli_query($conn, $query);

  if ($query_run) {
    echo "{status: true, error:null, id: $id}";
  } else {
    $error_number = mysqli_errno($conn);
    $error_text = mysqli_error($conn);
    echo "{status: false, error: {
      code: $error_number, message: '$error_text'
    }}";
  }

  mysqli_close($conn);
}
?>