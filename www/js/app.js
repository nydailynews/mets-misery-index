// These objects handle most of the interaction on the page.

// UTILS
var utils = {
    ap_numerals: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
    months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    ap_months: ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
    ap_date: function(date) {
        // Given a date such as "2018-02-03" return an AP style date.
        var parts = date.split('-')
        var day = +parts[2];
        var month = this.ap_months[+parts[1] - 1];
        return month + ' ' + day + ', ' + parts[0];
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
    add_class: function(el, class_name) {
        // From http://youmightnotneedjquery.com/#add_class
        if ( el.classlist ) el.classList.add(class_name);
        else el.className += ' ' + class_name;
        return el;
    },
    add_js: function(src, callback) {
        var s = document.createElement('script');
        if ( typeof callback === 'function' ) s.onload = function() { callback(); }
        //else console.log("Callback function", callback, " is not a function");
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
        return true;
    },
    load_quote: function(record) {
        // Given a quote and a source, populate the color commentary with the quote.
        var bq = document.getElementById('tweet-link');
        var p = document.createElement('p');
        var q = document.createElement('q');
        q.textContent = record['quote'];
        var s = document.createElement('span');
        s.textContent = record['source'];

        p.appendChild(q);
        p.appendChild(s);
        bq.appendChild(p);
        return true;
    },
    load_tweet: function(record) {
        // Given a tweet url, populate the color commentary section and load the twitter javascript.
        console.log(this);
        document.getElementById('tweet-link').setAttribute('href', record['twitter-url']);
        utils.add_js('https://platform.twitter.com/widgets.js', {});
        return true;
    },
    on_load: function() {
        // The latest item in this.data is the one we put on the page.
        var latest = commentary.data.pop();
        if ( latest['twitter-url'] == '' ) commentary.load_quote(latest);
        else commentary.load_tweet(latest);
        return true;
    },
    init: function(year) {
        if ( year == null ) year = 2018;
        // get_json takes three params: filepath, the object that's calling it, and a callback.
        utils.get_json('output/mets-commentary-' + year + '.json', commentary, this.on_load);
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
    d: {},
    build_recent: function() {
        // Populate the recent misery list, add the functionality for viewing the rest of it.
        var l = misery.d.recent.length;
        var ul = document.getElementById('recent');
        for ( var i = 0; i < l; i ++ ) {
            var li = document.createElement('li');
            if ( i >= 5 ) li = utils.add_class(li, 'view-more hide');
            if ( i == 5 ) {
                var more = document.createElement('li');
                more = utils.add_class(more, 'view-more-link');
                more.innerHTML = '<a href="javascript:utils.view_more(); return false;">View more</a>';
                ul.appendChild(more);
            }
            var item = misery.d.recent[i]['event'];
            if ( misery.d.recent[i]['url'] !== '' ) item = '<a href="' + misery.d.recent[i]['url'] + '">' + misery.d.recent[i]['event'] + '</a>';

            li.innerHTML = item;
            ul.appendChild(li);
        }
    },
    build_daily: function() {
        // Build out the daily misery chart
    },
    on_load_recent: function() {
        // Process the recent misery
        console.log(misery.data);
        misery.d.recent = misery.data;
        misery.build_recent(misery.d.recent);
    },
    on_load_daily: function() {
        // Process the daily misery scores
        misery.d.daily = data;
    },
    init: function(year) {
        if ( year == null ) year = 2018;
        // get_json takes three params: filepath, the object that's calling it, and a callback.
        utils.get_json('output/mets-misery-' + year + '.json', misery, this.on_load_recent);
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
    build_table: function(data) {
        // Take records in the data array and add them to a table.
        var l = data.length;
        var t = document.getElementById('injury');
        for ( var i = 0; i < l; i ++ ) {
            // Put together the text and the markup we need to populate a table row.
            var injury = data[i]['injury'];
            if ( data[i]['url'] !== '' ) injury = '<a href="' + data[i]['url'].trim() + '">' + data[i]['injury'] + '</a>';
            var start_date = utils.ap_date(data[i]['dl-start-date']);

            var tr = document.createElement('tr');
            var markup = '\n\
						<td>' + data[i]['player-name'] + '</td>\n\
						<td>' + data[i]['player-position'] + '</td>\n\
						<td>' + injury + '</td>\n\
						<td>' + data[i]['dl-status'] + '</td>\n\
						<td>' + start_date + '</td>\n\
                        ';
            tr.innerHTML = markup;
            t.appendChild(tr);
        }
    },
    on_load: function() {
        injuries.build_table(injuries.data);
    },
    init: function(year) {
        if ( year == null ) year = 2018;
        // get_json takes three params: filepath, the object that's calling it, and a callback.
        utils.get_json('output/mets-injured-list-' + year + '.json', injuries, this.on_load);
    }
}
injuries.init();
