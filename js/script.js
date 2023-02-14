// The function of transferring and updating data AJAX
function ajax_request(typeRequest, filePath, editData) {
  $.ajax({
    type: typeRequest,
    url: filePath,
    data: editData,
    success: function(data) {
      $.ajax({
        url: "php/refresh.php", // update data in index file
        method: "GET",
        success: function(data) {
          $("#admin-table-body").html(data); // write new data to table (afrer update)
          location.reload(); // update table buttons (Edit/Delete)
        }
      });
      alert(data); // show result update
    },
    error: function(data) {
      alert(data); // show error result
    }
  });
}

// function correct data in checked users
// (The function is needed because we have 2 select boxes and 2 submit buttons)
function multipleEditFunction(editButton, actionSelect) {

  $(editButton).click(function(e) {

    let action = $(actionSelect).val(); // get action in select bound to button
    let edit_user_ids = []; // list user id if checkbox si checked

    $(".user_checkbox:checked").each(function() {
      let userId = $(this).closest("tr").find("#table-user-id").text();
      edit_user_ids.push(userId); // add id checked user
    });

    if (action === null) {
      // if action no selected
      $("#warning-text").html("No selected action"); // write warming
      $('#multiple-modal').modal("show"); // show warming window
    } else if (edit_user_ids.length === 0) {
      // users not selected
      $("#warning-text").html("No selected users");
      $('#multiple-modal').modal("show");
    } else if (edit_user_ids.length > 0 && action === "delete-multiple-users") {
      // if action delete user
      $('#deletemodal').modal("show"); // show delete modal
      $("#delete-data-btn").click(function(e) {
        // if user click "delete"
        $("#deletemodal").modal("hide");
        e.preventDefault(); // window to which we will return after func
        ed_data = { // Object edit data
          id_list: edit_user_ids,
          action: action,
          updatedata: true,
        };
        ajax_request("POST", "php/editparams.php", ed_data); // challenge AJAX
        $("#selectAll").prop("checked", false); // fix bug (after update data main checkbox active)
      });
    } else {
      // if action "set active" or "set not active"
      ed_data = { // data Object
        id_list: edit_user_ids,
        action: action,
        updatedata: true,
      };
      e.preventDefault();
      ajax_request("POST", "php/editparams.php", ed_data); // challenge AJAX
      $("#selectAll").prop("checked", false); // fix bug (after update data main checkbox active)
    }
  });
}

// start use functions
$(document).ready(function() {

  // update/add data func
  // -----------------------------------------------------------------------------------------------
  $(".editbtn").on("click", function() {

    $tr = $(this).closest("tr"); // get user data

    let data = $tr.children("td").map(function () {
        return $(this);
    }).get(); // Get iser data in object

    if(data[1] === undefined) {
      // if user does not exist
      $("#update_id").val(-1); // set index -1 (for add user in php file)
      $("#user-first-name").val(""); // clear inputs
      $("#user-last-name").val("");
      $("#user-select").val("");
      $("#UserModalLabel").html("Add User"); // modal title
    } else {
      $("#update_id").val(data[1].text()); // if user in table
      $("#user-first-name").val(data[2].text().split(" ")[0]); // write user data in inputs
      $("#user-last-name").val(data[2].text().split(" ")[1]);
      $("#user-select").val(data[4].text());
      $("#UserModalLabel").html("Edit User"); // modal title
    }

    $("#user-form-modal").modal("show"); // show update modal

    $("#user-status-btn").click(function() {
      // update value togle button
      if ($("#user-status").val() == "1") {
        $("#user-status").val("0");
      } else {
        $("#user-status").val("1");
      }
    });

    $("#submit-modal").click(function(e) {
      // click add button

      user_data = { // write all user data for Object
        update_id: $("#update_id").val(),
        user_first_name: $("#user-first-name").val(),
        user_last_name: $("#user-last-name").val(),
        user_status: $("#user-status").val(),
        user_select: $("#user-select").val(),
        updatedata: true
      };

      $("#user-form-modal").modal("hide");
      e.preventDefault(); // return page
      ajax_request("POST", "php/update.php", user_data); // AJAx
    });
  });

  // delete data func
  // -----------------------------------------------------------------------------------------------
  $(".deletebtn").on("click", function () {

    $('#deletemodal').modal("show");
    $tr = $(this).closest("tr"); // data tags

    let data = $tr.children("td").map(function () {
      return $(this).text();
    }).get(); // data in object

    $("#delete_id").val(data[1]); // id user

    $("#delete-data-btn").click(function(e) {

      let del_data = { // delete data
        delete_id: $("#delete_id").val(),
        updatedata: true,
      }

      $("#deletemodal").modal("hide");
      e.preventDefault(); // return window
      ajax_request("POST", "php/delete.php", del_data); // AJAX
    });
  });
  // -----------------------------------------------------------------------------------------------

  // checked functions
  // -----------------------------------------------------------------------------------------------
  $("#selectAll").click(function() {
    // set check or not check if click main checkbox
    if (this.checked) {
      $(".user_checkbox").each(function() {
        this.checked = true;
      });
    } else {
      $(".user_checkbox").each(function() {
        this.checked = false;
      });
    }
  });

  multipleEditFunction("#multiple-edit-btn", "#multiple-action"); // multi update function in header button and select
  multipleEditFunction("#multiple-edit-btn-2", "#multiple-action-2"); // multi update function in footer button and select
  // -----------------------------------------------------------------------------------------------

  // close modals func
  // -----------------------------------------------------------------------------------------------
  $(".close-modal").click(function() {
    $("#user-form-modal").modal("hide");
  });

  $(".close-del-modal").click(function() {
    $("#deletemodal").modal("hide");
  });

  $(".close-war-modal").click(function() {
    $("#multiple-modal").modal("hide");
  });
  // -----------------------------------------------------------------------------------------------
});