/**
 * viewcourse.js
 * 19 Dec 2016
**/


function ViewCourse() {
	var courseName = document.getElementById('courseName');

	this.database = firebase.database();
	this.loadCourseData();
}

ViewCourse.prototype.loadCourseData = function() {
	var course = getUrlVars()["id"];
	$('#courseName').text(course);

	this.queryCourse(course);

    this.database.ref('/courses/'+course).on('value', function(data) {
        for (var key in data.val()) {
            //console.log(data.val()[key]);
        }
    });
}


ViewCourse.prototype.queryCourse = function(course) {
	var url = API_ROOT + "courses?course_id="+course;
	$.ajax({
        method: "GET",
        dataType: "json",
        url: url,
        data: "",
        success: function(data) {
        	var obj = data[0];
        	var desc = obj["description"];
            var relations = obj["relationships"];

    		$('#courseTitle').text(obj["name"]);
            $('#txtCourse').val(course);

            var relationsArr = ['prereqs', 'coreqs', 'restrictions', 'credit_granted_for', 'also_offered_as', 'formerly', 'additional_info'];
            relationsArr.forEach(function(rel) {
                loadRelationship(rel, relations[rel]);
            });

            $('#description').text(desc);

            $('.course-content').show();
            $('.content-loading').hide();

        },
        error: function(xhr, status, error) {
            $('#error').text("db error");
        }
    });
}

function loadRelationship(relationship, value) {
    if (value != null) {
        $('#'+relationship).text(value);
    } else {
        $('#relationship_'+relationship).hide();
    }
}





// returns object of querystring params and values
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}







window.onload = function() {
    window.viewCourse = new ViewCourse();
}