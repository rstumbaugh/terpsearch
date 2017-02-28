var FirebaseSetup = require('./firebase-setup');

function Auth() {
	this.user = undefined;

	var self = this;
	FirebaseSetup
		.then(function(firebase) {
			firebase.auth().onAuthStateChanged(function(user) {
				self.user = user;

				if (user) {
					console.log('logged in');
				} else {
					console.log('logged out');
				}
			})
		})
		.catch(function(err) {
			console.log(err)
		})
}

Auth.prototype.login = function() {
	if (!this.user) {
		FirebaseSetup
			.then(function(firebase) {
				var provider = new firebase.auth.FacebookAuthProvider();
				firebase.auth().signInWithRedirect(provider);
			})
			.catch(function(err) {
				console.log(err);
			})
	}
}

Auth.prototype.logout = function() {
	var self = this;

	FirebaseSetup
		.then(function(firebase) {
			firebase.auth().signOut()
		})
		.catch(function(err) {
			console.log(err);
		})
}

module.exports = new Auth();