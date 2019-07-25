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
var toDoNum = 0;
// This displays the Congrats Message
var queryURL = "https://www.boredapi.com/api/activity";
// FUNCTIONS
// =============

$("#taskBtn").hide();
$("#googleBtn").hide();

//Congrats message function
function congratsMessage() {
    $("#dialog").dialog();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var boredIdea = response.activity;
        apiMsg.append(boredIdea + ".");
    });
};


// (Santiago) This checks if user is logged in, then runs certain tasks. 
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        userID = firebase.auth().currentUser.uid;
        console.log(userID);
        $("#taskBtn").show();

        renderTasks(userID);

    } else {
        // No user is signed in.
        console.log("Log in to add tasks.");
        $("#googleBtn").show();
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

            emptyTasks();
            renderTasks(userID);
        });

}

// (Santiago) This grabs the userID and adds the task to their own collection
//function pushTask(id) {
// Add task to firebase 
$("#submit-task").on("click", function (event) {
    // prevent the page from refreshing
    event.preventDefault();

    // Gets the value from the task input
    var task = $("#toDoItem").val().trim();
    var status = "toDo";

    // Pushes task into database 'collection' associated with user (userID)
    database.ref(userID).push({
        task: task,
        status: status
    });

    //Increments toDoNum:
    toDoNum++;
    //clears the form field after user clicks Add item
    document.getElementById('toDoItem').value = '';

    emptyTasks();
    renderTasks(userID);

});
//}

// (Santiago) This grabs the userID and displays the tasks
function emptyTasks() {
    $("#toDoCollection").empty();
    $("#completed-tasks").empty();
    // Grab user tasks from firebase and add them to page.
}
function renderTasks(id) {
    database.ref(id).on("child_added", function (snapshot) {

        // Create Materialize collection item
        var collectionItem = $("<p>");
        collectionItem.addClass("collection-item");
        //(Eric) add unique ID to "p" that matches db; may remove
        var taskSpan = $("<span>");
        taskSpan.text(snapshot.val().task);
        var deleteBtn = $("<a>");
        deleteBtn.text("delete");
        deleteBtn.attr({
            class: "material-icons right delete",
            id: snapshot.key,
            "data-delete": id + "/" + snapshot.key
        });

        if (snapshot.val().status === "done") {
            collectionItem.append(taskSpan, deleteBtn);
            $("#completed-tasks").append(collectionItem);
        } 
        
        else if (snapshot.val().status === "toDo"){

            var doneBtn = $("<a>");
            doneBtn.text("check");
            doneBtn.attr({
                class: "material-icons right done",
                id: snapshot.key,
                "data-done": id + "/" + snapshot.key
            });

            collectionItem.append(taskSpan, deleteBtn, doneBtn);
            // Add Materialize collection item to list
            $("#toDoCollection").append(collectionItem);
        }
        toDoNum = $("#toDoCollection p.collection-item").length;
        console.log(toDoNum);

    });

}
// done button click event
$(document).on("click", ".done", function () {
    var done = "done";
    database.ref($(this).data("done")).update({
        status: done,
    });
    //pushTask(userID);
    //decrement toDo counter:
    toDoNum--;


    //check to see if there are 0 tasks remaining: toDoNum
    if (toDoNum === 0) {
        congratsMessage();
    } else {
        //location.reload();
    }
    emptyTasks();
    renderTasks(userID);

});

// delete button click event
$(document).on("click", ".delete", function () {
    var targetPath = $(this).data("delete");
    console.log(targetPath);
    database.ref(targetPath).remove();
    emptyTasks();
    renderTasks(userID);
    // location.reload();
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
