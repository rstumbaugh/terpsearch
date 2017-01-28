function Professor() {
	this.name = decodeURIComponent(getUrlVars()['name']);

	this.initDisplay();

	var ps = [];
	ps.push(this.loadInfo());
	ps.push(this.loadStats());
	Promise.all(ps).then(function() {
		$('.loading').hide();
		$('.info').show();

        $('.ratings .empty-data').hide();
        
	}).catch(function(err) {
		$('.loading').hide();
		$('.info').show();
		$('#noReviewPanel').show();
	})


	$('#goBack').click(function() {
        window.history.back();
    });
}

Professor.prototype.initDisplay = function() {
	var prev = getUrlVars()['from'];


    if (prev) {
        $('#goBack').text('Back to '+prev);
        $('#back').show();
    }
}

// load basic info (name, courses taught)
// REJECT PROMISE IF COURSE INFO NOT FOUND
Professor.prototype.loadInfo = function() {	
	var p = $.get(API_FIND_PROFS + '?name='+encodeURIComponent(this.name));
	
	return new Promise(function(resolve, reject) {
		p.done(function(data) {
			var obj = data[0];
			console.log(obj);
			$('.name').text(obj.name);
			for (var i = 0; i < obj.courses.length; i++) {
				var $a = $('<a/>', {text: obj.courses[i], href: 'viewcourse.html?from=professor&id='+obj.courses[i]});
				$('#courses').append($a);
				if (i < obj.courses.length - 1) {
					$('#courses').append(', ');
				}
			}

			resolve();
		}).fail(function(xhr, status, err) {
			reject(err);
		})
	});
}

// REJECT PROMISE IF COURSE INFO NOT FOUND
Professor.prototype.loadStats = function() {
	var self = this;
	return new Promise(function(resolve, reject) {
		$.get(API_PROF_STATS + '?name=' + self.name).done(function(data) {
			
			var avgDiff = data.avgDiff;
			var avgInt = data.avgInt;

			$('.numResponses').text(data.numRatings);
			$('#avgDiff').text(avgDiff.toFixed(1));
			$('#avgInt').text(avgInt.toFixed(1));

			// init bar charts
			initChart($('#diffChart'), data.diffCounts);
			initChart($('#intChart'), data.intCounts);

			// show professor info
	        // need to make new element, initProfessorProgress for each
	        var ratings = data.ratings;

	        var $diffWrap = $('.ratings .difficulty .breakdown-wrap');
	        var $intWrap = $('.ratings .interest .breakdown-wrap');

	        for (var course in ratings) {
	        	var obj = ratings[course];
	        	var avgDiff = obj.avgDiff;
	        	var avgInt = obj.avgInt;
	        	var numResponses = getRatingCount(obj.diffs);

	            var diffId = 'diffBar' + course;
	            var intId = 'intBar' + course;

	            var $prof = $('<div/>', {'class': 'breakdown'});
	            var $span = $('<span/>');
	            var $diffBar = $('<div/>', {'id': diffId});
	            var $intBar = $('<div/>', {'id': intId});

	            $span.html('<strong>'+course+'</strong>, <i>'+numResponses+' responses</i>');


	            $prof.append($span);

	            $diffWrap.append($prof.clone().append($('<div/>').append($diffBar)));
	            $intWrap.append($prof.clone().append($('<div/>').append($intBar)));

	            initCourseProgress('#'+diffId, avgDiff.toFixed(1));
	            initCourseProgress('#'+intId, avgInt.toFixed(1));
	        }

	        if (data.numRatings > 0) {
	        	resolve();
	        } else {
	        	reject();
	        }
		}).fail(function(xhr, status, err) {
			reject(err);
		})
	})
}

function initChart(chart, dataArr) {
    var data = {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [
            {
                backgroundColor: [
                    '#c0392b',
                    '#c0392b',
                    '#c0392b',
                    '#c0392b',
                    '#c0392b'
                ],
                borderWidth: 1,
                data: dataArr
            }
        ]
    };

    var myBarChart = new Chart(chart, {
        type: 'bar',
        data: data,
        options: {
            responsive: false,
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    stacked: false,
                    gridLines: { display: false }
                }],
                yAxes: [{
                    stacked: false,
                    ticks: { 
                        display: false,
                        stepSize: 5
                    }
                }]
            }
        }
    });
}

function initCircularProgress(id) {
    var bar = new ProgressBar.Circle(id, {
        strokeWidth: 6,
        easing: 'easeInOut',
        duration: 1400,
        color: '#c0392b',
        trailColor: '#ecf0f1',
        trailWidth: 8,
        svgStyle: null,
        step: function(state, bar) {
            bar.setText((bar.value() * 5.0).toFixed(1));
        }
    });

    bar.text.style.color = '#333';

    return bar;
}

function initCourseProgress(id, avgRating) {
    var bar = new ProgressBar.Line(id, {
      strokeWidth: 4,
      easing: 'easeInOut',
      duration: 1400,
      color: '#52a2f1',
      trailColor: '#fff',
      trailWidth: 6,
      svgStyle: {width: '100%', height: '100%'},
      text: {
        style: {
          // Text color.
          // Default: same as stroke color (options.color)
          color: '#333',
          position: 'absolute',
          right: '0',
          padding: 0,
          margin: 0,
          transform: null
        },
        autoStyleContainer: false
      },
      from: {color: '#FFEA82'},
      to: {color: '#ED6A5A'},
      step: function(state, bar) {
        bar.setText((bar.value() * 5.0).toFixed(1));
      }
    });

    bar.animate(avgRating/5.0);
}

function getRatingCount(ratings) {
	var count = 0;
	for (var rating in ratings) {
		count += ratings[rating];
	}

	return count;
}


window.onload = function() {
	window.professor = new Professor();
}