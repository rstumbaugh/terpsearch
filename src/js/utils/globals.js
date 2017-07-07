const API_ROOT = /localhost/.test(window.location.href) 
								 	? 'http://localhost:8888/' 
								 	: 'http://sheltered-ridge-74266.herokuapp.com/';

var globals = {
	API_ROOT: 			  		API_ROOT,
  
	API_COURSES: 		  		API_ROOT + 'courses',
	API_LIST_COURSES: 	  API_ROOT + 'courses/list',
	API_COURSE_STATS: 	  API_ROOT + 'courses/stats',
	API_LIST_DEPARTMENTS: API_ROOT + 'courses/departments',   
	API_COURSE_COMMENTS:  API_ROOT + 'courses/reviews/comments',
  
	API_SUBMIT_RATING:    API_ROOT + 'courses/reviews/ratings',
  
	API_PROFS: 			  		API_ROOT + 'professors',
	API_LIST_PROFS:       API_ROOT + 'professors/list',
  
	API_ADD_EMAIL: 		 		API_ROOT + 'users/email',
	API_ADD_FEEDBACK:     API_ROOT + 'users/feedback',

	API_ADMIN_DASHBOARD:  API_ROOT + 'admin/dash',
	API_DASHBOARD_REMOVE: API_ROOT + 'admin/dash/remove',
	API_ADMIN_SEND: 	  	API_ROOT + 'admin/dash/email/send',

	API_FIREBASE_CONFIG:  API_ROOT + 'firebase_config',


	EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	
	MODAL_POPUP_FREQUENCY: 0.08,

	ADMIN_PAGES: ['logs', 'emails', 'users', 'feedback'],

	getQueryString: function(url) {
	    var vars = [], hash;

	    var url = url || window.location.href;

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
	},

	getSemesterFromCode: function(code) {
		if (!code) return ''
			
		var year = code.substring(0, 4);
		var num = code.substring(4);

		if (num == '01') {
			return 'Spring ' + year
		} else if (num == '08') {
			return 'Fall ' + year
		} else if (num == '12') {
			return 'Winter ' + year
		} else {
			return 'Summer ' + year
		}
	},

	handleFetchResponse: function(response) {
		if (!response.ok) {
			throw Error(response.status);
		}

		var contentType = response.headers.get('content-type');

		if (contentType && contentType.indexOf('application/json') != -1) {
			return response.json();
		} else {
			return response.text();
		}
	},

	capitalize: function(str) {
		return str.substring(0,1).toUpperCase() + str.substring(1);
	}
}

module.exports = globals;
