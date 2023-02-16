// The function of transferring and updating data AJAX
function ajax_request(typeRequest, filePath, editData) {
  $.ajax({
    type: typeRequest,
    url: filePath,
    data: editData,
    success: function(data) {
      return data;
    },
    error: function(data) {
      alert(data);
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

      $.ajax({
        type: "POST",
        url: "php/editparams.php",
        data: ed_data,
        success: function(data) {
          let result = JSON.parse(data.replace(/'/g, '"'));
          if (result.status === true && result.error === null) {
            for(let user_id = 0; user_id < ed_data.id_list.length; user_id++) {
              let trbody = $("#user-" + ed_data.id_list[user_id]);
              if (action === "set-active") {
                trbody.find(".fa-circle").attr("id", "active-circle");
              } else if (action === "set-not-active") {
                trbody.find(".fa-circle").attr("id", "not-active-circle");
              } else if (action === "delete-multiple-users") {
                trbody.remove();
              } else {
                alert(action);
              }
            }
          } else {
            alert(result.error.message);
          }
        },
        error: function(data) {
          alert(data);
        }
      });
      $("#selectAll").prop("checked", false); // fix bug (after update data main checkbox active)
      $('.user_checkbox').prop('checked', false);
    }
  });
}

// start use functions
$(document).ready(function() {

  // update/add data func
  // -----------------------------------------------------------------------------------------------
  $(document).on("click", ".editbtn", function() {

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
    $("#error-modal-text").html("");

    $("#user-form-modal").modal("show"); // show update modal

    $('#user-status').click(function() {
      if ($(this).prop("checked")) {
        $(this).val("1");
      } else {
        $(this).val("0");
      }
    });

    $("#submit-modal").click(function(e) {
      // click add button

      e.preventDefault();

      user_data = { // write all user data for Object
        update_id: $("#update_id").val(),
        user_first_name: $("#user-first-name").val(),
        user_last_name: $("#user-last-name").val(),
        user_status: $("#user-status").val(),
        user_select: $("#user-select").val(),
        updatedata: true,
      };

      $.ajax({
        type: "POST",
        url: "php/update.php",
        data: user_data,
        success: function(data) {
          let result = JSON.parse(data.replace(/'/g, '"'));
          let tbody = $("#admin-table-body");
          let stat;
          let newhtml;
          let errorObj = result.error;

          if(user_data.user_status === "1") {
            stat = "active-circle";
          } else {
            stat = "not-active-circle";
          }

          if ($(`#user-${result.id}`).length > 0) {
            if(result.status === true && result.error === null) {
              newhtml = `
                <td class='align-middle'>
                  <div class='custom-control custom-control-inline custom-checkbox custom-control-nameless m-0 align-top'>
                    <input type='checkbox' class='custom-control-input user_checkbox' data-user-id='${result.id}'>
                    <label class='custom-control-label' for='checkbox2'></label>
                  </div>
                </td>
                <td class='table-id' id='table-user-id'>${result.id}</td>
                <td class='text-nowrap'>${user_data.user_first_name} ${user_data.user_last_name}</td>
                <td class='text-center align-middle'><i class='fa fa-circle' id='${stat}'></i></td>
                <td class='text-nowrap align-middle'>${user_data.user_select}</td>
                <td class='text-center align-middle'>
                  <div class='btn-group align-top'>
                    <button class='btn btn-sm btn-outline-secondary editbtn'>Edit</button>
                    <button href='#deleteEmployeeModal' class='btn btn-sm btn-outline-secondary deletebtn' type='button' data-toggle='modal'><i class='fa fa-trash update' title='Delete'></i></button>
                  </div>
                </td>
              `;
              $(`#user-${result.id}`).html(newhtml);
              $("#user-form-modal").modal("hide");
            } else if(result.status === false && result.error !== null) {
              $("#error-modal-text").html(errorObj.message);
            }
          } else {
            if(result.status === true && result.error === null) {
              newhtml = `
              <tr id='user-${result.id}'>
                <td class='align-middle'>
                  <div class='custom-control custom-control-inline custom-checkbox custom-control-nameless m-0 align-top'>
                    <input type='checkbox' class='custom-control-input user_checkbox' data-user-id='${result.id}'>
                    <label class='custom-control-label' for='checkbox2'></label>
                  </div>
                </td>
                <td class='table-id' id='table-user-id'>${result.id}</td>
                <td class='text-nowrap'>${user_data.user_first_name} ${user_data.user_last_name}</td>
                <td class='text-center align-middle'><i class='fa fa-circle' id='${stat}'></i></td>
                <td class='text-nowrap align-middle'>${user_data.user_select}</td>
                <td class='text-center align-middle'>
                  <div class='btn-group align-top'>
                    <button class='btn btn-sm btn-outline-secondary editbtn'>Edit</button>
                    <button href='#deleteEmployeeModal' class='btn btn-sm btn-outline-secondary deletebtn' type='button' data-toggle='modal'><i class='fa fa-trash update' title='Delete'></i></button>
                  </div>
                </td>
              </tr>
              `;
              tbody.append(newhtml);
              $("#user-form-modal").modal("hide");
            } else if(result.status === false && result.error !== null) {
              $("#error-modal-text").html(errorObj.message);
            }
          }
        },
        error: function(data) {
          alert(data);
        }
      });
    });
  });

  // delete data func
  // -----------------------------------------------------------------------------------------------
  $(document).on("click", ".deletebtn", function () {

    $('#deletemodal').modal("show");
    $tr = $(this).closest("tr"); // data tags

    let data = $tr.children("td").map(function () {
      return $(this).text();
    }).get(); // data in object

    $("#delete_id").val(data[1]); // id user

    $("#delete-data-btn").click(function(e) {

      e.preventDefault();

      let del_data = { // delete data
        delete_id: $("#delete_id").val(),
        updatedata: true,
      }

      $.ajax({
        type: "POST",
        url: "php/delete.php",
        data: del_data,
        success: function(data) {
          let result = JSON.parse(data.replace(/'/g, '"'));
          if (result.status === true && result.error === null) {
            $(`#user-${result.id}`).remove();
          } else {
            alert(result.error.message);
          }
        },
        error: function(data) {
          alert(data);
        }
      });

      $("#deletemodal").modal("hide");

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

  $(".user_checkbox").click(function () {
    if ($('.user_checkbox:checked').length === $('.user_checkbox').length) {
      $('#selectAll').prop('checked', true);
    } else {
      $('#selectAll').prop('checked', false);
    }
  })

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