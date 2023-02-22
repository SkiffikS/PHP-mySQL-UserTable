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
    let user_names = [];

    $(".user_checkbox:checked").each(function() {
      let userId = $(this).closest("tr").find("#table-user-id").text();
      let userName = $(this).closest("tr").find("#table-user-name").text();
      user_names.push(userName);
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
      if(user_names.length === 1) {
        $("#delete-modat-text").html(`Delete user: ${$("#user-"+edit_user_ids[0]).find("#table-user-name").text()}?`)
      } else {
        $("#delete-modat-text").html(`Delete users: ${user_names.join(', ')}?`)
      }
      $('#deletemodal').modal("show"); // show delete modal
      $("#delete-data-btn").off("click").on("click", function(e) {
        // if user click "delete"
        $("#deletemodal").modal("hide");
        e.preventDefault(); // window to which we will return after func
        ed_data = { // Object edit data
          id_list: edit_user_ids,
          action: action,
          updatedata: true,
        };
        $.ajax({
          type: "POST",
          url: "php/editparams.php",
          data: ed_data,
          success: function(data) {
            let result = JSON.parse(data.replace(/'/g, '"'));
            console.log(result);
            if (result.status === true && result.error === null) {
              for(let user_id = 0; user_id < ed_data.id_list.length; user_id++) {
                let trbody = $("#user-" + ed_data.id_list[user_id]);
                trbody.remove();
              }
            } else if (result.status === false && result.error.code === 140) {
              let ids_list = result.error.ids.split(",");
              if (ids_list.length === 1) {
                let trbody = $("#user-" + ids_list[0]);
                $("#warning-text").html("user " + trbody.find("#table-user-name").text() + " not found");
                $('#multiple-modal').modal("show");
                trbody.remove();
              } else {
                let err_usr_names = [];
                for(let user_id = 0; user_id < ids_list.length; user_id++) {
                  let trbody = $("#user-" + ids_list[user_id]);
                  trbody.remove();
                  let usr_name = trbody.find("#table-user-name").text();
                  err_usr_names.push(usr_name);
                }
                $("#warning-text").html("users " + err_usr_names.join(', ') + " not found");
                $('#multiple-modal').modal("show");
              }
            }
          },
          error: function(data) {
            alert(data);
          }
        });
        $("#selectAll").prop("checked", false); // fix bug (after update data main checkbox active)
        $('.user_checkbox').prop('checked', false);
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
                trbody.find(".fa-circle").addClass("active-circle");
              } else if (action === "set-not-active") {
                trbody.find(".fa-circle").removeClass("active-circle");
              } else {
                alert(action);
              }
            }
            $(".user_checkbox").each(function() {
              if ($(this).closest("tr").find(".fa-circle").hasClass("active-circle")) {
                $(this).val("1");
              } else {
                $(this).val("0");
              }
            });
          } else if (result.status === false && result.error.code === 140) {
            let ids_list = result.error.ids.split(",");
            let err_usr_names = [];
            let error_msg;
            let trbody
            for (let us_id = 0; us_id < ed_data.id_list.length; us_id++) {
              if (ids_list.includes(ed_data.id_list[us_id])) {
                err_usr_names.push(ed_data.id_list[us_id]);
              } else {
                trbody = $("#user-" + ed_data.id_list[us_id]);
                if (result.action === "set-active") {
                  trbody.find(".fa-circle").addClass("active-circle");
                } else if (result.action === "set-not-active") {
                  trbody.find(".fa-circle").removeClass("active-circle");
                } else {
                  alert(action);
                }
              }
            }
            console.log(err_usr_names);
            if (err_usr_names.length === 1) {
              trbody = $("#user-" + err_usr_names[0]);
              error_msg = "user " + trbody.find("#table-user-name").text() + "not found";
            } else {
              let err_user_names = [];
              for (let er_user = 0; er_user < err_usr_names.length; er_user++) {
                trbody = $("#user-" + err_usr_names[er_user]);
                let er_user_name = trbody.find("#table-user-name").text();
                err_user_names.push(er_user_name);
              }
              error_msg = "Users " + err_user_names.join(', ') + "not found"
            }
            $("#warning-text").html(error_msg);
            $("#multiple-modal").modal("show");
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
      $('#user-status').prop('checked', false);
      $('#user-status').val("0");
    } else {
      $("#update_id").val(data[1].text()); // if user in table
      $("#user-first-name").val(data[2].text().split(" ")[0]); // write user data in inputs
      $("#user-last-name").val(data[2].text().split(" ")[1]);
      $("#user-select").val(data[4].text());
      $("#UserModalLabel").html("Edit User"); // modal title
      if(data[3].find(".fa-circle").hasClass("active-circle")) {
        $('#user-status').prop('checked', true);
        $('#user-status').val("1");
      } else {
        $('#user-status').prop('checked', false);
        $('#user-status').val("0");
      }
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

    $(".close-modal").click(function() {
      $("#user-form-modal").modal("hide");
    });

    $("#submit-modal").off("click").on("click", function(e) {
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
            stat = "";
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
                <td class='text-nowrap' id='table-user-name'>${user_data.user_first_name} ${user_data.user_last_name}</td>
                <td class='text-center align-middle'><i class='fa fa-circle ${stat}'></i></td>
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
            } else {
              $("#error-modal-text").html(result.error.message);
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
                <td class='text-nowrap' id='table-user-name'>${user_data.user_first_name} ${user_data.user_last_name}</td>
                <td class='text-center align-middle'><i class='fa fa-circle ${stat}'></i></td>
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
            } else {
              $("#error-modal-text").html(result.error.message);
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
    $("#delete-modat-text").html(`Delete user ${data[2]}?`)

    $("#delete-data-btn").off("click").on("click", function(e) {

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
          } else if (result.status === false && result.error.code === 140) {
            let trbody = $("#user-" + del_data.delete_id);
            trbody.remove();
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
  $(document).on("click", "#selectAll", function() {
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

  $(document).on("click", ".user_checkbox", function() {
    if ($(this).closest("tr").find(".fa-circle").hasClass("active-circle")) {
      $(this).val("1");
    } else {
      $(this).val("0");
    }
  });

  $(document).on("click", ".user_checkbox", function() {
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