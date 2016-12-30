/**
 * viewcourse.js
 * 19 Dec 2016
**/

/**
    need to load overall avg and professor avg
    load by professor (store as hash) and calc overall from that

    problem: need to protect against typos with professors (or wrong professors)
        maybe check against API? for this page, assume all profs are good. deal with this
        problem when adding reviews


    SOLUTION: instead of textbox for professors, have dropdown list of all profs available on API
        for given course for past 6 semesters or so
**/

/**

    DEFINITElY need to show some sort of loading, etc while waiting for all data / calculations to load
    in the future look into ways to speed everything up.. maybe has to do with downloading too much info?
    probably not..
**/

ViewCourse.prototype.refactorDB = function(course) {
    var ref = this.database.ref('/courses');
    
    var max = 0;
    var id;
    ref.once('value', function(data) {

        for (var course in data.val()) {
            var len = Object.keys(data.val()[course]['ratings']).length
            if (len > max) {
                max = len;
                id = course;
            }
            // for (var rating in data.val()[course]['ratings']) {
            //     var obj = data.val()[course]['ratings'][rating];
            //     obj['professor'] = 'Other';
            //     console.log(obj);
            //     ref.child(course+'/ratings/'+rating).set(obj);
            // }
        }
        console.log(id+': '+max+' responses');
    });

    
    
};

function ViewCourse() {
    this.commentBtn = document.getElementById('btnAddComment');

	this.database = firebase.database();
    this.commentBtn.addEventListener('click', this.submitComment.bind(this));

    // declaring up here for organization's sake
    this.difficultyCounts = [0,0,0,0,0];
    this.interestCounts = [0,0,0,0,0];
    this.overallCount = 0;
    this.overallAvg = 0.0;
    this.courseStats = {};

    $("#btnToComment").click(function() {
        console.log($('html,body').scrollTop);
        $('html,body').animate({
            scrollTop: $('#comments').offset().top
        }, 1000, "easeInOutCubic");
    });


    $('#txtComment').bind('input propertychange', function() {
        var len = $(this).val().length;
        $('#charsRemaining').text(25 - len > 0 ? 25 - len : 0);
    });

    $('#commentSuccessMsg').hide();
    $('#commentErrorMsg').hide();

    var course = getUrlVars()["id"].toUpperCase().split('#')[0];
    

    var myClass = this;
    this.refactorDB(getUrlVars()["id"]);

    this.loadDataAPI(course);
	this.loadDataDB(course, function(profReviews) {
        myClass.calculateStats(profReviews);
        myClass.displayStats();
    });
}



// load course information from API
ViewCourse.prototype.loadDataAPI = function(course) {
    var url = API_ROOT + "courses?course_id="+course;

    $.ajax({
        method: "GET",
        dataType: "json",
        url: url,
        data: "",
        success: function(data) {
            // if data == [], no course found
            // need to check for!
            var obj = data[0];
            var desc = obj["description"];
            var relations = obj["relationships"];

            $('#courseName').text(obj['course_id']);
            $('#courseTitle').text(obj["name"]);
            $('#txtCourse').val(course);

            var relationsArr = ['prereqs', 'coreqs', 'restrictions', 'credit_granted_for', 'also_offered_as', 'formerly', 'additional_info'];
            relationsArr.forEach(function(rel) {
                loadRelationship(rel, relations[rel]);
            });

            $('#description').text(desc);

            $('.course-content').show();
            $('.content-loading').hide();

            console.log("got information from API...");

        },
        error: function(xhr, status, error) {
            $('#error').text("db error");
            console.log('error');
        }
    });
}

// load course information from DB, call method to load from API
ViewCourse.prototype.loadDataDB = function(course, callback) {

    // get ratings by professor
    this.database.ref('/courses/'+course+'/ratings').once('value', function(data) {
        var profReviews = {};

        // traverse rating entries
        for (var key in data.val()) {

            var obj = data.val()[key];
            var prof = obj['professor'];
            var diffRating = obj['difficulty'];
            var intRating = obj['interest'];

            // add rating to profReviews (professor => [array of diffs, array of ints])
            if (prof in profReviews) {

                var diff = profReviews[prof]['diffs'];
                var interest = profReviews[prof]['ints'];

                diff.push(diffRating);
                interest.push(intRating);

                profReviews[prof] = { diffs: diff, ints: interest };
            } else {
                profReviews[prof] = { diffs: [diffRating], ints: [intRating] };
            }
        }

        console.log('got information from database...');

        // call callback with resulting information broken down by professors
        // callback will process & display this data
        callback(profReviews);
    });
}

// calculate professor averages and overall averages
ViewCourse.prototype.calculateStats = function(profReviews) {

    var diffCounts = [0,0,0,0,0];
    var intCounts = [0,0,0,0,0];
    var totalDiffs = 0;
    var totalInts = 0;
    var totalCount = 0;

    // go through each prof
    for (var prof in profReviews) {
        var diffs = profReviews[prof]['diffs'];
        var ints = profReviews[prof]['ints'];

        profReviews[prof]['numResponses'] = diffs.length;

        // get sum of all difficulties and interests
        var diffSum = 0, intSum = 0;
        for (var i = 0; i < diffs.length; i++) {
            diffSum += diffs[i];
            intSum += ints[i];

            // also increment counts for graphs
            diffCounts[diffs[i]-1]++;
            intCounts[ints[i]-1]++;

            totalDiffs += diffs[i];
            totalInts += ints[i];
        }

        // keep track of overall total number of responses
        totalCount += diffs.length;

        var diffAvg = diffSum / diffs.length;
        var intAvg = intSum / diffs.length;

        // add field for averages to prof object
        profReviews[prof]['diffAvg'] = diffAvg;
        profReviews[prof]['intAvg'] = intAvg;
    }

    this.courseStats = {
        profs: profReviews,
        diffCounts: diffCounts,
        intCounts: intCounts,
        totalDiffScore: totalDiffs,
        totalIntScore: totalInts,
        totalCount: totalCount
    };


    console.log('processed information...');
}

ViewCourse.prototype.displayStats = function() {

    // need to display average difficulty and interest
    // need to populate difficulty and interest charts
    // need to add a professor entry for each professor in courseStats

    var avgDiff = this.courseStats.totalDiffScore / this.courseStats.totalCount;
    var avgInt = this.courseStats.totalIntScore / this.courseStats.totalCount;

    avgDiff = avgDiff.toFixed(1);
    avgInt = avgInt.toFixed(1);

    // populate easy fields first (num responses, average labels, etc)
    $('.numResponses').text(this.courseStats.totalCount);
    $('#avgDiff').text(avgDiff);
    $('#avgInt').text(avgInt);

    // create & animate circular progress bars
    // maybe create on page load, animate here?
    initCircularProgress('#avgDifficulty', avgDiff);
    initCircularProgress('#avgInterest', avgInt);

    // create & animate charts
    initChart($('#diffChart'), this.courseStats.diffCounts);
    initChart($('#intChart'), this.courseStats.intCounts);
}

ViewCourse.prototype.initProgressBars = function() {


    initProfessorProgress('#mamat-avg-diff', 3.4);
    initProfessorProgress('#kruskal-avg-diff', 2.1);
    
};

ViewCourse.prototype.initCharts = function() {
    var diffData = [1,2,3,3,2];
    var intData = [2,3,5,4,4];

    initChart($('#diffChart'), diffData);
    initChart($('#intChart'), intData);
};

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