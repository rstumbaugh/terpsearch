/**
 * search.js
 * 4 jan 2017
**/

function Search() {

    this.initComboBoxes();

    var self = this;
    $('#btnReset').click(function() {
    	self.resetForm();
    })

    // don't reload page, just process here
    $('form').submit(function(e) {
    	e.preventDefault();

    	$('.search-results').empty();

    	var query = self.buildQuery();
    	console.log(query);
		self.processQuery('?' + query);
    })

	$('#ratingsForm').on('courseSubmitted', function() {
        var submitted = parseInt($('#numCourses').text());
        submitted = submitted - 1 <= 0 ? 0 : submitted - 1;
        $('#numCourses').text(submitted);

        if (submitted == 0) {
            $('#btnDone').slideDown();
        }
    })


	// show modal on page load
    //$('#modal').modal({backdrop: 'static'});
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
        persist: false,
        create: function(input) {
            return { name: input, value: 'Other'}
        },
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
    	sortField: 'text'
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

	return $.param(params).replace(/%2C/g, ',');
}

// use query to search for courses
Search.prototype.processQuery = function(query) {
	console.log('processing query');

	$('.empty-data').hide();
	$('.data-loading').show();

	var $resultsWrap = $('.search-results');

	// add semester array to node DB, allow lookup on umd.io 
	$.get(API_FIND_COURSES + query, function(response) {

		console.log('found '+(response.length == 0 ? 0 : response[1].length)+' courses');

		if (response.length == 0) {
			$('.data-loading').hide();
			$('.empty-data').show();
		} else {
			var total = response[0].total_matches;
			var data = response[1];

			var $summary = $('<h4/>');
			$summary.text('Found '+total+' courses, showing '+data.length+'.');
			$resultsWrap.append($summary);

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


window.onload = function() {
	window.ratingsForm = new RatingsForm();
	window.Search = new Search();
}