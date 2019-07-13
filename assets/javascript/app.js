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

var database = firebase.database();
console.log(database);

$(document).ready(function () {
    // Triggers modal
    $(".modal").modal();
});

$("#add-item").on("submit", function (event) {
    // prevent the page from refreshing
    event.preventDefault();
    // Gets the value from the task input
    var task = $("#toDoItem").val().trim();

    database.ref().push({
        task: task
    });

});

database.ref().on("child_added", function (snapshot) {
    console.log(snapshot.val().task);
    // Create Materialize collection item
    var collectionItem = $("<p>");
    collectionItem.addClass("collection-item");
    collectionLabel = $("<label>");
    checkBox = $("<input>");
    checkBox.attr({
        type: "checkbox",
        class: "filled-in"
    });
    taskSpan = $("<span>");
    taskSpan.text(snapshot.val().task);
    collectionLabel.append(checkBox, taskSpan);
    collectionItem.append(collectionLabel);
    // Add Materialize collection item to list
    $("#toDoCollection").append(collectionItem);


});


