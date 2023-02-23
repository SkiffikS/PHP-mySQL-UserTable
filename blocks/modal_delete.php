<!-- DELETE DATA MODAL -->
<div class="modal fade" id="deletemodal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="deleteModalLabel">Delete</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form action="php/delete.php" method="post">
        <div class="modal-body">
          <input type="hidden" name="delete_id" id="delete_id">
          <h4 id="delete-modat-text"></h4>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
          <button type="submit" name="deletedata" class="btn btn-danger" id="delete-data-btn">Delete it</button>
        </div>
      </form>
    </div>
  </div>
</div>
<!-- DELETE DATA MODAL -->