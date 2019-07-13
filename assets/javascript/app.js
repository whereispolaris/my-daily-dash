$(document).ready(function () {

//Start code for app
console.log("jquery works");

//add Task modal
$(".modal").modal();
       
//This displays the Congratulations message
   
  //  var boredIdea="";
    var queryURL = "https://www.boredapi.com/api/activity/"

    $(function() {
        $( "#dialog" ).dialog();

        $.ajax({
            url: queryURL,
            method: "GET"
          }).then(function(response) {

            var boredIdea = response.activity;

            apiMsg.append(boredIdea);
        });

  
  
//This is the end of the doc ready function
});

});