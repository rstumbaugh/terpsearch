/**
 * main.js
 * 6 Dec 2016
**/

'use strict';

function APITest() {
    this.courseName = $('#name');

    this.database = firebase.database();


    this.getCourse();
}

APITest.prototype.getCourse = function() {
    
    $.ajax({
        method: "GET",
        dataType: "json",
        url: "http://api.umd.io/v0/courses?course_id=CMSC330",
        data: "",
        success: function(data) {
            $("#name").text(data[0]["name"]);
        }
    });
    
};


window.onload = function() {
    window.apiTest = new APITest();
}
