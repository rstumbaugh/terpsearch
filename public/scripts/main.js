/**
 * main.js
 * 6 Dec 2016
**/

'use strict';

function APITest() {
    this.emailField = document.getElementById('txtEmail');
    this.submitEmail = document.getElementById('btnEmail');

    this.queryField = document.getElementById('txtQuery');
    this.submitQuery = document.getElementById('btnQuery');

    this.database = firebase.database(); 
    this.submitEmail.addEventListener("click", this.saveEmail.bind(this)); 
    //this.submitQuery.addEventListener("click", this.doQuery.bind(this));
    this.submitQuery.addEventListener("click", this.search.bind(this));
}

APITest.prototype.saveEmail = function() {
    this.database.ref("/email/").push({
        email: this.emailField.value
    }); 
};


APITest.prototype.search = function() {
    $("#queryResult").text("");
    console.log("Here");
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

            console.log("done");

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
