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