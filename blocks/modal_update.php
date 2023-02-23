<!-- MODAL TO ADD/EDIT DATA -->
<div class="modal fade" id="user-form-modal" tabindex="-1" aria-labelledby="UserModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <form action="php/update.php" method="post">
        <div class="modal-header">
          <h5 class="modal-title" id="UserModalLabel"></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="update_id" name="update_id">
          <div class="mb-3">
            <label for="first-name" class="form-label">First Name:</label>
            <input type="text" class="form-control" id="user-first-name" name="user-first-name">
          </div>
          <div class="mb-3">
            <label for="last-name" class="form-label">Last Name:</label>
            <input type="text" class="form-control" id="user-last-name" name="user-last-name">
          </div>
          <div class="row g-3 mb-3">
            <div class="col-6">
              <label for="user-status" class="form-label">User status</label>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="user-status" name="user-status" value="0">
                <label class="form-check-label" for="user-status"></label>
              </div>
            </div>
            <div class="col-6">
              <label for="user-select" class="form-label">User Role</label>
              <select class="form-select" id="user-select" name="user-select">
                <option value="" disabled selected>-Please Select-</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
          </div>
          <div class="col mb-1 text-center text-danger" id="error-modal-text"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary" name="updatedata" id="submit-modal">Save</button>
        </div>
      </form>
    </div>
  </div>
</div>
<!-- MODAL TO ADD/EDIT DATA -->