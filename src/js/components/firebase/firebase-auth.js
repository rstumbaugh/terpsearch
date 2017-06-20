import FirebaseSetup from './firebase-setup.js';

class Auth {
	onStateChanged(callback) {
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

	logIn() {
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

	logOut() {
		FirebaseSetup
			.then(function(firebase) {
				firebase.auth().signOut()
			})
			.catch(function(err) {
				console.log(err);
			})
	}
}

export default new Auth();