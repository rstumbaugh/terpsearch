var firebase = require('firebase/app')
var Globals = require('../globals.js');
require('firebase/auth');
require('es6-promise').polyfill();
require('isomorphic-fetch');

// get firebase config from API
// initialize firebase
// export a promise -- on resolve, return firebase object

module.exports = new Promise(function(resolve, reject) {
	fetch(Globals.API_FIREBASE_CONFIG)
		.then(Globals.handleFetchResponse)
		.then(function(response) {
			firebase.initializeApp(response);
			resolve(firebase)
		})
		.catch(function(err) {
			reject(err)
		})
	})


