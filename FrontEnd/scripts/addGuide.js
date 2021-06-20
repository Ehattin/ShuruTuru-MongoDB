function valdiateForm(){
    $("form[name='guide_form']").validate({
      // Specify validation rules
      rules: {
        "guide_name":{
          required: true,
          minlength: 2
        },
        "email":{
          required: true,
          "email" :true
        },
        "phone":{
          required: true,
          minlength: 9
        },
      },
  
      // Specify validation error messages
      messages: {
        guide_name:{
          minlength: "Guide name must be at least 2 characters long"
        },
        phone:{
          minlength: "Phone must be at least 9 characters long"
        },
        email: "email structure is some@domain "
      },
    });
  }
  
  function submitForm(){
    $('#guide_form').submit(function (event) {
      if(!$("#guide_form").valid()) return;
      $.ajax({
          type: 'POST', 
          url: '/guide', 
          contentType: 'application/json',
          data: JSON.stringify({
              "guide": {
                "name" : $("#guide_name").val(),
                "email" : $("#email").val(),
                "cellular" : $("#phone").val(),
            },
            "path": []
          }),
          processData: false,
          encode: true,
          success: function( data){
            alert("Guide was added successfully.");
            location.href = "/list";
          },
          error: function(request, status, error){
              console.log( "Error: data was not loaded properly" + error);
          }
      })
      event.preventDefault();
  });
  }
  
  $(document).ready(function () {
    valdiateForm();
    submitForm();
  });
  