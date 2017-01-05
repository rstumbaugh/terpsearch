// TODO: don't hardcode api version
const API_ROOT = "https://sheltered-ridge-74266.herokuapp.com/";
const UMD_API_ROOT = API_ROOT + 'umdio/v0/';
const API_LIST_COURSES = API_ROOT + 'courses';
const API_LIST_PROFS = API_ROOT + 'prof';
const API_COURSE_EXISTS = API_ROOT + 'course_exists';
const API_FIND_COURSES = API_ROOT + 'find_courses';
const API_FIND_PROFS = API_ROOT + 'find_profs';


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
