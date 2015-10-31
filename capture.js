var scrollDirection = "down";
var port = chrome.extension.connect({name: "Message Bus"});

function performScroll(px) {
    console.log("sending scroll msg");
    port.postMessage({action: "scroll", px: px});
}


$(function () {
    var video = $("#video");
    var canvas = $('#canvas')[0];
    var context = canvas.getContext('2d');
    var tracker = new tracking.ObjectTracker('face');
    var config = {
        // number of x-coordinates to store at once
        "COORDS_TO_STORE": 8,
        // maximum standard deviation before
        // we start scrolling
        "MOVEMENT_STD_DEV": 10,
    };
    var coordinates_x = [];

    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);
    tracking.track('#video', tracker, { camera: true });

    tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function(rect) {
            coordinates_x.push(rect.x);
            if (coordinates_x.length > config.COORDS_TO_STORE) {
                // only store the most recent $(coords_to_store)
                // x-coordinates
                coordinates_x.shift();
            }
            var std_dev = math.std(coordinates_x);
            if (std_dev > config.MOVEMENT_STD_DEV) {
                if (std_dev > 20) {
                    // extreme head motions, increase scrolling rate
                    performScroll(std_dev * 2.5);
                }
                else {
                    performScroll(std_dev);
                }
            }
        });
    });
});
