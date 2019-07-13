$(document).ready(function () {
    console.log("jquery works");
    $(".modal").modal();

// Code for opening page alert box
$('#alert_close').click(function(){
    $( "#alert_box" ).fadeOut( "slow", function() {
    });
  });


  // Here is the URL to query the database
  var queryURLInspire = "https://ron-swanson-quotes.herokuapp.com/v2/quotes";

  //Here we run the AJAX call to get the inspirational quote API
  $.ajax({
      url: queryURLInspire,
      method: "GET"
  })

  // Store all of the retrieved data inside of an object called response
    .then(function(response){
        
        //Log the queryURLInspire
        console.log(queryURLInspire);

        // Log the quote
        console.log(response[0]);

        // Transfer content to HTML
        $("#quote-of-the-day").text('"' + response[0] + '"');
    })
});