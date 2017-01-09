// TODO: don't hardcode api version

// API ROUTES
const          API_ROOT  = "https://sheltered-ridge-74266.herokuapp.com/";

const      UMD_API_ROOT  = API_ROOT + 'umdio/v0/';

const  API_FIND_COURSES  = API_ROOT + 'courses';
const  API_LIST_COURSES  = API_ROOT + 'courses/list';
const  API_COURSE_STATS  = API_ROOT + 'courses/stats';
const   API_DEPARTMENTS  = API_ROOT + 'courses/departments';
const API_COURSE_EXISTS  = API_ROOT + 'course_exists';

const    API_FIND_PROFS  = API_ROOT + 'profs';
const    API_LIST_PROFS  = API_ROOT + 'profs/list';



// GLOBAL HELPER METHODS
// returns object of querystring params and values
function getUrlVars() {
    var vars = [], hash;

    var url = window.location.href;

    if (!url.includes('?')) {
    	return []
    }

    var hashes = url.slice(url.indexOf('?') + 1).split('&');

    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

// converts semester code to readable string
function getSemester(semester) {
    var regex = /(\d{4})(\d{2})/;

    var matches = semester.match(regex);

    var year = matches[1];
    var seasonCode = matches[2];
    var season;

    if (seasonCode == '01') {
        season = 'Spring';
    } else if (seasonCode == '05') {
        season = 'Summer';
    } else if (seasonCode == '08') {
        season = 'Fall';
    } else if (seasonCode == '12') {
        season = 'Winter';
    }

    return season + ' ' + year;
}