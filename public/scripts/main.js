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
    this.submitQuery.addEventListener("click", this.doQuery.bind(this));
}

APITest.prototype.saveEmail = function() {
    this.database.ref("/email/").push({
        email: this.emailField.value
    }); 
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
