/**
 * main.js
 * 6 Dec 2016
**/

'use strict';

function APITest() {
    this.courseField = document.getElementById('txtCourse');
    this.$difficultyField = document.getElementById('rtgDifficulty');
    this.$interestField = document.getElementById('rtgInterest');
    this.submitCourseButton = document.getElementById('btnSubmitCourse');

    // $('#txtCourse').keypress(function(e) {
    //     if (e.keyCode == 13) {
    //         this.submitCourse();
    //     }
    // });

    // $('form').submit(function(e) {
    //     e.preventDefault();
    // });

    //this.queryField = document.getElementById('txtQuery');
    //this.submitQuery = document.getElementById('btnQuery');

    this.database = firebase.database(); 
    this.submitCourseButton.addEventListener('click', this.submitCourse.bind(this));
    //this.submitEmail.addEventListener("click", this.saveEmail.bind(this)); 
    //this.submitQuery.addEventListener("click", this.doQuery.bind(this));
    //this.submitQuery.addEventListener("click", this.search.bind(this));
}

APITest.prototype.submitCourse = function() {
    var courseId = this.courseField.value.toUpperCase();
    var diffRating = parseInt(this.$difficultyField.value);
    var interestRating = parseInt(this.$interestField.value);

    // TODO: validate course name

    this.database.ref("/courses/"+courseId+"/difficulty").push({
        rating: diffRating
    });

    this.database.ref("/courses/"+courseId+"/interest").push({
        rating: interestRating
    });
};

APITest.prototype.saveEmail = function() {
    this.database.ref("/email/").push({
        email: this.emailField.value
    }); 
};


APITest.prototype.search = function() {
    $("#queryResult").text("");
    var url = "http://api.umd.io/v0/courses/list";
    var term = this.queryField.value;

    var myclass = this;
    $.ajax({
        method: "GET",
        dataType: "json",
        url: url,
        data: "",
        success: function(data) {
            var filtered = myclass.findTerm(data, term);

            filtered.forEach(function(element) {
                var text = $("#queryResult").text();
                text += element["course_id"] + ": " + element["name"];
                text += "\n";
                $("#queryResult").text(text);
            });
        }
    });
};

APITest.prototype.findTerm = function(list, term) {
    var filterFunc = function(item) {
        return item["name"].toLowerCase().includes(term.toLowerCase());
    }

    return list.filter(filterFunc);
};

APITest.prototype.doQuery = function() {
    var url = "http://api.umd.io/v0/courses?";
    var query = this.queryField.value;

    url = url + query;

    $.ajax({
        method: "GET",
        dataType: "json",
        url: url,
        data: "",
        success: function(data) {
            var json_as_str = JSON.stringify(data);
            $("#queryResult").text(json_as_str);
            $("#numCourses").text("Number of results: "+data.length);
        }
    });
};

window.onload = function() {
    window.apiTest = new APITest();
}
