// These objects handle most of the interaction on the page.

// UTILS
var utils = {
   get_json: function(path, obj, callback) {
        // Downloads local json and returns it.
        // Cribbed from http://youmightnotneedjquery.com/
        var request = new XMLHttpRequest();
        request.open('GET', path, true);

        request.onload = function() {
            if ( request.status >= 200 && request.status < 400 ) {
                obj.data = JSON.parse(request.responseText);
				callback();
            }
            else {
                return false;
            }
        };
        request.onerror = function() {};
        request.send();
    },
	add_js: function(src, callback) {
        var s = document.createElement('script');
        s.onload = function() { callback(); }
        s.setAttribute('src', src);
        document.getElementsByTagName('head')[0].appendChild(s);
    },
}

// COLOR COMMENTARY
// First init fires, then on_load.
var commentary = {
	load_quote: function(record) {},
	load_tweet: function(record) {
		// Given a tweet url, populate the color commentary section and load the twitter javascript.
		console.log(this);
		document.getElementById('tweet-link').setAttribute('href', record['twitter-url']);
		utils.add_js('https://platform.twitter.com/widgets.js', {});
	},
	on_load: function() {
		console.log('wheee');
		// The latest item in this.data is the one we put on the page.
		var latest = commentary.data.pop();
		if ( latest['twitter-url'] == '' ) commentary.load_quote(latest);
		else commentary.load_tweet(latest);
	},
    init: function() {
        this.data = utils.get_json('output/mets-commentary-2018.json', commentary, this.on_load);
    }
}
commentary.init();

// MISERY INDEX
// First init fires, then on_load.
var misery = {
    init: function() {
        this.data = utils.get_json('../output/mets-misery-2018.json');
    }
}

// INJURY TRACKER
// First init fires, then on_load.
var injuries = {
    init: function() {
        this.data = utils.get_json('../output/mets-injuries-2018.json');
    }
}

