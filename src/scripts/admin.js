function Admin() {
	// log in with FB, check if admin
	
	this.auth = firebase.auth();

	var self = this;
	this.loginAndValidate().then(function(data) {
		
		$('.no-access').hide();
		$('#name').text(data.name);
		$('.logged-in').slideDown();

		self.loadEmails(data.emails);

	}).catch(function(err) {
		console.log(err);
	});
}

Admin.prototype.loadEmails = function(emails) {

	if (emails.length > 0) {
		$('.email .table .empty').hide();
	}

	var $table = $('.email .table');

	for (var i = 0; i < emails.length; i++) {
		
		var email = emails[i];

		var $row = $('<tr/>');
		var $item = $('<td/>').text(email);
		$row.append($item);

		$table.append($row);

	}

}

Admin.prototype.loginAndValidate = function() {
	var provider = new firebase.auth.FacebookAuthProvider();

	var self = this;
	return new Promise(function(resolve, reject) {
		self.auth.signInWithPopup(provider).then(function(result) {
			var token = result.credential.accessToken;
			var user = result.user;
			var name = user.displayName.split(' ')[0];

			user.getToken(true).then(function(token) {

				var p = $.get(API_ROOT + 'admin/dash?token='+token);
				p.done(function(data) {
					data.name = name;
					resolve(data);
				}).fail(function(xhr, status, err) {
					reject('not authorized.');
				})
			})
		}).catch(function(error) {
			reject('Unable to log in (check your popup settings?)');
		});
	});
}


window.onload = function() {
	window.admin = new Admin();
}