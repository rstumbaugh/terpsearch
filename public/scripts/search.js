/**
 * search.js
 * 4 jan 2017
**/

function Search() {

	$('#txtDept').selectize({
        valueField: 'dept_id',
        labelField: 'dept_id',
        searchField: 'dept_id',
        sortField: 'dept_id',
        selectOnTab: true,
        closeAfterSelect: true,
        onInitialize: function() {
       		var self = this;
       		$.get(API_DEPARTMENTS, function(data) {
       			self.addOption(data);
       		})
        }
    });

    $('#txtGened').selectize({
    	sortField: 'text',
    	onInitialize: function() {
    		this.clear();
    	}
    });

    var self = this;
    $('#btnReset').click(function() {
    	self.resetForm();
    })

    // don't reload page, just process here
    $('form').submit(function(e) {
    	e.preventDefault();

    	$('.search-results').empty();

    	var query = self.buildQuery();
		self.processQuery('?' + query);

    })

}

// clear all input fields
Search.prototype.resetForm = function() {
	$('.form-group > input').each(function(index) {
		$(this).val('');
	});

	$('.form-group > select').each(function(index) {
		$(this).selectize()[0].selectize.clear(false);
	})
}

// build querystring from input fields in search form
Search.prototype.buildQuery = function() {
	var params = {};

	$('.form-group > input').each(function(index) {
		params[$(this).attr('name')] = $(this).val()
	});

	$('.form-group > select').each(function(index) {
		params[$(this).attr('name')] = $(this).val();
	});


	return $.param(params);
}

// use query to search for courses
Search.prototype.processQuery = function(query) {
	console.log('processing query');

	$('.empty-data').hide();
	$('.data-loading').show();

	var $resultsWrap = $('.search-results');

	// add semester array to node DB, allow lookup on umd.io 
	$.get(API_FIND_COURSES + query, function(data) {

		console.log('found '+data.length+' courses');

		if (data.length == 0) {
			$('.data-loading').hide();
			$('.empty-data').show();
		}

		for (var i = 0; i < data.length; i++) {

			$('.data-loading').hide();

			var course = data[i];

			var $item = generateSearchItem(course);
			$resultsWrap.append($item);
			$resultsWrap.append($('<hr/>'));
				
		}
		
		
	});
}


function generateSearchItem(course) {

	var url = 'viewcourse.html?from=search&id=' + course.course_id + '&semester=' + course.semester;

	var source = $('#search-result-template').html();
	var template = Handlebars.compile(source);

	var data = {
		course_id: course.course_id,
		link: url,
		diff_rating: (course.avg_diff ? course.avg_diff : 0).toFixed(1),
		int_rating: (course.avg_int ? course.avg_int : 0).toFixed(1),
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
	window.Search = new Search();
}