/**
 * search.js
 * 4 jan 2017
**/

function Search() {

    this.initComboBoxes();

    var self = this;
    $('#btnReset').click(function() {
    	self.resetForm();

    	$('.summary-wrap div').empty();
    	$('.search-results').empty();
    	$('.empty-data').show();
    })

    // don't reload page, just process here
    $('form').submit(function(e) {
    	e.preventDefault();

    	$('.links').empty(); // reset page numbers on new form submit

    	self.search();
    })

    // on perPage change, reset page number to 1 to avoid out of bounds
    $('#txtPerPage').selectize()[0].selectize.on('change', function() {
    	$('.links').empty(); // clear page numbers

    	var display = $('.empty-data').css('display');
    	if (display == 'none') { // if there is content, search
    		self.search();
    	}
    	
    })

	$('#ratingsForm').on('courseSubmitted', function() {
        var submitted = parseInt($('#numCourses').text());
        submitted = submitted - 1 <= 0 ? 0 : submitted - 1;
        $('#numCourses').text(submitted);

        if (submitted == 0) {
            $('#btnDone').slideDown();
        }
    })

    $('.for-scrolling').scroll(function() {
    	var summaryOffset = $('.summary-wrap').offset().top;
    	var wrapOffset = $('.search-results-wrap').offset().top;

    	if (summaryOffset < 0) {
    		$('.summary-wrap').addClass('fix');
    	} else if (wrapOffset >= 0) {
    		$('.summary-wrap').removeClass('fix');
    	}
    })


	// show modal on page load
    //$('#modal').modal({backdrop: 'static'});
}

Search.prototype.search = function() {
	var query = this.buildQuery();

	$('.summary').empty();
	$('.links').empty();
	$('.search-results').empty();

	console.log(query);
	this.processQuery('?' + query);
}

Search.prototype.initComboBoxes = function() {
	$('#txtProfSearch').selectize({
        valueField: 'value',
        labelField: 'name',
        searchField: 'name',
        sortField: 'name',
        maxItems: null,
        selectOnTab: true,
        closeAfterSelect: true,
        loadThrottle: 150,
        render: {
            option: function(item, escape) {
                return '<div>' + escape(item.name) + '</div>';
            }
        },
        load: function(query, callback) {
            if (!query.length) return callback();
            $.ajax({
                url: API_FIND_PROFS + '?q='+encodeURIComponent(query),
                type: 'GET',
                error: function() {
                    callback();
                },
                success: function(res) {
                    for (var i = 0; i < res.length; i++) {
                        res[i]['value'] = res[i].name;
                    }
                    callback(res);
                }
            });
        }
    });

	$('#txtDept').selectize({
        valueField: 'dept_id',
        labelField: 'dept_id',
        searchField: 'dept_id',
        sortField: 'dept_id',
        selectOnTab: true,
        maxItems: null,
        selectOnTab: true,
        onInitialize: function() {
       		var self = this;
       		$.get(API_DEPARTMENTS, function(data) {
       			self.addOption(data);
       		})
        }
    });

    $('#txtGened').selectize({
    	sortField: 'text',
    	maxItems: null,
        selectOnTab: true,
    	render: {
    		item: function(item, escape) {
    			return '<div>' + item.value + '</div>'
    		}
    	},
    	onInitialize: function() {
    		this.clear();
    	}
    });

    $('#txtSort').selectize({
    });

    $('#txtPerPage').selectize({
    });
}

// clear all input fields
Search.prototype.resetForm = function() {
	$('.form-group > input').each(function(index) {
		$(this).val('');
	});

	$('.form-group > select').each(function(index) {
		var id = $(this).attr('id');
		$(this).selectize()[0].selectize.clear(false);
		if (id == 'txtSort') {
			$(this).selectize()[0].selectize.addItem('course_id');
		}
	})
}

// build querystring from input fields in search form
Search.prototype.buildQuery = function() {
	var params = {};

	$('.form-group > input').each(function(index) {
		params[$(this).attr('name')] = $(this).val()
	});

	$('.form-group > select').each(function(index) {
		var name = $(this).attr('name');
		var val = [].concat($(this).val()); // converts val to array if string or null
		params[name] = val.join(',');
	});

	$('.radio input:checked').each(function(index) {
		params.gened_type = $(this).val();
	})

	var page = $('#txtPage')[0] ? $('#txtPage').val() : 1;

	return $.param(params).replace(/%2C/g, ',') + '&page='+page;
}

