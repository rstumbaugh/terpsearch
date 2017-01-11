function loadConfig() {
	return new Promise(function(resolve, reject) {
		$.get(API_CONFIG, function(data) {
			firebase.initializeApp(data);
			resolve();
		});
	});
	
}