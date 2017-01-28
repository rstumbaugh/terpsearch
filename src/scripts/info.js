// API ROUTES
const          API_ROOT  = "http://localhost:8888/";

const      UMD_API_ROOT  = API_ROOT + 'umdio/v0/';

const     API_ADD_EMAIL  = API_ROOT + 'users/email';
const  API_ADD_FEEDBACK  = API_ROOT + 'users/feedback';

const  API_FIND_COURSES  = API_ROOT + 'courses';
const  API_LIST_COURSES  = API_ROOT + 'courses/list';
const  API_COURSE_STATS  = API_ROOT + 'courses/stats';
const   API_DEPARTMENTS  = API_ROOT + 'courses/departments';
const   API_ADD_RATINGS  = API_ROOT + 'courses/reviews/ratings';
const   API_ADD_COMMENT  = API_ROOT + 'courses/reviews/comments';

const    API_FIND_PROFS  = API_ROOT + 'professors';
const    API_LIST_PROFS  = API_ROOT + 'professors/list';
const    API_PROF_STATS  = API_ROOT + 'professors/stats';

const         API_ADMIN  = API_ROOT + 'admin';
const    API_ADMIN_DASH  = API_ROOT + 'admin/dash';
const API_ADMIN_DASH_RM  = API_ROOT + 'admin/dash/remove';

const   API_SOCIAL_ROOT  = API_ROOT + 'social';

const        API_CONFIG  = API_ROOT + 'firebase_config';



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