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

    this.initCombobox('#txtProf');
}

// initialize combobox with professor values
RatingsForm.prototype.initCombobox = function(id) {
    $(id).selectize({
        valueField: 'value',
        labelField: 'name',
        searchField: 'name',
        sortField: 'name',
        selectOnTab: true,
        closeAfterSelect: true,
        loadThrottle: 150,
        persist: false,
        create: function(input) {
            return { name: input, value: 'Other'}
        },
        render: {
            option: function(item, escape) {
                return '<div>' +
                    '<span class="title">' +
                        '<span>' + escape(item.name) + '</span>' +
                    '</span>'
                '</div>';
            }
        },
        load: function(query, callback) {
            if (!query.length) return callback();
            $.ajax({
                url: API_FIND_PROFS + '?q='+encodeURIComponent(query),
                type: 'GET',
                error: function() {
                    callback();
                },
                success: function(res) {
                    for (var i = 0; i < res.length; i++) {
                        res[i]['value'] = res[i].name;
                    }
                    callback(res);
                }
            });
        }
    });
}

// validates and submits rating 
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
    var db = this.database;
    this.validateCourse(courseId, function() {
        if (valid) {
            var obj = {
                course_id: courseId,
                difficulty: diffRating, 
                interest: interestRating,
                professor: professor
            };


            $.post(API_ADD_RATINGS, obj, function(data) {
                $('#courseSuccessMsg').css('visibility', 'visible').slideDown();
                reset();
            });
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
        $('#courseErrorMsg').text('Not a valid course ID.');
        $('#courseErrorMsg').css('visibility', 'visible').slideDown();
    } else {
        
        $.get(API_FIND_COURSES + '?course_id=' + value, function(data) {
            if (data.length > 0) {
                onSuccess();
            } else {
                $('#courseInputWrap').addClass('has-error');
                $('#courseErrorMsg').text('Course not found. Enter a valid course.')
                $('#courseErrorMsg').css('visibility', 'visible').slideDown();
            }
        });
    }
};

// make sure professor has value
RatingsForm.prototype.validateProfessor = function(value) {
    var isValid = value && value != "";

    if (!isValid) {
        this.profInputWrap.classList.add('has-error');
        $('#profErrorMsg').css('visibility', 'visible').slideDown();
        return false;
    }

    return true;
}

// reset all items in form
RatingsForm.prototype.resetForm = function() {
    $('#txtCourse').val('');
    $('#txtProf')[0].selectize.clear();
    $('.rating').rating('rate', '1');
};
