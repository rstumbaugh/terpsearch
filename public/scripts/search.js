/**
 * search.js
 * 4 jan 2017
**/

function Search() {

	var query = window.location.href.split('?')[1];

	if (query) {
		this.processQuery('?' + query);
	}

	// $('form').submit(function(e) {
 //        e.preventDefault();
 //    });

	// var makeQuery = this.makeQuery;
	// $('#btnSearch').click(function() {
	// 	console.log('made query');
	// 	makeQuery();
	// })
}

Search.prototype.processQuery = function(query) {
	console.log('processing query');

	var $resultsWrap = $('.search-results');

	// add semester array to node DB, allow lookup on umd.io 
	$.get(API_FIND_COURSES + query, function(data) {

		console.log('found '+data.length+' courses');

		for (var i = 0; i < data.length; i++) {

			var course = data[i];
			var id = course.course_id;
			var semester = course.semester;

			var url = 'viewcourse.html?id=' + id + '&semester=' + semester;

			$('.empty-data').hide();
			

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