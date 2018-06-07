// These objects handle most of the interaction.

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

// LATEST GRAF
// This object handles the graf that tells us the latest game info
var lt = {
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
    publish_latest: function(rec) {
        // Take a game record object and put it on the page.
        var el = document.getElementById('gamer');
        //var el = document.createElement('section');
        //el.id = 'gamer';
        var blurb = lt.write_blurb(rec);
        el.innerHTML = '<h2 style="margin-top:20px;">Yesterday’s Mets Game</h2>\n <p class="description">' + blurb + '</p>';
        //parent.appendChild(el);
    },
    write_blurb: function(rec) {
        // Turn a game record object into a paragraph.
        // An object looks something like this:
        // date: "2018-05-08"
        // gamer-headline: "Yankees move into tie atop AL East with 3-2 win over Red Sox"
        // gamer-url: "http://www.nydailynews.com/sports/baseball/yankees/yankees-move-tie-atop-al-east-3-2-win-red-sox-article-1.3979129"
        // games-back-division: ""
        // home-game: "1"
        // in-division: "1"
        // opponent-score: "2"
        // record-last-ten: ""
        // streak: "7"
        // total-losses: "10"
        // total-wins: "25"
        // win: "1"
        // yankees-score: "3"
        var html = 'Mets fall ' + rec['opponent-score'] + '-' + rec['mets-score'] + '.';
        if ( +rec['mets-score'] > +rec['opponent-score'] ) html = 'Mets win ' + rec['mets-score'] + '-' + rec['opponent-score'] + '.';
        if ( rec['gamer-url'] != '' ) html += ' Game story: <a href="' + rec['gamer-url'] + '">' + rec['gamer-headline'] + '</a>.'; 
        return html;
    },
    on_load: function() {
        // See if we have a record for today's or yesterday's game, and if we do, add it to the interactive.
        var yesterday = misery.yesterday['date'];
        var latest = misery.latest['date'];
        var l = lt.data.length;
        for ( var i = 0; i < l; i ++ ) {
            //console.info(yesterday, lt.data[i]['date']);
            if ( yesterday == lt.data[i]['date'] ) var record = lt.data[i];
        }
        //var record = lt.data[l - 3];
        if ( typeof record !== 'undefined' && record['opponent-score'] != '' ) lt.publish_latest(record);
    },
    init: function(year) {
        if ( year == null ) year = 2018;
        utils.get_json('../../feeds/json/mets-games-' + year + '.json', lt, lt.on_load);
    }
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
        utils.get_json('output/mets-commentary-' + year + '.json?' + utils.rando(), commentary, this.on_load);
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
    update_score: function(id, score) {
        // Update the score element.
        document.getElementById(id).textContent = score;
    },
    show_emoji: function(id, score) {
        // Show the relevant emoji
        var emoji = document.getElementById(id + score)
        emoji.classList.remove('hide');
    },
    form_results: function() {
        // Remove the form, display the results.

        //console.log(fanm.data);
        // Remove the form
        el = document.getElementById('fan-misery-form');
        el.parentNode.removeChild(el);

        // Put together then display the results
        var s = Math.round(fanm.data.score*10)/10;
        var s_int = Math.floor(s);

        fanm.update_score('fan-score', s);
        fanm.update_score('your-score', fanm.your_score);

        // Show the relevant emojis
        fanm.show_emoji('fanm-', s_int);
        fanm.show_emoji('your-', fanm.your_score);
        
        // Show the div
        document.getElementById('fan-result').setAttribute('class', '');    
        document.getElementById('fan-result').setAttribute('role', 'alert');    

		// New ads, a pv.
        if ( typeof googletag !== 'undefined' ) googletag.pubads().refresh();
        if ( typeof PARSELY !== 'undefined' ) PARSELY.beacon.trackPageView({ url: document.location.href, urlref: document.location.href, js: 1 });
        // Let the parent frame know, if it's listening
        window.parent.postMessage({'vote': 1}, '*');

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
    name: 'misery',
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
        ['YA GOTTA<br>BELIEVE'],
        ['MEH'],
        ['HEY, UM'],
        ['UGH'],
        ['OH NO'],
        ['YOU’RE KILLIN’<br>ME, SMALLS'],
        ['LIFE’S A<br>PITCH'],
        ['THERE’S NO 😭<br>IN BASEBALL'],
        ['SO BAD'],
        ['MAX<br>PAIN'],
        ['END THE<br>SEASON NOW!']
    ],
    update_ribbon_text: function(override) {
        // Update the text that goes on the ribbon depending on yesterday's misery.
        // We do yesterday's misery because we don't know precisely when today's misery will land / if it will land.
        var score = this.yesterday['misery-score'];
        if ( override != null ) score = override;
        var score_bucket = score;
        if ( score > 10 ) score_bucket = 11;
        var text = misery.ribbon_text[score_bucket][0];
        var el = document.getElementById('photo-label');

        if ( text.indexOf('<br>') !== -1 ) el.setAttribute('class', 'tight-fit');
        else el.setAttribute('class', 'centered');

        el.innerHTML = text.replace(/ /g, '&nbsp;');
    },
    update_meter: function() {
        // We do yesterday's misery because we don't know precisely when today's misery will land / if it will land.
        var score = this.yesterday['misery-score'];
        if ( score > 10 ) {
            var el = document.getElementById('meter');
            el.innerHTML = '<img src="http://interactive.nydailynews.com/project/mets-misery-index/img/broken-meter.jpg" alt="">';
        }
        else {
            document.getElementById('meter-number').textContent = score;
            gauge.set(score);
        }
    },
    update_photo: function() {
        // We do yesterday's misery because we don't know precisely when today's misery will land / if it will land.
        var score = this.yesterday['misery-score'];
        var score_bucket = score;
        if ( score > 10 ) score_bucket = 10;
        document.getElementById('lead-photo').setAttribute('src', 'img/mets-misery-' + score_bucket + '-1.jpg');
    },
    update_widget: function() {
        // The widget misery score works and looks like the fan misery score.
        var score = this.yesterday['misery-score'];
        var score_bucket = score;
        if ( score > 10 ) score_bucket = 11;
        fanm.update_score('staff-score', score);
        fanm.show_emoji('staff-', score_bucket);
    },
    build_recent: function() {
        // Populate the recent misery list, add the functionality for viewing the rest of it.
        // If limit is set, only publish that many headlines.
        if ( typeof misery.d.recent === 'undefined' ) return false;

        var l = misery.d.recent.length;
        if ( typeof misery.config.recent_limit !== 'undefined' ) l = misery.config.recent_limit;
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
            if ( recent[i]['url'] !== '' ) item = ap_date + ': <a target="_blank" href="' + recent[i]['url'] + '">' + recent[i]['event'] + '</a>';

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
    chart_config: {
        id: 'daily-misery',
        height: 200,
        width: 1000,
        ticks: 6,
        y_max: 10
    },
    build_daily: function() {
        // Build out the daily misery chart
        
        var data = this.d.daily.slice(0, this.d.daily.length - 1);
        var margin = { top: 20, right: 20, bottom: 30, left: 30 };
        if ( this.name === 'misery' ) {
            misery.c.width = misery.chart_config.width - margin.left - margin.right;
            if ( is_mobile ) misery.c.width = ( misery.chart_config.width - 400 ) - margin.left - margin.right;
            misery.c.height = misery.chart_config.height - margin.top - margin.bottom;
        }
        else if ( this.name === 'fanc' ) {
            fanc.c.width = fanc.chart_config.width - margin.left - margin.right;
            if ( is_mobile ) fanc.c.width = ( fanc.chart_config.width - 400 ) - margin.left - margin.right;
            fanc.c.height = fanc.chart_config.height - margin.top - margin.bottom;
        }

        var x = d3.scaleBand().range([5, this.c.width], .5);
        var y = d3.scaleLinear().range([this.c.height, 0]);

        var x_axis = d3.axisBottom(x);
        var y_axis = d3.axisLeft(y)
            .ticks(this.chart_config.ticks);

        var chart = d3.select('#' + this.chart_config.id)
            .attr("width", this.c.width + margin.left + margin.right)
            .attr("height", this.c.height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(this.season_dates.map(function(d) { return misery.format_time(misery.parse_time(d)) }));
        y.domain([0, this.chart_config.y_max]);
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
            .attr("height", function(d, e, f) { 
                //console.log(d, e, f, g);
                if ( typeof d['misery-score'] == 'undefined' ) return 0;
                //console.log("HA", misery.c.height, y(+d['misery-score']));
                return misery.c.height - y(+d['misery-score']); }
                );

    },
    on_load_recent: function() {
        // Process the recent misery
        misery.d.recent = misery.data;
        if ( !! document.getElementById('recent') ) misery.build_recent();
        // The "!!" makes the following statement evaluate to a boolean.
        if ( !! document.getElementById('datestamp') ) document.getElementById('datestamp').textContent = utils.ap_date(misery.d.recent[0]['date']);
    },
    on_load_daily: function() {
        // Process the daily misery scores
        misery.latest = misery.data[misery.data.length - 1];
        misery.yesterday = misery.data[misery.data.length - 2];
        misery.d.daily = misery.data;

        if ( typeof misery.config.is_widget !== 'undefined' ) misery.update_widget();

        // Test for the existence of these elements before updating them.
        // The "!!" makes the following statement evaluate to a boolean.
        if ( !! document.getElementById('ribbon') ) misery.update_ribbon_text();
        if ( !! document.getElementById('meter-number') ) misery.update_meter();
        if ( !! document.getElementById('lead-photo') ) misery.update_photo();
        if ( typeof d3 === 'object' && typeof misery.parse_time !== 'function' ) {
            misery.parse_time = d3.timeParse('%Y-%m-%d');
            misery.format_time = d3.timeFormat('%B %e');
            misery.build_daily();
        }
    },
    init: function(year) {
        if ( year == null ) year = 2018;
        misery.season_dates = season_dates_all;
        if ( typeof m_config !== 'undefined' ) misery.update_config(m_config);
        //this.season_dates = season_dates_all.splice(0, 30);
        
        // get_json takes three params: filepath, the object that's calling it, and a callback.
        utils.get_json('output/mets-misery-' + year + '.json?' + utils.rando(), misery, misery.on_load_recent);
        utils.get_json('output/mets-misery-daily-' + year + '.json?' + utils.rando(), misery, misery.on_load_daily);
    }
}

// FAN MISERY CHART
// Handler for chart and data smoothing operations
var fanc = {
    name: 'fanc',
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
    rolling_average: function(data, key_key, value_key, round_to, roll_for) {
        // Given an ordered array of objects, its keys and the number of items we want to
        // create a rolling average for, and the number of decimal places
        // we round to, return a new object similar to the last.
        //
        var l = data.length - Math.ceiling(roll_for/2);
        var d = [];
        var field = '';
        for ( var i = 0, j = 1, h = -1; i < l; i ++ && j ++ && h ++ ) {
            field = data[i][key_key];


        }

    },
    get_average: function(records, round_to) {
        // Return the average of the given records.
        if ( round_to === null ) round_to = 0;
        else round_to = Math.pow(10, round_to);
        var l = records.length;
        var sum = 0;
        for ( var i = 0; i < l; i ++ ) sum += records[i];
        return Math.round( ( sum/l ) * round_to ) / round_to;
    },
    rolling_average_three: function(data, key_key, value_key, round_to) {
        // Given an ordered array of objects, its keys and the number of decimal places
        // we round to, return a new object similar to the last.

        var l = data.length - 2;
        var d = [];
        var field = '';
        var value;
        for ( var i = 0, j = 1, h = -1; i < l; i ++ && j ++ && h ++ ) {
            field = data[i][key_key];
            if ( h >= 0 ) value = this.get_average([data[h][value_key], data[i][value_key], data[j][value_key]], round_to);
            else value = this.get_average([data[i][value_key], data[j][value_key]], round_to);
            d.push({[key_key]: field, [value_key]: value});
        }
        return d;
    },
    c: {},
    chart_config: {
        id: 'fan-misery-chart',
        height: 200,
        width: 1000,
        ticks: 6,
        y_max: 10
    },
    build_daily: misery.build_daily,
    on_load_daily: function() {
        // Process the daily misery scores
        fanc.d.daily = fanc.rolling_average_three(fanc.data, 'date', 'misery-score', 1);
        if ( typeof d3 === 'object' ) {
            misery.parse_time = d3.timeParse('%Y-%m-%d');
            misery.format_time = d3.timeFormat('%B %e');
            fanc.build_daily();
        }
    },
    init: function(year) {
        if ( year == null ) year = 2018;
        fanc.season_dates = season_dates_all;
        if ( typeof fanc_config !== 'undefined' ) fanc.update_config(fanc_config);
        
        // get_json takes three params: filepath, the object that's calling it, and a callback.
        utils.get_json('output/mets-fans-misery-daily-' + year + '.json?' + utils.rando(), fanc, fanc.on_load_daily);
    }
};

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
    build_table: function(data_raw) {
        // Take records in the data array and add them to a table.
        var l = data_raw.length;
        var t = document.querySelector('#injury tbody');
        data_raw.sort(function(a,b) { 
			// If dl-stint-ended is not blank, it goes at the end.
            if ( a['dl-stint-ended'] !== '' ) return -9999;
			if ( b['dl-stint-ended'] !== '' ) return 9999;
			return +a['dl-start-date'].replace(/-/g, '') - b['dl-start-date'].replace(/-/g, ''); });
        var data = data_raw.reverse();

        var l = data.length;
        var t = document.querySelector('#injury tbody');
        for ( var i = 0; i < l; i ++ ) {
            // Put together the text and the markup we need to populate a table row.
            var injury = data[i]['injury'];
            if ( data[i]['url'] !== '' ) injury = '<a target="_blank" href="' + data[i]['url'].trim() + '">' + data[i]['injury'] + '</a>';
            var start_date = utils.ap_date(data[i]['dl-start-date']);
            if ( data[i]['dl-start-date'].trim().toLowerCase() == 'shruggie' ) start_date = '¯\\_(ツ)_/¯';

            var dl_status = data[i]['dl-status'];
            if ( dl_status.trim().toLowerCase() == 'shruggie' ) dl_status = '¯\\_(ツ)_/¯';

            var tr = document.createElement('tr');
            if ( data[i]['dl-stint-ended'].trim() !== '' ) tr.setAttribute('class', 'inactive');
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
        utils.get_json('output/mets-injured-list-' + year + '.json?' + utils.rando(), injuries, injuries.on_load);
    }
}

var season_dates_all = ['2018-03-29', '2018-03-30', '2018-03-31', '2018-04-01', '2018-04-02', '2018-04-03', '2018-04-04', '2018-04-05', '2018-04-06', '2018-04-07', '2018-04-08', '2018-04-09', '2018-04-10', '2018-04-11', '2018-04-12', '2018-04-13', '2018-04-14', '2018-04-15', '2018-04-16', '2018-04-17', '2018-04-18', '2018-04-19', '2018-04-20', '2018-04-21', '2018-04-22', '2018-04-23', '2018-04-24', '2018-04-25', '2018-04-26', '2018-04-27', '2018-04-28', '2018-04-29', '2018-04-30', '2018-05-01', '2018-05-02', '2018-05-03', '2018-05-04', '2018-05-05', '2018-05-06', '2018-05-07', '2018-05-08', '2018-05-09', '2018-05-10', '2018-05-11', '2018-05-12', '2018-05-13', '2018-05-14', '2018-05-15', '2018-05-16', '2018-05-17', '2018-05-18', '2018-05-19', '2018-05-20', '2018-05-21', '2018-05-22', '2018-05-23', '2018-05-24', '2018-05-25', '2018-05-26', '2018-05-27', '2018-05-28', '2018-05-29', '2018-05-30', '2018-05-31', '2018-06-01', '2018-06-02', '2018-06-03', '2018-06-04', '2018-06-05', '2018-06-06', '2018-06-07', '2018-06-08', '2018-06-09', '2018-06-10', '2018-06-11', '2018-06-12', '2018-06-13', '2018-06-14', '2018-06-15', '2018-06-16', '2018-06-17', '2018-06-18', '2018-06-19', '2018-06-20', '2018-06-21', '2018-06-22', '2018-06-23', '2018-06-24', '2018-06-25', '2018-06-26', '2018-06-27', '2018-06-28', '2018-06-29', '2018-06-30', '2018-07-01', '2018-07-02', '2018-07-03', '2018-07-04', '2018-07-05', '2018-07-06', '2018-07-07', '2018-07-08', '2018-07-09', '2018-07-10', '2018-07-11', '2018-07-12', '2018-07-13', '2018-07-14', '2018-07-15', '2018-07-16', '2018-07-17', '2018-07-18', '2018-07-19', '2018-07-20', '2018-07-21', '2018-07-22', '2018-07-23', '2018-07-24', '2018-07-25', '2018-07-26', '2018-07-27', '2018-07-28', '2018-07-29', '2018-07-30', '2018-07-31', '2018-08-01', '2018-08-02', '2018-08-03', '2018-08-04', '2018-08-05', '2018-08-06', '2018-08-07', '2018-08-08', '2018-08-09', '2018-08-10', '2018-08-11', '2018-08-12', '2018-08-13', '2018-08-14', '2018-08-15', '2018-08-16', '2018-08-17', '2018-08-18', '2018-08-19', '2018-08-20', '2018-08-21', '2018-08-22', '2018-08-23', '2018-08-24', '2018-08-25', '2018-08-26', '2018-08-27', '2018-08-28', '2018-08-29', '2018-08-30', '2018-08-31', '2018-09-01', '2018-09-02', '2018-09-03', '2018-09-04', '2018-09-05', '2018-09-06', '2018-09-07', '2018-09-08', '2018-09-09', '2018-09-10', '2018-09-11', '2018-09-12', '2018-09-13', '2018-09-14', '2018-09-15', '2018-09-16', '2018-09-17', '2018-09-18', '2018-09-19', '2018-09-20', '2018-09-21', '2018-09-22', '2018-09-23', '2018-09-24', '2018-09-25', '2018-09-26', '2018-09-27', '2018-09-28', '2018-09-29', '2018-09-30'];
