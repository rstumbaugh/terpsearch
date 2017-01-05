/**
 * search.js
 * 4 jan 2017
**/

function Search() {

	var query = getUrlVars();

	if (query.length > 0) {
		this.processQuery(query);
	}

	$('form').submit(function(e) {
        e.preventDefault();
    });

	var makeQuery = this.makeQuery;
	$('#btnSearch').click(function() {
		console.log('made query');
		makeQuery();
	})
}

Search.prototype.processQuery = function(query) {
	console.log('processing query');

	var id = query['id'].toUpperCase();

	var $resultsWrap = $('.search-results');

	// add semester array to node DB, allow lookup on umd.io 
	$.get(UMD_API_ROOT + 'courses?course_id=' + id, function(data) {

		
		if (data.length > 0) {

			$('.empty-data').hide();

			console.log('found a course');

			var $div = $('<div/>');
			var $a = $('<a/>', {'href': 'viewcourse.html?id='+id});
			$a.text(id);

			$div.append($a);
			$resultsWrap.append($div);
		}
	});
}

Search.prototype.makeQuery = function() {
	var query = '?id='+$('#txtCourseId').val();
	console.log(window.location.href + query);
	window.location = window.location.href + query;
}

window.onload = function() {
	window.Search = new Search();
}