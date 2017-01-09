/**
 * search.js
 * 4 jan 2017
**/

function Search() {

	this.initCombobox('#txtDept');


	var query = window.location.href.split('?')[1];

	if (query) {
		this.processQuery('?' + query);
	} else {
		$('.data-loading').hide();
		$('.empty-data').show();
	}



}

Search.prototype.processQuery = function(query) {
	console.log('processing query');

	var $resultsWrap = $('.search-results-wrap');

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

Search.prototype.initCombobox = function(id) {
    $(id).selectize({
        valueField: 'value',
        labelField: 'dept_id',
        searchField: 'dept_id',
        sortField: 'dept_id',
        selectOnTab: true,
        closeAfterSelect: true,
        loadThrottle: 50,
        create: false,
        render: {
            option: function(item, escape) {
                return '<div>' +
                    '<span class="title">' +
                        '<span>' + escape(item.dept_id) + '</span>' +
                    '</span>'
                '</div>';
            }
        },
        load: function(query, callback) {
            $.ajax({
                url: API_DEPARTMENTS,
                type: 'GET',
                error: function() {
                    callback();
                },
                success: function(res) {
                    for (var i = 0; i < res.length; i++) {
                        res[i]['value'] = res[i].dept_id;
                    }
                    callback(res);
                }
            });
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
		diff_rating: 3.2,
		int_rating: 2.5,
		semester: course.semester,
		title: course.name,
		semester_string: getSemester(course.semester),
		gen_ed: course.gen_ed.join(', ') || 'None',
		credits: course.credits,
		description: course.description
	};
	

	var body = template(data);

	//var $a = $('<a/>', {'href': url});
	//$a.html(body);

	return body;
}


window.onload = function() {
	window.Search = new Search();
}