// use query to search for courses
Search.prototype.processQuery = function(query) {
	$('.empty-data').hide();
	$('.data-loading').show();

	var self = this;
	var $summaryWrap = $('.summary');
	var $linksWrap = $('.links');
	var $resultsWrap = $('.search-results');

	// add semester array to node DB, allow lookup on umd.io 
	$.get(API_FIND_COURSES + query, function(response) {

		if (response.length == 0) {
			$('.data-loading').hide();
			$('.empty-data').show();
		} else {
			var total = response[0].total_matches;
			var data = response[1];
			var page = getPage(query);
			var perPage = $('#txtPerPage').val();

			var $summary = $('<h4/>');
			var $links = $('.search-results-wrap .links');

			$summary.text('Found '+total+' courses, showing '+data.length+'.');
			$summaryWrap.append($summary);

			self.initPageBox(page, perPage, total, $linksWrap);

			// compile handlebars template
			var source = $('#search-result-template').html();
			var template = Handlebars.compile(source);

			// create item for all courses
			for (var i = 0; i < data.length; i++) {

				$('.data-loading').hide();

				var course = data[i];

				var $item = generateSearchItem(course, template);
				$resultsWrap.append($item);
				$resultsWrap.append($('<hr/>'));
			}
		}
	});
}

Search.prototype.initPageBox = function (page, perPage, total, $wrapper) {
	var $box = $('<select/>', {name: 'page', id: 'txtPage'});

	var numPages = Math.ceil(total / perPage);

	for (var i = 1; i <= numPages; i++) {
		var $opt = $('<option/>', {text: i, value: i});
		$box.append($opt);
	}

	var $prev = $('<a/>', {id: 'prev'}).html('<i class="glyphicon glyphicon-triangle-left"></i> Prev');
	var $next = $('<a/>', {id: 'next'}).html('<i class="glyphicon glyphicon-triangle-right"></i> Next');

	$prev.click(function() {
		var box = $('#txtPage').selectize()[0].selectize;
    	box.addItem(parseInt($('#txtPage').val()) - 1);
    })

    $next.click(function() {
		var box = $('#txtPage').selectize()[0].selectize;
    	box.addItem(parseInt($('#txtPage').val()) + 1);
    })

	$wrapper.append($prev).append($box).append(' of '+numPages).append($next);
	var box = $box.selectize()[0].selectize;

	box.addItem(page);

	var self = this;
	box.on('change', function() {
		self.search();
	})
}

// given a course, generate search result item from course info
// uses Handlebar
function generateSearchItem(course, template) {

	var url = 'viewcourse.html?from=search&id=' + course.course_id + '&semester=' + course.semester;

	var data = {
		course_id: course.course_id,
		link: url,
		has_reviews: course.avg_diff > 0 && course.avg_int > 0,
		diff_rating: course.avg_diff ? course.avg_diff.toFixed(1) : 'N/A',
		int_rating: course.avg_int ? course.avg_int.toFixed(1) : 'N/A',
		semester: course.semester,
		title: course.name,
		semester_string: getSemester(course.semester),
		gen_ed: course.gen_ed.join(', ') || 'None',
		credits: course.credits,
		description: course.description
	};

	var body = template(data);

	return body;
}

function saveFormData() {
	var storage = window.localStorage;
	storage.setItem('keyword', $('#txtKeyword').val());
	storage.setItem('dept', $('#txtDept').val());
	storage.setItem('gened', $('#txtGened').val());
}

function loadFormData() {
	var storage = window.localStorage;
	$('#txtKeyword').val(storage.getItem('keyword'));
	$('#txtDept').selectize()[0].selectize.addItem({dept_id: 'CMSC'});
	$('#txtDept').val(storage.getItem('dept')); // fix
	$('#txtGened').val(storage.getItem('gened')); // fix
}

function getPage(query) {
	return query.match(/&page=(\d+)/)[1];
}




window.onload = function() {
	window.ratingsForm = new RatingsForm();
	window.Search = new Search();
}