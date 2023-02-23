<div class="e-table">
  <div class="table-responsive table-lg mt-3">

    <!-- main table -->
    <table class="table table-bordered" id="user-table">

      <!-- header table -->
      <thead>
        <tr>
          <th class="align-top"> <!-- Select box in headet -->
            <div class="custom-control custom-control-inline custom-checkbox custom-control-nameless m-0">
              <input type="checkbox" class="custom-control-input" id="selectAll">
              <label class="custom-control-label" for="selectAll"></label>
            </div>
          </th>
          <th class="table-id">ID</th> <!-- User ID (display none) for parsing to edit data -->
          <th class="max-width">Name</th>
          <th class="text-center">Status</th>
          <th class="sortable">Role</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <!-- header table -->

      <!-- body table -->
      <tbody id="admin-table-body">
        <?php
          $result = mysqli_query($conn, "SELECT * FROM user"); // add all users in database
          while ($row = mysqli_fetch_array($result)) { // get one row
            // get data in one user
            $id = $row["id"];
            $first_name = $row["first_name"];
            $last_name = $row["last_name"];
            $role = $row["role"];
            $status = "";
            if ($row["status"] == 1) { // status style
              $status = "active-circle";
            }
            echo "
            <tr data-user='$id'>
              <td class='align-middle'>
                <div class='custom-control custom-control-inline custom-checkbox custom-control-nameless m-0 align-top'>
                  <input type='checkbox' class='custom-control-input user_checkbox' data-user-id='$id'>
                  <label class='custom-control-label' for='checkbox2'></label>
                </div>
              </td>
              <td class='table-id' id='table-user-id'>$id</td>
              <td class='text-nowrap' id='table-user-name'>$first_name $last_name</td>
              <td class='text-center align-middle'><i class='fa fa-circle $status'></i></td>
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
        ?>
      </tbody>
      <!-- body table -->

    </table>
    <!-- main table -->

  </div>
  </div>