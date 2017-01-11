function Test() {

    $('#loggedIn').hide();
    $('#info').hide();

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('signed in');
            var uid = user.providerData[0].uid;
            
            firebase.database().ref('users').child(uid).once('value').then(function(snapshot) {
                var profile = snapshot.val();

                $('#loggedIn').show();
                $('#info').show();

                $('#pic img').attr('src', profile.photo);
                $('#name').text(profile.name);
                $('#email').text(profile.email);
                $('#uid').text(profile.token);

            }).catch(function(err) {
                console.log('user '+user.providerData[0].displayName+' not found');
            })
        } else {
            $('#loggedIn').hide();
            $('#info').hide();
            console.log('not signed in');
        }
    })

    $('#signIn').click(function() {
        var provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('user_friends');
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user.providerData[0];

            var obj = {
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                uid: user.uid,
                token: token
            };

            firebase.database().ref('users/'+obj.uid).set(obj).then(function(snapshot) {
                console.log('info pushed');
            }).catch(function(err) {
                console.log('error: '+err);
            });
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    })

    $('#signOut').click(function() {
        firebase.auth().signOut();
    })

}

window.onload = function() {
  loadConfig().then(function() {
    window.test = new Test();
  });
}



  