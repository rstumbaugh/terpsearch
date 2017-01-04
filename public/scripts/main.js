

// TODO: change Heroku task to update firebase DB instead of mongo
function getProfessors() {

	var ref = firebase.database().ref('/profs')
	$.get(API_LIST_PROFS, function(data) {
		ref.set(data);

		console.log('done');
	});
}

window.onload = function() {
	window.ratingsForm = new RatingsForm();
	//getProfessors();
	//validCourseApi();
	//validCourseFirebase();
}