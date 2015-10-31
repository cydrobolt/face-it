var scrollDirection = "down";

chrome.extension.onConnect.addListener(function(port) {
    // messaging from popup
    console.log("Connected to popup");
    port.onMessage.addListener(function(request) {
        console.log("message recieved");
        console.log(request);
        if (request.action == "changeDirection") {
            if (scrollDirection == "up")
                scrollDirection = "down";
            else
                scrollDirection = "up";
        }
        if (request.action == "toggleStatus") {
            init();
        }
        if (request.action == "scroll") {
            performScroll(request.px);
            console.log("scrolling!");
        }
    });
});

function performScroll(px) {
    if (scrollDirection == "up") {
        // reverse direction if scrolling up
        px = (-1 * px);
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "scroll", px: px}, function(response) {
            // no responses expected
        });
    });
}

function init () {
    chrome.tabs.create({'url': chrome.extension.getURL('capture.html'), active: true}, function(tab) {
        // tab with video capture should be opened
    });
}
