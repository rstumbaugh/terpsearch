/**
 * viewcourse.js
 * 19 Dec 2016
**/

/**
    MAYBE TODO: only show a few profs / comments, 'show more' button
**/

/**

    definitely need to show some sort of loading, etc while waiting for all data / calculations to load
    in the future look into ways to speed everything up..

    idea: do calculations in database when storing info. then retrieving calculations is just a DB call
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

    $('#goBack').click(function() {
        window.history.back();
    });

    $('#btnToComment').click(function() {
        $('.for-scrolling').animate({
            scrollTop: $('#comments').offset().top
        }, 1000, 'easeInOutCubic');
    });

    $('.to-rating').click(function() {
        $('.for-scrolling').animate({
            scrollTop: $('#ratingsForm').offset().top
        }, 1000, 'easeInOutCubic');
    });

    $('#txtComment').bind('input propertychange', function() {
        var len = $(this).val().length;
        $('#charsRemaining').text(25 - len > 0 ? 25 - len : 0);
    });

    $('#commentSuccessMsg').hide();
    $('#commentErrorMsg').hide();

    var course = getUrlVars()['id'].toUpperCase().split('#')[0];
    var semester = getUrlVars()['semester'].split('#')[0];

    var myClass = this;
    //this.refactorDB(getUrlVars()['id']);

    this.initDisplay();
    this.loadDataAPI(course, semester);
	this.loadDataDB(course, function(data) {

        myClass.calculateStats(data);
        myClass.displayStats();
        myClass.displayComments();

        // check if course is actually offered at UMD
        // done here to initialize graphs, progress bars first
        $.get(API_COURSE_EXISTS + '/' + course, function(data) {

            $('.content-loading').hide();

            if (data.length > 0) {
                $('.course-content').show();
            } else {
                $('.invalid-course').show();
                $('#invalidCourse').text(course);
            }
        })
        
        
    });
}

// prepare elements with default values before things are loaded
ViewCourse.prototype.initDisplay = function() {
    this.circleDiff = initCircularProgress('#avgDifficulty');
    this.circleInt = initCircularProgress('#avgInterest');

    var prev = getUrlVars()['from'];

    if (prev && prev == 'search') {
        $('#back').show();
    }
}


// load course information from API
ViewCourse.prototype.loadDataAPI = function(course, semester) {
    var url = UMD_API_ROOT + 'courses?course_id=' + course + '&semester=' + semester;

    $.ajax({
        method: 'GET',
        dataType: 'json',
        url: url,
        data: '',
        success: function(data) {

            if (data.length > 0) {
                var obj = data[0];
                var desc = obj.description;
                var relations = obj.relationships;
                var credits = obj.credits;
                var dept = obj.dept_id;
                var link = 'https://ntst.umd.edu/soc/'+semester+'/'+dept+'/'+course;

                $('#courseName').text(obj['course_id']);
                $('#courseTitle').text(obj['name']);
                $('#txtCourse').val(course);
                $('#credits').text(credits + ' credits');
                $('#semester').text(getSemester(semester));

                $('#testudoLink').attr('href', link);

                var relationsArr = ['prereqs', 'coreqs', 'restrictions', 'credit_granted_for', 'also_offered_as', 
                                    'formerly', 'additional_info'];

                relationsArr.forEach(function(rel) {
                    loadRelationship(rel, relations[rel]);
                });

                $('#description').text(desc);
            } else {
                // no course found in current semester
            }

            console.log('got information from API...');

        },
        error: function(xhr, status, error) {
            $('#error').text('db error');
            console.log('error');
        }
    });
}

// load course information from DB, call method to load from API
ViewCourse.prototype.loadDataDB = function(course, callback) {


    // get ratings by professor
    this.database.ref('/courses/'+course+'/').once('value', function(snapshot) {

        // traverse rating entries
        var course = snapshot.val();
        var data = {reviews: [], comments: []};
        if (course) {

            // hide empty value labels
            $('.ratings .empty-data').hide();
            for (var key in course.ratings) {

                var obj = course.ratings[key];
                var prof = obj.professor;
                var diffRating = obj.difficulty;
                var intRating = obj.interest;

                // add rating to data.reviews (professor => [array of diffs, array of ints])
                if (prof in data.reviews) {

                    var diff = data.reviews[prof].diffs;
                    var interest = data.reviews[prof].ints;

                    diff.push(diffRating);
                    interest.push(intRating);

                    data.reviews[prof] = { diffs: diff, ints: interest };
                } else {
                    data.reviews[prof] = { diffs: [diffRating], ints: [intRating] };
                }
            }

            data.comments = course.comments;
            
        } else {
            // course not found in db, leave as empty values and show info box
            
            $('#noReviewPanel').show();
        }

        // call callback with resulting information broken down by professors
        // callback will process & display this data
        callback(data);

        console.log('got information from database...');

        
    });
}

// calculate professor averages and overall averages
ViewCourse.prototype.calculateStats = function(data) {

    var diffCounts = [0,0,0,0,0];
    var intCounts = [0,0,0,0,0];
    var totalDiffs = 0;
    var totalInts = 0;
    var totalCount = 0;
    var profs = []

    // go through each prof
    var profReviews = data.reviews;
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

        profReviews[prof].name = prof;
        profs.push(profReviews[prof]);
    }

    // sort profs array, put 'other' at the end
    var other;
    profs = profs.filter(function(e) {
        if (e.name == 'Other')
            other = e;
        return e.name != 'Other';
    }).sort();
    if (other) {
        profs.push(other);
    }
    
    this.courseStats = {
        profs: profs,
        comments: data.comments,
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

    var avgDiff = 0;
    var avgInt = 0;
    if (this.courseStats.totalCount > 0) {
        avgDiff = this.courseStats.totalDiffScore / this.courseStats.totalCount;
        avgInt = this.courseStats.totalIntScore / this.courseStats.totalCount;
    }

    avgDiff = avgDiff.toFixed(1);
    avgInt = avgInt.toFixed(1);

    // populate easy fields first (num responses, average labels, etc)
    $('.numResponses').text(this.courseStats.totalCount);
    $('#avgDiff').text(avgDiff);
    $('#avgInt').text(avgInt);

    // create & animate circular progress bars
    // maybe create on page load, animate here?
    this.circleDiff.animate(avgDiff / 5.0);
    this.circleInt.animate(avgInt / 5.0);

    // create & animate charts
    initChart($('#diffChart'), this.courseStats.diffCounts);
    initChart($('#intChart'), this.courseStats.intCounts);

    // show professor info
    // need to make new element, initProfessorProgress for each
    var profs = this.courseStats.profs;

    var $diffWrap = $('.ratings .difficulty .prof-wrap');
    var $intWrap = $('.ratings .interest .prof-wrap');

    for (var i = 0; i < profs.length; i++) {
        var diffId = 'diffBar' + i;
        var intId = 'intBar' + i;

        var $prof = $('<div/>', {'class': 'prof'});
        var $span = $('<span/>');
        var $diffBar = $('<div/>', {'id': diffId});
        var $intBar = $('<div/>', {'id': intId});

        $span.html('<strong>'+profs[i].name+'</strong>, <i>'+profs[i].numResponses+' responses</i>');


        $prof.append($span);


        $diffWrap.append($prof.clone().append($('<div/>').append($diffBar)));
        $intWrap.append($prof.clone().append($('<div/>').append($intBar)));

        initProfessorProgress('#'+diffId, profs[i].diffAvg.toFixed(1));
        initProfessorProgress('#'+intId, profs[i].intAvg.toFixed(1));
    }

    console.log('displayed data...');
}

ViewCourse.prototype.displayComments = function() {
    
    var comments = this.courseStats.comments;
    var $wrap = $('.comments .comment-wrap');

    if (comments && Object.keys(comments).length > 0) {
        // remove empty data template
        $('.comment-wrap .empty-data').hide();
        for (var key in comments) {
            var comment = comments[key];
            var $div = $('<div/>');
            var $quote = $('<blockquote/>');
            var $cite = $('<cite/>');

            $quote.text(comment.comment);
            $cite.text('\u2014 '+comment.name);

            $quote.append($cite);

            $div.append($quote);

            $wrap.append($div);
        }
    }

    

    console.log('displayed comments...');
}


// validate and submit comment, push to db
ViewCourse.prototype.submitComment = function() {
    $('#commentSuccessMsg').hide();
    $('#commentErrorMsg').hide();
    $('#commentWrap').removeClass('has-error');
    alert('hey erin');
    var len = $('#txtComment').val().length;

    if (len < 25) {
        $('#commentWrap').addClass('has-error');
        $('#commentErrorMsg').text('Comment must be at least 25 characters.');
        $('#commentErrorMsg').slideDown();
    } else {

        if ($('.invalid-course').css('display') == 'none') {
            var ref = this.database.ref('/courses/'+$('#courseName').text()+'/comments');

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
        } else {
            $('#commentErrorMsg').text('Invalid course.');
            $('#commentErrorMsg').slideDown();
        }

        
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
    window.viewCourse = new ViewCourse();
    window.ratingsForm = new RatingsForm();
};