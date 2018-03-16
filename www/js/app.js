// These objects handle most of the interaction on the page.

// UTILS
var util = {
    get_json: function(path) {
        // Downloads local json and returns it.
        // Cribbed from http://youmightnotneedjquery.com/
        var request = new XMLHttpRequest();
        request.open('GET', path, true);

        request.onload = function() {
            if ( request.status >= 200 && request.status < 400 ) {
                return Json.parse(request.responseText);
            }
            else {
                return false;
            }
        };
        request.onerror = function() {};
        request.send();
    }
}
// COLOR COMMENTARY
var commentary = {
    init: function() {
        this.data = utils.get_json('../output/mets-commentary-2018.json');
    }
}
