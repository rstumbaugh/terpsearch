var FirebaseSetup = require('./firebase-setup');

function Auth() {}

Auth.prototype.onStateChanged = function(callback) {
	FirebaseSetup
		.then(function(firebase) {
			firebase.auth().onAuthStateChanged(function(user) {
				callback(user);
			})
		})
		.catch(function(err) {
			console.log(err);
		})
}

Auth.prototype.logIn = function() {
	FirebaseSetup
		.then(function(firebase) {
			var provider = new firebase.auth.FacebookAuthProvider();

			// only want to call once. don't want to keep this observer
			var unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
				if (!user) {
					firebase.auth().signInWithRedirect(provider);
				}
			})

			// unsubscribe to avoid future callbacks
			unsubscribe();
			
		})
		.catch(function(err) {
			console.log(err);
		})
}

Auth.prototype.logOut = function() {
	FirebaseSetup
		.then(function(firebase) {
			firebase.auth().signOut()
		})
		.catch(function(err) {
			console.log(err);
		})
}

module.exports = new Auth();