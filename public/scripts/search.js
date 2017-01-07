/**
 * search.js
 * 4 jan 2017
**/

function Search() {

	var query = window.location.href.split('?')[1];


	if (query) {
		this.processQuery('?' + query);
	}
}

Search.prototype.processQuery = function(query) {
	console.log('processing query');

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
			var id = course.course_id;
			var semester = course.semester;

			var url = 'viewcourse.html?from=search&id=' + id + '&semester=' + semester;

			
			

			var $div = $('<div/>');
			var $a = $('<a/>', {'href': url});
			$a.text(id);

			$div.append($a);
			$resultsWrap.append($div);
		}
	});
}


window.onload = function() {
	window.Search = new Search();
}