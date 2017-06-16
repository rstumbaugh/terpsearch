import * as firebase from 'firebase';
import Globals from 'components/globals.js';


// get firebase config from API
// initialize firebase
// export a promise -- on resolve, return firebase object
const FirebaseSetup = new Promise(function(resolve, reject) {
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

export default FirebaseSetup;
