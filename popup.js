$(function () {
    // request permissions for camera access
    var direction = "down";

    var port = chrome.extension.connect({name: "Message Bus"});
    port.onMessage.addListener(function(msg) {
        console.log("message recieved" + msg);
    });

    $("#btnSelector").click(function () {
        console.log("clicked!");
        changeDirection($("#btnSelector"));
    });
    $("#statusToggle").click(function () {
        port.postMessage({action: "toggleStatus"});
    });
    function changeDirection(btnSelector) {
        if (direction == "down") {
            direction = "up";
        }
        else {
            direction = "down";
        }
        btnSelector.text(direction);
        port.postMessage({action: "changeDirection", direction: direction});
    }
});
