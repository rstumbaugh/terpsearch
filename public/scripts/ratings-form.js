/**
 * main.js
 * 6 Dec 2016
**/

'use strict';

function RatingsForm() {
    this.difficultyField = document.getElementById('rtgDifficulty');
    this.interestField = document.getElementById('rtgInterest');
    this.submitCourseButton = document.getElementById('btnSubmitCourse');
    this.courseInputWrap = document.getElementById('courseInputWrap');
    this.profInputWrap = document.getElementById('profInputWrap')
    this.validationMessage = document.getElementById('courseErrorMsg');

    $('#txtCourse').keypress(function(e) {
        if (e.keyCode == 13) {
            $('#btnSubmitCourse').click();
        }
    });

    $('form').submit(function(e) {
        e.preventDefault();
    });

    $('#txtCourse').change(function() {
        $(this).val($(this).val().toUpperCase());
    })


    this.database = firebase.database(); 
    this.submitCourseButton.addEventListener('click', this.submitCourse.bind(this));

    

    // current method: always load all professors
    // takes a while with every 5000+ professors

    // solution: change API to return obj relating courses and profs 
    // fetch all courses on page load, fetch all professors when a course is selected

    // inconsistent API making this really fucking annoying... just gonna have all profs

    // waayyyy too many courses to check against all of them, gonna have to validate each input
    // after course is checked against regexp, check that it exists in API
    var callback = this.initCombobox;
    this.loadProfs(function(data) {
        callback(data, '#txtProf', 'Enter professor\'s name');

         $('#ratingsForm .content').show();
         $('#ratingsForm .loading').hide();

        console.log('ratings form loaded');

    });
}

RatingsForm.prototype.loadProfs = function(callback) {
    
    var profs = [];
    $.get(API_LIST_PROFS, function(data) {
        for (var i = 0; i < data.length; i++) {
            profs.push(data[i]);
        }

        console.log('found '+profs.length+' profs');

        callback(profs);
    })
}

RatingsForm.prototype.initCombobox = function(data, id, placeholder) {
    for (var i = 0; i < data.length; i++) {
        var info = data[i];
        var $box = $(id);
        var $option = $('<option/>', {'value': info});
        $option.text(info);

        $box.append($option);
    }

    $(id).combobox();
    $('.'+id.split('#')[1]+'-wrap .input-group input')
        .addClass('form-control')
        .attr({'placeholder': placeholder, 'id': id.split('#')[1]});
}

RatingsForm.prototype.submitCourse = function() {
    this.courseInputWrap.classList.remove('has-error');
    this.profInputWrap.classList.remove('has-error');

    $("#courseErrorMsg").hide();
    $("#courseSuccessMsg").hide();
    $("#profErrorMsg").hide();

    var courseId = $('#txtCourse').val().toUpperCase();
    var professor = $('#txtProf').val();
    var diffRating = parseInt(this.difficultyField.value);
    var interestRating = parseInt(this.interestField.value);


    var valid = this.validateProfessor(professor);
    var reset = this.resetForm;
    this.validateCourse(courseId, function() {
        if (valid) {
            var obj = {
                professor: professor, 
                difficulty: diffRating, 
                interest: interestRating
            };

            //this.database.ref("/courses/"+courseId+"/ratings").push(obj);
            console.log(courseId+', '+professor+' submitted..');

            $('#courseSuccessMsg').css('visibility', 'visible').slideDown();

            reset();
        }
    });;
};

// validates course against regular expression and checks if it's been
// offered by UMD
RatingsForm.prototype.validateCourse = function(value, onSuccess) {
    var pattern = /^[a-zA-Z]{4}[0-9]{3}[a-zA-Z]?$/
    var matches = value.match(pattern);

    if (matches == null) {
        this.courseInputWrap.classList.add('has-error');
        $('#courseErrorMsg').css('visibility', 'visible').slideDown();
        error();
    } else {
        
        this.database.ref('/course_list/'+value).once('value', function(snapshot) {
            if (snapshot.val()) {
                onSuccess();
            } else {
                $('#courseInputWrap').addClass('has-error');
                $('#courseErrorMsg').css('visibility', 'visible').slideDown();
            }
        })
    }
};

RatingsForm.prototype.validateProfessor = function(value) {
    var isValid = value && value != "";

    if (!isValid) {
        this.profInputWrap.classList.add('has-error');
        $('#profErrorMsg').css('visibility', 'visible').slideDown();
        return false;
    }

    return true;
}

RatingsForm.prototype.resetForm = function() {
    $('#txtCourse').val('');
    $('#txtProf').val('');
    $('.rating').rating('rate', '1');
};
