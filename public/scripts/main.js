
function Main() {


	
}



Main.prototype.getCourses = function() {
	var semesters = ['201408', '201501', '201508', '201601', '201608'];
	for (var i = 0; i < semesters.length; i++) {
		var semester = semesters[i];
		var url = API_ROOT + 'v0/courses/sections?semester='+semester+'&per_page=100&page=';
		processCourse(url, 1);
	}
}

// recursively get all courses and professors with ajax calls
// right now, banks on the fact that a server error will be returned when an out-of-bound page is reached
// also only looks at current semester
function processCourse(url, page) {
	$.ajax({
		type: 'GET',
		url: url + page,
		data: '',
		success: function(data) {
			// do some shit
			for (var i = 0; i < data.length; i++) {
				var profs = data[i].instructors;
				if (profs && profs.length > 0) {
					for (var j = 0; j < profs.length; j++) {
						if (profs[j] != '') {
							professors.add(profs[j]);
						}
					}
				}
			}
			processCourse(url, page + 1);
		},
		error: function(data) {
			console.log('done, found '+courses.length+' courses and '+professors.size+' professors');
		}
	});
		
}

Main.prototype.addCourse = function(data) {
	console.log('called');
	
}

Main.prototype.getAllRecords = function(data) {
	var url = API_ROOT + 'v0/courses?per_page=100&page='+this.currentPage;

	if (data) {
		// do some shit
		for (var i = 0; i < data.length; i++) {
    		var course = data[i];
    		courses.push(course.course_id);
    	}

    	//console.log('called');
    	console.log(url);
    	this.currentPage++;
    	//console.log(this.currentPage);

    	$.get(url, this.getAllRecords);
	}

	

}

Main.prototype.getProfs = function() {
	var str = courses.join(',');
	// get 800 courses at a time?
	url = API_ROOT + 'v0/courses?course_id='+str+'&expand=sections&perpage=99';

	$.ajax({
    	method: 'GET',
    	dataType: 'json',
    	url: url,
    	data: '',
    	sucess: function(data) {
    		// get sections
    		console.log('working');
    		var sections = data[0].sections;
    		for (var j = 0; j < sections.length; j++) {
    			$.each(sections[i].instructors, function(ele) { professors.add(ele); });
    		}

    		console.log('done');
    	},
    	error: function(xhr, status, error) {
    		console.log('error');
    	}
    });
    
}

window.onload = function() {
	window.ratingsForm = new RatingsForm();
	window.main = new Main();
}