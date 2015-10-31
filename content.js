window.direction = "down";

$("#directionBtn").click(function () {
    changeDirection($("#directionBtn"));
});
function changeDirection(btnSelector) {
    if (direction == "down") {
        direction = "up";
    }
    else {
        direction = "down";
    }
    btnSelector.text(direction);
}
function performScroll(px) {
    if (direction == "up") {
        // reverse direction if scrolling up
        px = (-1 * px);
    }
    window.scrollBy(0, px);
}

var element_string = "<div class=\"face-frame\" style=\"visibility: hidden\">\
    <div class=\"face-container\">\
        <video id=\"video\" width=\"320\" height=\"240\" preload autoplay loop muted></video>\
        <canvas id=\"canvas\" width=\"320\" height=\"240\"></canvas>\
    </div>\
</div>";


$(function () {
    $("body").append(element_string);

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
