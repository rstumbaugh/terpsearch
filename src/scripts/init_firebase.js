$.get(API_CONFIG, function(data) {
	firebase.initializeApp(data);
});