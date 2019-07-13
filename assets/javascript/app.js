$(document).ready(function () {
    // Triggers modal
    $(".modal").modal();
});

$("#add-item").on("submit", function (event) {
    // prevent the page from refreshing
    event.preventDefault();
    // Gets the value from the task input
    var task = $("#toDoItem").val().trim();

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
    taskSpan.text(task);
    collectionLabel.append(checkBox, taskSpan);
    collectionItem.append(collectionLabel);
    // Add Materialize collection item to list
    $("#toDoCollection").append(collectionItem);
});



