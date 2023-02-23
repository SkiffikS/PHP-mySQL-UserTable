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
                <?php
                  // import table
                  require("blocks/table_header.php");
                  require("blocks/table_body.php");
                  require("blocks/table_footer.php");
                ?>
              </div>
            </div>
          </div>
        </div>

        <?php
          // import modals
          require("blocks/modal_update.php");
          require("blocks/modal_delete.php");
          require("blocks/modal_warming.php");
        ?>

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