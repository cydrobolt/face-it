function performScroll(px) {
    window.scrollBy(0, px);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.action == "scroll") {
        performScroll(request.px);
    }
});
