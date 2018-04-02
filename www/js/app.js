// These objects handle most of the interaction on the page.

// UTILS
var utils = {
    ap_numerals: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
    months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    ap_months: ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
    ap_date: function(date) {
        // Given a date such as "2018-02-03" return an AP style date.
        var this_year = new Date().getFullYear();
        var parts = date.split('-')
        var day = +parts[2];
        var month = this.ap_months[+parts[1] - 1];
        if ( this_year == +parts[0] ) return month + ' ' + day;
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
    parse_date_str: function(date) {
        // date is a datetime-looking string such as "2017-07-25"
        // Returns a date object.
        if ( typeof date !== 'string' ) return Date.now();

        var date_bits = date.split(' ')[0].split('-');

        // We do that "+date_bits[1] - 1" because months are zero-indexed.
        var d = new Date(date_bits[0], +date_bits[1] - 1, date_bits[2], 0, 0, 0);
        return d;
    },
    parse_date: function(date) {
        // date is a datetime-looking string such as "2017-07-25"
        // Returns a unixtime integer.
        var d = this.parse_date_str(date);
        return d.getTime();
    },
    days_between: function(from, to) {
        // Get the number of days between two dates. Returns an integer. If to is left blank, defaults to today.
        // Both from and to should be strings 'YYYY-MM-DD'.
        // Cribbed from https://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
        if ( to == null ) to = new Date();
        else to = this.parse_date_str(to);
        from = this.parse_date_str(from);
        var days_diff = Math.floor((from-to)/(1000*60*60*24));
        return days_diff;
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
        
        // If we have a quote-url, we make this a link.
        if ( record['quote-url'] !== '' ) s.innerHTML = '<a href="' + record['quote-url'].trim() + '">' + record['source'] + '</a>';
        else s.textContent = record['source'];

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

// FAN MISERY
// Handler for form request and response.
var fanm = {
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
    form_results: function() {
        // Remove the form, display the results.

        console.log(fanm.data);
        // Remove the form
        el = document.getElementById('fan-misery-form');
        el.parentNode.removeChild(el);

        // Put together then display the results
        var s = Math.round(fanm.data.score*10)/10;
        var s_int = Math.floor(s);
        document.getElementById('fan-score').textContent = s;
        document.getElementById('your-score').textContent = fanm.your_score;

        // Show the relevant emojis
        var emoji = document.getElementById('fanm-' + s_int)
        emoji.classList.remove('hide');
        emoji = document.getElementById('your-' + fanm.your_score)
        emoji.classList.remove('hide');
        
        // Show the div
        document.getElementById('fan-result').setAttribute('class', '');    

    },
    btn_submit: function() {
        // Form handler for fan misery vote
        fanm.your_score = document.querySelector('input[name="fan-"]:checked').value;
        path = './vote/?score=' + fanm.your_score + '&' + utils.rando();
        utils.get_json(path, fanm, fanm.form_results);
    }
};

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
    ribbon_text: [
        ['AMAZIN’'],
        ['YA GOTTA BELIEVE'],
        ['MEH'],
        ['HEY, UM'],
        ['UGH'],
        ['OH NO'],
        ['YOU’RE KILLIN’ ME, SMALLS'],
        ['LIFE’S A PITCH'],
        ['😭'],
        ['SO BAD'],
        ['MAX PAIN'],
        ['END THE SEASON NOW!']
    ],
    update_ribbon_text: function() {
        // Update the text that goes on the ribbon depending on yesterday's misery.
        var score = this.yesterday['misery-score'];
        var text = misery.ribbon_text[score][0];
        document.getElementById('photo-label').innerHTML = text.replace(' ', '&nbsp;');
    },
    update_meter: function() {
        var score = this.yesterday['misery-score'];
        document.getElementById('meter-number').textContent = score;
        gauge.set(score);
    },
    update_photo: function() {
        var score = this.yesterday['misery-score'];
        document.getElementById('lead-photo').setAttribute('src', 'img/mets-misery-' + score + '-1.jpg');
    },
    build_recent: function() {
        // Populate the recent misery list, add the functionality for viewing the rest of it.
        var l = misery.d.recent.length;
        var ul = document.getElementById('recent');
        var recent = misery.d.recent.reverse();

        for ( var i = 0; i < l; i ++ ) {
            var li = document.createElement('li');
            if ( i >= 5 ) li = utils.add_class(li, 'view-more hide');
            if ( i == 5 ) {
                var more = document.createElement('li');
                more = utils.add_class(more, 'view-more-link');
                more.innerHTML = '<a href="javascript:misery.view_more();">View more</a>';
                ul.appendChild(more);
            }
            var ap_date = utils.ap_date(recent[i]['date']);
            if ( ap_date == 'March 28' ) ap_date = 'Preseason';
            var item = ap_date + ': ' + recent[i]['event'];
            if ( recent[i]['url'] !== '' ) item = ap_date + ': <a href="' + recent[i]['url'] + '">' + recent[i]['event'] + '</a>';

            li.innerHTML = item;
            ul.appendChild(li);
        }
    },
    view_more: function() {
        // Turn off the hide
        $('.view-more').removeClass('hide');
        $('.view-more-link').addClass('hide');
    },
    c: {},
    build_daily: function() {
        // Build out the daily misery chart
        
        var data = misery.d.daily.slice(0, misery.d.daily.length - 1);
        var margin = { top: 20, right: 20, bottom: 30, left: 30 };
        this.c.width = 1000 - margin.left - margin.right;
        this.c.height = 200 - margin.top - margin.bottom;
        //if ( width < 350 ) width = 330;

        var x = d3.scaleBand().range([5, this.c.width], .5);
        var y = d3.scaleLinear().range([this.c.height, 0]);

        var x_axis = d3.axisBottom(x);
        var y_axis = d3.axisLeft(y)
            .ticks(6);

        var chart = d3.select('#daily-misery')
            .attr("width", this.c.width + margin.left + margin.right)
            .attr("height", this.c.height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(this.season_dates.map(function(d) { return misery.format_time(misery.parse_time(d)) }));
        //y.domain([0, d3.max(misery.d.recent, function(d) { return +d['misery-score']; })]);
        y.domain([0, 10]);
        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.c.height + ")")
            .call(x_axis)
            .append("text")
            .attr("x", 10)
            .attr("dy", "2.5em")
            .style("text-anchor", "start")
            .text('Date');

        chart.append("g")
            .attr("class", "y axis")
            .call(y_axis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text('Misery');

        chart.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(misery.format_time(misery.parse_time(d['date']))); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { if ( typeof d['misery-score'] == 'undefined' ) return 0; return y(+d['misery-score']); })
            .attr("height", function(d) { if ( typeof d['misery-score'] == 'undefined' ) return 0; return misery.c.height - y(+d['misery-score']); });

    },
    on_load_recent: function() {
        // Process the recent misery
        misery.d.recent = misery.data;
        if ( !! document.getElementById('recent') ) misery.build_recent(misery.d.recent);
        // The "!!" makes the following statement evaluate to a boolean.
        if ( !! document.getElementById('datestamp') ) document.getElementById('datestamp').textContent = utils.ap_date(misery.d.recent[0]['date']);
    },
    on_load_daily: function() {
        // Process the daily misery scores
        misery.latest = misery.data[misery.data.length - 1];
        misery.yesterday = misery.data[misery.data.length - 2];
        misery.d.daily = misery.data;

        // Test for the existence of these elements before updating them.
        // The "!!" makes the following statement evaluate to a boolean.
        if ( !! document.getElementById('ribbon') ) misery.update_ribbon_text();
        if ( !! document.getElementById('meter-number') ) misery.update_meter();
        if ( !! document.getElementById('lead-photo') ) misery.update_photo();
        if ( typeof d3 === 'object' ) {
            misery.parse_time = d3.timeParse('%Y-%m-%d');
            misery.format_time = d3.timeFormat('%B %e');
            misery.build_daily();
        }
    },
    init: function(year) {
        if ( year == null ) year = 2018;
        this.season_dates = season_dates_all;
        //this.season_dates = season_dates_all.splice(0, 30);
        // get_json takes three params: filepath, the object that's calling it, and a callback.
        utils.get_json('output/mets-misery-' + year + '.json', misery, this.on_load_recent);
        utils.get_json('output/mets-misery-daily-' + year + '.json', misery, this.on_load_daily);
    }
}

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
            if ( data[i]['dl-start-date'].trim().toLowerCase() == 'shruggie' ) start_date = '¯\\_(ツ)_/¯';

            var dl_status = data[i]['dl-status'];
            if ( dl_status.trim().toLowerCase() == 'shruggie' ) dl_status = '¯\\_(ツ)_/¯';

            var tr = document.createElement('tr');
            if ( dl_status.trim() === '' ) tr.setAttribute('class', 'inactive');
            var markup = '\n\
                        <td>' + data[i]['player-name'] + '</td>\n\
                        <td>' + data[i]['player-position'] + '</td>\n\
                        <td>' + injury + '</td>\n\
                        <td>' + dl_status + '</td>\n\
                        <td>' + start_date + '</td>\n\
                        ';
            tr.innerHTML = markup;
            t.appendChild(tr);
        }
    },
    on_load: function() {
        if ( !! document.getElementById('injury') ) injuries.build_table(injuries.data);
    },
    init: function(year) {
        if ( year == null ) year = 2018;
        // get_json takes three params: filepath, the object that's calling it, and a callback.
        utils.get_json('output/mets-injured-list-' + year + '.json', injuries, this.on_load);
    }
}

