import * as Firebase from 'firebase';
import History from 'utils/history';

class Auth {
	getCurrentUser() {
		return Firebase.auth().currentUser;
	}

	onStateChanged(callback) {
		return Firebase.auth().onAuthStateChanged(function(user) {
			callback(user)
		})
	}

	logIn() {
		var provider = new Firebase.auth.FacebookAuthProvider();
		provider.addScope('user_friends');
		provider.setCustomParameters({
			'auth_type': 'reauthenticate'
		})
		
		// only want to call once. don't want to keep this observer
		var unsubscribe = Firebase.auth().onAuthStateChanged(function(user) {
			if (!user) {
				History.push({href: 'noClear', pageName: ''});
				Firebase.auth().signInWithRedirect(provider);
			}
			
			// unsub to avoid future callback
			unsubscribe();
		})
	}

	getRedirectResult() {
		return Firebase.auth().getRedirectResult();
	}

	logOut() {
		Firebase.auth().signOut();
	}
}

export default new Auth();