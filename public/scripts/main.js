/**
 * main.js
 * 6 Dec 2016
**/

'use strict';

function APITest() {
    this.emailField = document.getElementById('txtEmail');
    this.submitEmail = document.getElementById("btnEmail");
    this.database = firebase.database(); 
    this.submitEmail.addEventListener("click", this.saveEmail.bind(this)); 
}

APITest.prototype.saveEmail = function() {
    this.database.ref("/email/").push({
        email: this.emailField.value
    }); 
};

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
