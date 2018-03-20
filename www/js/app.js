// These objects handle most of the interaction on the page.

// UTILS
var utils = {
    ap_numerals: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
    months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    ap_months: ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
    ap_date: function(date) {
        // Given a date such as "2018-02-03" return an AP style date, sans year.
        var parts = date.split('-')
        var day = +parts[2];
        var month = this.ap_months[+parts[1] - 1];
        return month + ' ' + day;
    },
    rando: function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for ( var i=0; i < 8; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },
    add_zero: function(i) {
        // For values less than 10, return a zero-prefixed version of that value.
        if ( +i < 10 ) return "0" + i;
        return i;
    },
    parse_date: function(date ) {
        // date is a datetime-looking string such as "2017-07-25"
        // Returns a unixtime integer.
        if ( typeof date !== 'string' ) return Date.now();

        var date_bits = date.split(' ')[0].split('-');

        // We do that "+date_bits[1] - 1" because months are zero-indexed.
        var d = new Date(date_bits[0], +date_bits[1] - 1, date_bits[2], 0, 0, 0);
        return d.getTime();
    },
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
                console.error('DID NOT LOAD ' + path + request);
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
    config: {
    },
    update_config: function(config) {
        // Take an external config object and update this config object.
        for ( var key in config )
        {
            if ( config.hasOwnProperty(key) )
            {
                this.config[key] = config[key];
            }
        }
    },
    load_quote: function(record) {
        // Given a quote and a source, populate the color commentary with the quote.
    },
    load_tweet: function(record) {
        // Given a tweet url, populate the color commentary section and load the twitter javascript.
        console.log(this);
        document.getElementById('tweet-link').setAttribute('href', record['twitter-url']);
        utils.add_js('https://platform.twitter.com/widgets.js', {});
    },
    on_load: function() {
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
    config: {
    },
    update_config: function(config) {
        // Take an external config object and update this config object.
        for ( var key in config )
        {
            if ( config.hasOwnProperty(key) )
            {
                this.config[key] = config[key];
            }
        }
    },
    build_recent_misery: function() {
    },
    build_daily_misery: function() {
        // Build out the daily misery chart
    },
    on_load: function() {
    },
    init: function() {
        utils.get_json('output/mets-misery-2018.json', misery, this.on_load);
    }
}
misery.init();

// INJURY TRACKER
// First init fires, then on_load.
var injuries = {
    config: {
    },
    update_config: function(config) {
        // Take an external config object and update this config object.
        for ( var key in config )
        {
            if ( config.hasOwnProperty(key) )
            {
                this.config[key] = config[key];
            }
        }
    },
    on_load: function() {
    },
    init: function() {
        this.data = utils.get_json('../output/mets-injuries-2018.json', injuries, this.on_load);
    }
}

