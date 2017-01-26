function Professor() {
	this.name = decodeURIComponent(getUrlVars()['name']);

	this.initDisplay();

	var ps = [];
	ps.push(this.loadInfo());
	ps.push(this.loadStats());
	Promise.all(ps).then(function() {
		$('.loading').hide();
		$('.info-wrap').show();
	})


	$('#goBack').click(function() {
        window.history.back();
    });
}

Professor.prototype.initDisplay = function() {
	var prev = getUrlVars()['from'];

	this.circleDiff = initCircularProgress('#avgDifficulty');
    this.circleInt = initCircularProgress('#avgInterest');

    if (prev) {
        $('#goBack').text('Back to '+prev);
        $('#back').show();
    }
}

// load basic info (name, courses taught)
Professor.prototype.loadInfo = function() {	
	var p = $.get(API_FIND_PROFS + '?name='+encodeURIComponent(this.name));
	
	return new Promise(function(resolve, reject) {
		p.done(function(data) {
			var obj = data[0];

			$('#name').text(obj.name);
			for (var i = 0; i < obj.courses.length; i++) {
				var $a = $('<a/>', {text: obj.courses[i], href: 'viewcourse.html?id='+obj.courses[i], target: '_blank'});
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

Professor.prototype.loadStats = function() {
	return new Promise(function(resolve, reject) {
		resolve();
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
                        stepSize: 1
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

function animateCircularProgress(id, rating) {
    bar.animate(rating/5.0);
}


window.onload = function() {
	window.professor = new Professor();
}