import * as Firebase from 'firebase';

class Auth {
	onStateChanged(callback) {
		Firebase.auth().onAuthStateChanged(function(user) {
			callback(user)
		})
	}

	logIn() {
		var provider = new Firebase.auth.FacebookAuthProvider();

		// only want to call once. don't want to keep this observer
		var unsubscribe = Firebase.auth().onAuthStateChanged(function(user) {
			if (!user) {
				Firebase.auth().signInWithRedirect(provider);
			}
		})

		// unsubscribe to avoid future callbacks
		unsubscribe();
	}

	logOut() {
		Firebase.auth().signOut();
	}
}

export default new Auth();