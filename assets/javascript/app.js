var firebaseConfig = {
    apiKey: "AIzaSyAmDiUqF9z_nZtpURpAqqO0GMN0oH1jyfY",
    authDomain: "project1-cool-group.firebaseapp.com",
    databaseURL: "https://project1-cool-group.firebaseio.com",
    projectId: "project1-cool-group",
    storageBucket: "project1-cool-group.appspot.com",
    messagingSenderId: "740454389985",
    appId: "1:740454389985:web:a93be9c7139cf559"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// VARIABLES
// =============

var database = firebase.database();
var userID;

// FUNCTIONS
// =============

// (Santiago) This checks if user is logged in, then runs certain tasks. 
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        userID = firebase.auth().currentUser.uid;
        console.log(userID);
        pushTask(userID);
        renderTasks(userID); 
    } else {
        // No user is signed in.
        console.log("you need to log in");
    }
});

// Firebase Authentication - Log In With Google
function googleLogin() {
    // This tells firebase we're using Google as the authentication method. 
    const provider = new firebase.auth.GoogleAuthProvider();
    // This is the sign-in method we want to use (pop up method)
    firebase.auth().signInWithPopup(provider).then(
        result => {
            const user = result.user
            $("#opening-message-content").prepend("Hello, " + firebase.auth().currentUser.displayName + "!");

            pushTask(userID);
            renderTasks(userID);
        });

}

// (Santiago) This grabs the userID and adds the task to their own collection
function pushTask(id) {
    // Add task to firebase 
    $("#add-item").on("submit", function (event) {
        // prevent the page from refreshing
        event.preventDefault();

        // Gets the value from the task input
        var task = $("#toDoItem").val().trim();
        var status = "toDo";

        // Pushes task into database 'collection' associated with user (userID)
        database.ref(id).push({
            task: task,
            status: status
        });
        //clears the form field after user clicks Add item
        document.getElementById('toDoItem').value = '';

    });
}

// (Santiago) This grabs the userID and displays the tasks
function renderTasks(id) {
    $("#toDoCollection").empty();
    $("#completed-tasks").empty();
    // Grab user tasks from firebase and add them to page.
    database.ref(id).on("child_added", function (snapshot) {

        // Create Materialize collection item
        var collectionItem = $("<p>");
        collectionItem.addClass("collection-item");
        //(Eric) add unique ID to "p" that matches db; may remove
        var taskSpan = $("<span>");
        taskSpan.text(snapshot.val().task);
        var deleteBtn = $("<button>");
        deleteBtn.text("Delete");
        deleteBtn.attr({
            class: "btn-small red right delete",
            id: snapshot.key,
            "data-delete": id + "/" + snapshot.key
        });

        if (snapshot.val().status === "done") {
            collectionItem.append(taskSpan, deleteBtn);
            $("#completed-tasks").append(collectionItem);
        } else {

            var doneBtn = $("<button>");
            doneBtn.text("Done");
            doneBtn.attr({
                class: "btn-small right done",
                id: snapshot.key,
                "data-done": id + "/" + snapshot.key
            });

            collectionItem.append(taskSpan, deleteBtn, doneBtn);
            // Add Materialize collection item to list
            $("#toDoCollection").append(collectionItem);
        }

    });
}

// done button click event
$(document).on("click", ".done", function () {
    var done = "done";
    database.ref($(this).data("done")).update({
        status: done,
    });
    pushTask(userID);
    renderTasks(userID);
});

// delete button click event
$(document).on("click", ".delete", function () {
    var targetPath = $(this).data("delete");
    console.log(targetPath);
    database.ref(targetPath).remove();
    renderTasks(userID);
});

$(document).ready(function () {
    // Triggers modal
    $(".modal").modal();

    // Code for opening page alert box
    $('#alert_close').click(function () {
        $("#alert_box").fadeOut("slow", function () {
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
        .then(function (response) {

            // Transfer content to HTML
            $("#quote-of-the-day").text('"' + response[0] + '"');
        });
});

//If all tasks are checked complete, then run dialog function
// document.getElementById("myBtn").addEventListener("click", function() {
 // alert("Hello World!");
// });

        //This displays the Congratulations message
/*   var queryURL = "https://www.boredapi.com/api/activity/"

   $(function() {
       $( "#dialog" ).dialog();

       $.ajax({
           url: queryURL,
           method: "GET"
           }).then(function(response) {

           var boredIdea = response.activity;

           apiMsg.append(boredIdea +".");
       });
       }); */
   // });
