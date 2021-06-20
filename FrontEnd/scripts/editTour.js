//TODO - make sure to check
let tour_id = ""; 

function getTourId(){
    let url = window.location.href;
    let tour_index = url.lastIndexOf("/");
    tour_id = url.substring(tour_index+1);
}

function updateFormId(){
    $("#tour_id").text(tour_id);
}

function valdiateForm(){
    $("form[name='edit_form']").validate({
      // Specify validation rules
      rules: {
        "guide_name" :{
            minlength: 2
        },
        "email":{
          "email" :true
        },
        "phone":{
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
    $('#edit_form').submit(function (event) {
      if(!$("#edit_form").valid()) return;
      $.ajax({
          type: 'PUT', 
          url: '/tours/'+tour_id, 
          contentType: 'application/json',
          data: parseData(),
          processData: false,
          encode: true,
          success: function( data){
            alert("Tour was updated sucssefuly.");
            location.href = "/list";
          },
          error: function(request, status, error){
              console.log( "Error: data was not load properly" + error);
          }
      })
  
      event.preventDefault();
  });
}
  
function parseData(){
    let data = {};
    let start_date = $("#start_date").val().split("-").reverse().join("-");
    let duration = $("#duration").val();
    let price = $("#price").val();
    let guide_name = $("#guide_name").val();
    let email = $("#email").val();
    let cellular = $("#phone").val();

    if(start_date)
        data["start_date"] = start_date;
    if(duration)
        data["duration"] = duration;
    if(price)
        data["price"] = price;
    data["guide"] = {};
    if(guide_name)
        data["guide"].name = guide_name;
    if(email)
        data["guide"].email = email;
    if(cellular)
        data["guide"].cellular = cellular;
    
    if(!data["guide"])
        delete data.guide;

    let result = JSON.stringify(data);
    return result;
}

$(document).ready(function () {
    getTourId();
    updateFormId();
    valdiateForm();
    submitForm();
});
  