/**
 * viewcourse.js
 * 19 Dec 2016
**/


ViewCourse.prototype.refactorDB = function(course) {
    var ref = this.database.ref('/courses');
    

    
};

function ViewCourse() {
    this.commentBtn = document.getElementById('btnAddComment');

	this.database = firebase.database();
    this.commentBtn.addEventListener('click', this.submitComment.bind(this));

    $("#btnToComment").click(function() {
        $('html, body').animate({
            scrollTop: $("#comments").offset().top
        }, 2000, "easeInOutCubic");
    });


    $('#txtComment').bind('input propertychange', function() {
        var len = $(this).val().length;
        $('#charsRemaining').text(25 - len > 0 ? 25 - len : 0);
    });

    $('#commentSuccessMsg').hide();
    $('#commentErrorMsg').hide();

    //this.refactorDB(getUrlVars()["id"]);
	this.loadCourseData();
    this.initProgressBars();
    this.initCharts();
}

// validate and submit comment, push to db
ViewCourse.prototype.submitComment = function() {
    $('#commentSuccessMsg').hide();
    $('#commentErrorMsg').hide();
    $('#commentWrap').removeClass('has-error');

    var len = $('#txtComment').val().length;
    if (len < 25) {
        $('#commentWrap').addClass('has-error');
        $('#commentErrorMsg').slideDown();
    } else {
        var ref = this.database.ref('/courses_test/'+$('#courseName').text()+'/comments');

        var comment = $('#txtComment').val();
        var name = $('#txtName').val();
        name = name ? name: 'anonymous';

        var obj = {
            comment: comment,
            name: name
        }
        
        ref.push(obj);

        $('#commentSuccessMsg').slideDown();
        $('#txtComment').val('');
        $('#txtName').val('');
        $('#charsRemaining').text('25');
    }
}

// load course information from DB, call method to load from API
ViewCourse.prototype.loadCourseData = function() {
	var course = getUrlVars()["id"].toUpperCase().split('#')[0];
	$('#courseName').text(course);

	this.queryCourse(course);

    this.database.ref('/courses/'+course).on('value', function(data) {
        for (var key in data.val()) {
            //console.log(data.val()[key]);
        }
    });
}

// load course information from API
ViewCourse.prototype.queryCourse = function(course) {
        var url = API_ROOT + "courses?course_id="+course;
    $.ajax({
        method: "GET",
        dataType: "json",
        url: url,
        data: "",
        success: function(data) {
            // if data == [], no course found
            var obj = data[0];
            var desc = obj["description"];
            var relations = obj["relationships"];

            $('#courseTitle').text(obj["name"]);
            $('#txtCourse').val(course);

            var relationsArr = ['prereqs', 'coreqs', 'restrictions', 'credit_granted_for', 'also_offered_as', 'formerly', 'additional_info'];
            relationsArr.forEach(function(rel) {
                loadRelationship(rel, relations[rel]);
            });

            $('#description').text(desc);

            $('.course-content').show();
            $('.content-loading').hide();

        },
        error: function(xhr, status, error) {
            $('#error').text("db error");
            console.log('error');
        }
    });
}

ViewCourse.prototype.initProgressBars = function() {


    initCircularProgress('#avgDifficulty', 3.6);
    initCircularProgress('#avgInterest', 4.1)
    


    initProfessorProgress('#mamat-avg-diff', 3.4);
    initProfessorProgress('#kruskal-avg-diff', 2.1);
    
};

ViewCourse.prototype.initCharts = function() {
    var diffData = [1,2,3,3,2];
    var intData = [2,3,5,4,4];

    initChart($('#diffChart'), diffData);
    initChart($('#intChart'), intData);
};




function loadRelationship(relationship, value) {
    if (value != null) {
        $('#'+relationship).text(value);
    } else {
        $('#relationship_'+relationship).hide();
    }
}

function initChart(chart, dataArr) {
    var data = {
        labels: ["1", "2", "3", "4", "5"],
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

function initProfessorProgress(id, avgRating) {
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

function initCircularProgress(id, rating) {
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

    bar.animate(rating/5.0);
    bar.text.style.color = '#333';
}


// returns object of querystring params and values
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}







window.onload = function() {
    window.viewCourse = new ViewCourse();
};