var season_dates_all = ['2018-03-29', '2018-03-30', '2018-03-31', '2018-04-01', '2018-04-02', '2018-04-03', '2018-04-04', '2018-04-05', '2018-04-06', '2018-04-07', '2018-04-08', '2018-04-09', '2018-04-10', '2018-04-11', '2018-04-12', '2018-04-13', '2018-04-14', '2018-04-15', '2018-04-16', '2018-04-17', '2018-04-18', '2018-04-19', '2018-04-20', '2018-04-21', '2018-04-22', '2018-04-23', '2018-04-24', '2018-04-25', '2018-04-26', '2018-04-27', '2018-04-28', '2018-04-29', '2018-04-30', '2018-05-01', '2018-05-02', '2018-05-03', '2018-05-04', '2018-05-05', '2018-05-06', '2018-05-07', '2018-05-08', '2018-05-09', '2018-05-10', '2018-05-11', '2018-05-12', '2018-05-13', '2018-05-14', '2018-05-15', '2018-05-16', '2018-05-17', '2018-05-18', '2018-05-19', '2018-05-20', '2018-05-21', '2018-05-22', '2018-05-23', '2018-05-24', '2018-05-25', '2018-05-26', '2018-05-27', '2018-05-28', '2018-05-29', '2018-05-30', '2018-05-31', '2018-06-01', '2018-06-02', '2018-06-03', '2018-06-04', '2018-06-05', '2018-06-06', '2018-06-07', '2018-06-08', '2018-06-09', '2018-06-10', '2018-06-11', '2018-06-12', '2018-06-13', '2018-06-14', '2018-06-15', '2018-06-16', '2018-06-17', '2018-06-18', '2018-06-19', '2018-06-20', '2018-06-21', '2018-06-22', '2018-06-23', '2018-06-24', '2018-06-25', '2018-06-26', '2018-06-27', '2018-06-28', '2018-06-29', '2018-06-30', '2018-07-01', '2018-07-02', '2018-07-03', '2018-07-04', '2018-07-05', '2018-07-06', '2018-07-07', '2018-07-08', '2018-07-09', '2018-07-10', '2018-07-11', '2018-07-12', '2018-07-13', '2018-07-14', '2018-07-15', '2018-07-16', '2018-07-17', '2018-07-18', '2018-07-19', '2018-07-20', '2018-07-21', '2018-07-22', '2018-07-23', '2018-07-24', '2018-07-25', '2018-07-26', '2018-07-27', '2018-07-28', '2018-07-29', '2018-07-30', '2018-07-31', '2018-08-01', '2018-08-02', '2018-08-03', '2018-08-04', '2018-08-05', '2018-08-06', '2018-08-07', '2018-08-08', '2018-08-09', '2018-08-10', '2018-08-11', '2018-08-12', '2018-08-13', '2018-08-14', '2018-08-15', '2018-08-16', '2018-08-17', '2018-08-18', '2018-08-19', '2018-08-20', '2018-08-21', '2018-08-22', '2018-08-23', '2018-08-24', '2018-08-25', '2018-08-26', '2018-08-27', '2018-08-28', '2018-08-29', '2018-08-30', '2018-08-31', '2018-09-01', '2018-09-02', '2018-09-03', '2018-09-04', '2018-09-05', '2018-09-06', '2018-09-07', '2018-09-08', '2018-09-09', '2018-09-10', '2018-09-11', '2018-09-12', '2018-09-13', '2018-09-14', '2018-09-15', '2018-09-16', '2018-09-17', '2018-09-18', '2018-09-19', '2018-09-20', '2018-09-21', '2018-09-22', '2018-09-23', '2018-09-24', '2018-09-25', '2018-09-26', '2018-09-27', '2018-09-28', '2018-09-29', '2018-09-30'];
