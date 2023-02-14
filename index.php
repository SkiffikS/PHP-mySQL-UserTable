<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>Users table</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- import bootstrap styles, fonts -->
  <link rel="icon" type="image/x-icon" href="https://softsprint.net/wp-content/themes/softsprint/img/logo.png">
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
  <!-- import bootstrap styles, fonts -->

  <!-- import bootstrap bootstrap script, jquery -->
  <script src="https://code.jquery.com/jquery-3.6.3.js" integrity="sha256-nQLuAZGRRcILA+6dMBOvcRh5Pe310sBpanc6+QBmyVM=" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
  <!-- import bootstrap bootstrap script, jquery -->

  <!-- import my css -->
  <link href="css/style.css" rel="stylesheet">
  <!-- import my css -->
</head>

<body>
  <?php
    require("php/db.php"); // database file
  ?>
  <div class="container">
    <div class="row flex-lg-nowrap">
      <div class="col mt-5">
        <div class="row flex-lg-nowrap">
          <div class="col mb-3">
            <div class="e-panel card">
              <div class="card-body">
                <div class="card-title text-center">
                  <div class="h-auto">

                    <!-- header block for add/edit users -->
                    <form class="row" action="php/editparams.php" method="post">
                      <div class="col">
                        <button type="button" class="btn btn-primary w-100 h-75 editbtn">add</button>
                      </div>
                      <div class="col">
                        <select class="form-select form-select-lg mb-3 w-100 h-75 text-center" id="multiple-action" aria-label=".form-select-lg example">
                          <option value="" disabled selected>-Please Select-</option>
                          <option value="set-active">Set active</option>
                          <option value="set-not-active">Set not active</option>
                          <option value="delete-multiple-users">Delete</option>
                        </select>
                      </div>
                      <div class="col">
                        <button type="button" class="btn btn-success w-100 h-75" id="multiple-edit-btn">ok</button>
                      </div>
                    </form>
                    <!-- header block for add/edit users -->

                  </div>
                </div>
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
                            if ($row["status"] == 1) { // status style
                              $status = "active-circle";
                            } else {
                              $status = "not-active-circle";
                            }

                            // return user row to table
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
                        ?>
                      </tbody>
                      <!-- body table -->

                    </table>
                    <!-- main table -->

                  </div>
                </div>
                <div class="card-title text-center">

                  <!-- footer block for add/edit users -->
                  <form class="row" action="php/editparams.php" method="post">
                    <div class="col">
                      <button type="button" class="btn btn-primary w-100 h-75 editbtn">add</button>
                    </div>
                    <div class="col">
                      <select class="form-select form-select-lg mb-3 w-100 h-75 text-center" id="multiple-action-2" aria-label=".form-select-lg example">
                        <option value="" disabled selected>-Please Select-</option>
                        <option value="set-active">Set active</option>
                        <option value="set-not-active">Set not active</option>
                        <option value="delete-multiple-users">Delete</option>
                      </select>
                    </div>
                    <div class="col">
                      <button type="button" class="btn btn-success w-100 h-75" id="multiple-edit-btn-2">ok</button>
                    </div>
                  </form>
                  <!-- footer block for add/edit users -->

                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL TO ADD/EDIT DATA -->
        <div class="modal fade" id="user-form-modal" tabindex="-1" aria-labelledby="user-form-modal" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="UserModalLabel"></h5>
                <button type="button" class="close-modal" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div class="modal-body">
                <form action="php/update.php" method="post">
                  <input type="hidden" id="update_id" name="update_id">
                  <div class="form-group">
                    <label for="first-name" class="col-form-label">First Name:</label>
                    <input type="text" class="form-control md-in" id="user-first-name" name="user-first-name">
                  </div>
                  <div class="form-group">
                    <label for="last-name" class="col-form-label">Last Name:</label>
                    <input type="text" class="form-control md-in" id="user-last-name" name="user-last-name">
                  </div>
                  <div class="row mt-3 mb-3">
                    <div class="col w-50 h-25 pt-md-2">
                      <div class="row w-100">
                        <div class="col w-50 pt-md-1">User status</div>
                        <div class="col w-50">
                          <label class="switch">
                            <input type="checkbox" id="user-status" name="user-status" value="0">
                            <span class="slider round" id="user-status-btn"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="col w-50 text-center">
                      <select class="form-select form-select-lg mb-3 w-100 h-75 text-center md-in" id="user-select" name="user-select">
                        <option value="" disabled selected>-Please Select-</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                      </select>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary close-modal" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" name="updatedata" id="submit-modal">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <!-- MODAL TO ADD/EDIT DATA -->

        <!-- DELETE DATA MODAL -->
        <div class="modal fade" id="deletemodal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel"> Delete </h5>
                <button type="button" class="close close-del-modal" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <form action="php/delete.php" method="post">
                <div class="modal-body">
                  <input type="hidden" name="delete_id" id="delete_id">
                  <h4> Delete this Data?</h4>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary close-del-modal" data-dismiss="modal"> No </button>
                  <button type="submit" name="deletedata" class="btn btn-primary" id="delete-data-btn"> Delete it. </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <!-- DELETE DATA MODAL -->

        <!-- WARMING MODAL FOR MULTIPLE EDIT -->
        <div class="modal fade" id="multiple-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel"> Warning </h5>
                <button type="button" class="close close-war-modal" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
                <div class="modal-body">
                  <h4 id="warning-text"></h4>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary close-war-modal" data-dismiss="modal"> Ok </button>
                </div>
            </div>
          </div>
        </div>
         <!-- WARMING MODAL FOR MULTIPLE EDIT -->

        </div>
      </div>
    </div>
  </div>

  <!-- my script file -->
  <script src="js/script.js"></script>

  <?php
    mysqli_close($conn); // close database
  ?>

</body>

</html>