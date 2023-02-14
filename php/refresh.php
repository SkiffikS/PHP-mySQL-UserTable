<?php

require("db.php");

$result = mysqli_query($conn, "SELECT * FROM user");

while ($row = mysqli_fetch_array($result)) {
  $id = $row["id"];
  $first_name = $row["first_name"];
  $last_name = $row["last_name"];
  $role = $row["role"];
  if ($row["status"] == 1) {
    $status = "active-circle";
  } else {
    $status = "not-active-circle";
  }
  echo "
  <tr id='$id'>
    <td class='align-middle'>
      <div class='custom-control custom-control-inline custom-checkbox custom-control-nameless m-0 align-top'>
        <input type='checkbox' class='custom-control-input user_checkbox' data-user-id='$id'>
        <label class='custom-control-label' for='checkbox2'></label>
      </div>
    </td>
    <td class='table-id' id='table-user-id'>$id</td>
    <td class='text-nowrap'>$first_name $last_name</td>
    <td class='text-center align-middle'><i class='fa fa-circle' id='$status'></i></td>
    <td class='text-nowrap align-middle'>$role</td>
    <td class='text-center align-middle'>
      <div class='btn-group align-top'>
        <button class='btn btn-sm btn-outline-secondary editbtn'>Edit</button>
        <button href='#deleteEmployeeModal' class='btn btn-sm btn-outline-secondary deletebtn' type='button' data-toggle='modal'><i class='fa fa-trash update' title='Delete'></i></button>
      </div>
    </td>
  </tr>
  ";
}

mysqli_close($conn);

?>