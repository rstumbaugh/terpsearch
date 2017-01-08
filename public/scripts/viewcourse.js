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

function ViewCourse() {
    this.commentBtn = document.getElementById('btnAddComment');

	this.database = firebase.database();
    this.commentBtn.addEventListener('click', this.submitComment.bind(this));

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

    //this.refactorDB(getUrlVars()['id']);
    var showComments = this.displayComments;

    this.initDisplay();
    this.loadDataAPI(course, semester);
    this.loadStats(course, function(data) {

        showComments(data.comments);

        if (data.totalCount > 0) {
            $('.ratings .empty-data').hide();
        } else {
            $('#noReviewPanel').show();
        }

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
    })
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

                console.log('got information from API...');
            } else {
                // no course found in current semester
            }

            

        },
        error: function(xhr, status, error) {
            $('#error').text('db error');
            console.log('error');
        }
    });
}

ViewCourse.prototype.loadStats = function(course, callback) {

    var circleDiff = this.circleDiff;
    var circleInt = this.circleInt;

    $.get(API_COURSE_STATS + '?course_id=' + course, function(data) {

        var avgDiff = data.totalDiffAvg.toFixed(1);
        var avgInt = data.totalIntAvg.toFixed(1);

        // populate easy fields first (num responses, average labels, etc)
        $('.numResponses').text(data.totalCount);
        $('#avgDiff').text(avgDiff);
        $('#avgInt').text(avgInt);

        // create & animate circular progress bars
        // maybe create on page load, animate here?
        circleDiff.animate(avgDiff / 5.0);
        circleInt.animate(avgInt / 5.0);

        // create & animate charts
        initChart($('#diffChart'), data.diffCounts);
        initChart($('#intChart'), data.intCounts);

        // show professor info
        // need to make new element, initProfessorProgress for each
        var profs = data.profs;

        var $diffWrap = $('.ratings .difficulty .prof-wrap');
        var $intWrap = $('.ratings .interest .prof-wrap');

        for (var i = 0; i < profs.length; i++) {
            var diffId = 'diffBar' + i;
            var intId = 'intBar' + i;

            var $prof = $('<div/>', {'class': 'prof'});
            var $span = $('<span/>');
            var $diffBar = $('<div/>', {'id': diffId});
            var $intBar = $('<div/>', {'id': intId});

            console.log(profs[i]);
            $span.html('<strong>'+profs[i].name+'</strong>, <i>'+profs[i].numResponses+' responses</i>');


            $prof.append($span);

            $diffWrap.append($prof.clone().append($('<div/>').append($diffBar)));
            $intWrap.append($prof.clone().append($('<div/>').append($intBar)));

            initProfessorProgress('#'+diffId, profs[i].diffAvg.toFixed(1));
            initProfessorProgress('#'+intId, profs[i].intAvg.toFixed(1));
        }


        callback(data);
    })
}

ViewCourse.prototype.displayComments = function(comments) {
    
    var $wrap = $('.comments .comment-wrap');

    if (comments && comments.length > 0) {
        // remove empty data template
        $('.comment-wrap .empty-data').hide();
        for (var i = 0; i < comments.length; i++) {
            var comment = comments[i];
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