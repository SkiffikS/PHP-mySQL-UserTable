// function correct data in checked users
// (The function is needed because we have 2 select boxes and 2 submit buttons)
function multipleEditFunction(editButton, actionSelect) {

  $(editButton).click(function(e) {

    let action = $(actionSelect).val(); // get action in select bound to button
    let editUserIDS = []; // list user id if checkbox si checked
    let editUserNames = [];

    // in all active check box get id and name
    $(".user_checkbox:checked").each(function() {
      let userId = $(this).closest("tr").find("#table-user-id").text();
      let userName = $(this).closest("tr").find("#table-user-name").text();
      editUserNames.push(userName);
      editUserIDS.push(userId); // add id checked user
    });

    editData = { // Object edit data
      id_list: editUserIDS,
      action: action,
      updatedata: true,
    };

    if (action === null) {
      // if action no selected
      $("#warning-text").html("No selected action"); // write warming
      $('#multiple-modal').modal("show"); // show warming window
    } else if (editUserIDS.length === 0) {
      // users not selected
      $("#warning-text").html("No selected users");
      $('#multiple-modal').modal("show");
    } else if (editUserIDS.length > 0 && action === "delete-multiple-users") {
      // if action delete user
      if(editUserNames.length === 1) {
        $("#delete-modat-text").html(`Delete user: ${$("#user-" + editUserIDS[0]).find("#table-user-name").text()}?`)
      } else {
        $("#delete-modat-text").html(`Delete users: ${editUserNames.join(', ')}?`)
      }
      $('#deletemodal').modal("show"); // show delete modal
      $("#delete-data-btn").off("click").on("click", function(e) {
        // if user click "delete"
        $("#deletemodal").modal("hide");
        e.preventDefault(); // window to which we will return after func

        $.ajax({
          type: "POST",
          url: "php/editparams.php",
          data: editData,
          dataType: 'json',
          success: function(result) {
            if (result.status === true && result.error === null) {
              for (let user_id of editData.id_list) {
                let trbody = $(`tr[data-user='${user_id}']`);
                trbody.remove();
              }
            } else if (result.status === false && result.error.code === 140) {
              let ids_list = result.error.ids.split(",");
              if (ids_list.length === 1) {
                let trbody = $(`tr[data-user='${ids_list[0]}']`);
                let userName = trbody.find("#table-user-name").text();
                $("#warning-text").html(`user ${userName} not found`);
                $('#multiple-modal').modal("show");
                trbody.remove();
              } else {
                let errorUserNames = [];
                for (let user_id of ids_list) {
                  let trbody = $($(`tr[data-user='${user_id}']`));
                  trbody.remove();
                  let userName = trbody.find("#table-user-name").text();
                  errorUserNames.push(userName);
                }
                $("#warning-text").html(`users ${errorUserNames.join(', ')} not found`);
                $('#multiple-modal').modal("show");
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
      });
    } else {

      e.preventDefault();

      $.ajax({
        type: "POST",
        url: "php/editparams.php",
        data: editData,
        dataType: 'json',
        success: function(result) {
          if (result.status === true && result.error === null) {
            for(let userId in editData.id_list) {
              let trBody = $(`tr[data-user='${editData.id_list[userId]}']`);
              if (action === "set-active") {
                trBody.find(".fa-circle").addClass("active-circle");
              } else if (action === "set-not-active") {
                trBody.find(".fa-circle").removeClass("active-circle");
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
            let idsList = result.error.ids.split(",");
            let errUserNames = [];
            let errorMsg;
            let trBody;
            for (let userId in editData.id_list) {
              if (idsList.includes(editData.id_list[userId])) {
                errUserNames.push(editData.id_list[userId]);
              } else {
                trBody = $(`tr[data-user='${editData.id_list[userId]}']`);
                if (result.action === "set-active") {
                  trBody.find(".fa-circle").addClass("active-circle");
                } else if (result.action === "set-not-active") {
                  trBody.find(".fa-circle").removeClass("active-circle");
                } else {
                  alert(action);
                }
              }
            }

            if (errUserNames.length === 1) {
              trBody = $(`tr[data-user='${errUserNames[0]}']`);
              errorMsg = `User ${trBody.find("#table-user-name").text()} not found`;
            } else {
              let errUserNamesArr = [];
              for (let userIndex in errUserNames) {
                trBody = $(`tr[data-user='${errUserNames[userIndex]}']`);
                let userName = trBody.find("#table-user-name").text();
                errUserNamesArr.push(userName);
              }
              errorMsg = `Users ${errUserNamesArr.join(', ')} not found`;
            }
            $("#warning-text").html(errorMsg);
            $("#multiple-modal").modal("show");
          } else {
            alert(result.error.message);
          }
        },
        error: function(data) {
          console.log(data);
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

    let user = {
      id: -1,
      firstName: "",
      lastName: "",
      role: "",
      active: "0",
    };

    let $tr = $(this).closest("tr");
    let data = $tr.children("td").map(function() {
      return $(this);
    }).get();

    if (data[1] === undefined) {
      $("#UserModalLabel").html("Add User");
    } else {
      $("#UserModalLabel").html("Edit User");
      user.id = parseInt(data[1].text());
      user.firstName = data[2].text().split(" ")[0];
      user.lastName = data[2].text().split(" ")[1];
      user.role = data[4].text();
      if(data[3].find(".fa-circle").hasClass("active-circle")) {
        user.active = "1";
      }
    }

    $("#user-first-name").val(user.firstName);
    $("#user-last-name").val(user.lastName);
    $("#user-select").val(user.role);
    $("#user-status").val(user.active);
    $('#user-status').prop('checked', user.active === "1");

    $("#error-modal-text").html("");
    $("#user-form-modal").modal("show"); // show update modal

    $('#user-status').click(function() {
      if ($(this).prop("checked")) {
        $(this).val("1");
      } else {
        $(this).val("0");
      }
    });

    $("#submit-modal").off("click").on("click", function(e) {

      e.preventDefault();

      user.firstName = $("#user-first-name").val();
      user.lastName = $("#user-last-name").val();
      user.role = $("#user-select").val();
      user.active = $("#user-status").val();

      $.ajax({
        type: "POST",
        url: "php/update.php",
        data: user,
        dataType: 'json',
        success: function(result) {
          let tbody = $("#admin-table-body");
          let stat = "";
          let newhtml = "";
          let errorObj = result.error;

          if(user.active === "1") {
            stat = "active-circle";
          }

          if ($(`tr[data-user='${user.id}']`).length > 0) {
            if(result.status === true && result.error === null) {
              newhtml = `
              <td class='align-middle'>
                <div class='custom-control custom-control-inline custom-checkbox custom-control-nameless m-0 align-top'>
                  <input type='checkbox' class='custom-control-input user_checkbox' data-user-id='${result.id}'>
                  <label class='custom-control-label' for='checkbox2'></label>
                </div>
              </td>
              <td class='table-id' id='table-user-id'>${result.id}</td>
              <td class='text-nowrap' id='table-user-name'>${user.firstName} ${user.lastName}</td>
              <td class='text-center align-middle'><i class='fa fa-circle ${stat}'></i></td>
              <td class='text-nowrap align-middle'>${user.role}</td>
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
              <tr data-user='$id'>
                <td class='align-middle'>
                  <div class='custom-control custom-control-inline custom-checkbox custom-control-nameless m-0 align-top'>
                    <input type='checkbox' class='custom-control-input user_checkbox' data-user-id='${result.id}'>
                    <label class='custom-control-label' for='checkbox2'></label>
                  </div>
                </td>
                <td class='table-id' id='table-user-id'>${result.id}</td>
                <td class='text-nowrap' id='table-user-name'>${user.firstName} ${user.lastName}</td>
                <td class='text-center align-middle'><i class='fa fa-circle ${stat}'></i></td>
                <td class='text-nowrap align-middle'>${user.role}</td>
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

      let deleteData = { // delete data
        delete_id: $("#delete_id").val(),
        updatedata: true,
      }

      $.ajax({
        type: "POST",
        url: "php/delete.php",
        data: deleteData,
        dataType: 'json',
        success: function(result) {
          if (result.status === true && result.error === null) {
            $(`tr[data-user='${result.id}']`).remove();
          } else if (result.status === false && result.error.code === 140) {
            let trbody = $(`tr[data-user='${deleteData.delete_id}']`);
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