// TODO: don't hardcode api version
const API_ROOT = "https://sheltered-ridge-74266.herokuapp.com/";
const UMD_API_ROOT = API_ROOT + 'query/v0/';
const API_LIST_COURSES = API_ROOT + 'courses';
const API_LIST_PROFS = API_ROOT + 'prof';
const API_FIND_COURSE = API_ROOT + '/find_course';


var professors = new Set();
var courses = [];
