/**
 * viewcourse.js
 * 19 Dec 2016
**/

/**

    MAYBE TODO: only show a few profs / comments, 'show more' button

**/

function ViewCourse() {

    var self = this;
    var course = getUrlVars()['id'].toUpperCase().split('#')[0];
    var semester = getUrlVars()['semester'].split('#')[0];

    this.initEventHandlers();
    this.initDisplay();
    this.loadDataAPI(course, semester);
    this.loadStats(course, function(data) {

        self.displayComments(data.comments);

        if (data.totalCount > 0) {
            $('.ratings .empty-data').hide();
        } else {
            $('#noReviewPanel').show();
        }

        // check if course is actually offered at UMD
        // done here to initialize graphs, progress bars first
        $.get(API_FIND_COURSES + '?course_id=' + course, function(data) {

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

// add event handlers for buttons, etc
ViewCourse.prototype.initEventHandlers = function() {
    var self = this;

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

    $('#btnAddComment').click(function() {
        self.submitComment();
    })
}

// prepare elements with default values before things are loaded
ViewCourse.prototype.initDisplay = function() {
    $('#commentSuccessMsg').hide();
    $('#commentErrorMsg').hide();

    this.circleDiff = initCircularProgress('#avgDifficulty');
    this.circleInt = initCircularProgress('#avgInterest');

    var prev = getUrlVars()['from'];

    if (prev && prev == 'search') {
        $('#back').show();
    }
}


// load course information from API
ViewCourse.prototype.loadDataAPI = function(course, semester) {
    var url = API_FIND_COURSES + '?course_id=' + course;;

    // load course information from api
    $.get(url, function(data) {
        if (data.length > 0) {
            var obj = data[1][0];
            var desc = obj.description;
            var relations = obj.relationships;
            var credits = obj.credits;
            var dept = obj.dept_id;
            var profs = obj.professors;
            var link = 'https://ntst.umd.edu/soc/'+semester+'/'+dept+'/'+course;

            $('#courseName').text(obj.course_id);
            $('#courseTitle').text(obj.name);
            $('#credits').text(credits + ' credits');
            $('#semester').text(getSemester(semester));
            $('#gened').text(obj.gen_ed.join(', ') || 'None');
            $('#core').text(obj.core.join(', ') || 'None');
            $('#testudoLink').attr('href', link);
            $('#description').text(desc);

            var $profs = $('#taughtBy')
            for (var i = 0; i < profs.length; i++) {
                $profs.append($('<a/>', {text: profs[i], href: '#'}));
                if (i < profs.length - 1) {
                    $profs.append(', ');
                }
            }

            var relationsArr = ['prereqs', 'coreqs', 'restrictions', 'credit_granted_for', 'also_offered_as', 
                                'formerly', 'additional_info'];

            relationsArr.forEach(function(rel) {
                loadRelationship(rel, relations[rel]);
            });

            

            console.log('got information from API...');
        } else {
            // no course found in current semester
        }
    });
}

// load and display course stats from API
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
}


// validate and submit comment, push to db
ViewCourse.prototype.submitComment = function() {
    $('#commentSuccessMsg').hide();
    $('#commentErrorMsg').hide();
    $('#commentWrap').removeClass('has-error');

    var len = $('#txtComment').val().length;

    if (len < 25) {
        $('#commentWrap').addClass('has-error');
        $('#commentErrorMsg').text('Comment must be at least 25 characters.');
        $('#commentErrorMsg').slideDown();
    } else {

        // kinda hacky, but don't fuck with the HTML or you'll get an error
        if ($('.invalid-course').css('display') == 'none') {

            var comment = $('#txtComment').val();
            var name = $('#txtName').val();
            name = name ? name: 'anonymous';

            var obj = {
                course_id: $('#courseName').text(),
                comment: comment,
                name: name
            }
            
            $.post(API_ADD_COMMENT, obj, function(data) {
                $('#commentSuccessMsg').slideDown();
                $('#txtComment').val('');
                $('#txtName').val('');
                $('#charsRemaining').text('25');
            }).fail(function(err) {
                console.log('error: '+err.responseText);
            });

            
        } else {
            $('#commentErrorMsg').text('Invalid course.');
            $('#commentErrorMsg').slideDown();
        }
    }
}

function loadRelationship(relationship, value) {
    if (value) {
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