function valdiateForm(){
  $("form[name='tour_form']").validate({
    // Specify validation rules
    rules: {
      "tour_id":{
        required: true,
        minlength: 1
      },
      "start_date": {
        required: true,
      },
      "duration": {
        required: true,
      },
      "price": {
        required: true,
      },
      "guide_name":{
        required: true,
        minlength: 2
      },
    },

    // Specify validation error messages
    messages: {
      tour_id:{
        minlength: "Id must be at least 1 characters long"
      },
      guide_name:{
        minlength: "Guide name must be at least 2 characters long"
      },

    },
  });
}

function submitForm(){
  $('#tour_form').submit(function (event) {
    if(!$("#tour_form").valid()) return;
    $.ajax({
        type: 'POST', 
        url: '/tour', 
        contentType: 'application/json',
        data: JSON.stringify({
            "id": $("#tour_id").val(),
            "start_date": $("#start_date").val().split("-").reverse().join("-"),
            "duration": $("#duration").val(),
            "price": $("#price").val(),
            "guide": {
              "name" : $("#guide_name").val(),
          },
          "path": []
        }),
        processData: false,
        encode: true,
        success: function( data){
          alert("Tour was added sucssefuly.");
          location.href = "/list";
        },
        error: function(request, status, error){
            console.log( "Error: data was not load properly" + error);
        }
    })
    event.preventDefault();
});
}

$(document).ready(function () {
  valdiateForm();
  submitForm();
});
