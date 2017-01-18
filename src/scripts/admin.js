function Admin() {
	// log in with FB, check if admin
	
	this.auth = firebase.auth();

	$('.tab').click(function() {
		var id = $(this).attr('id');
		console.log(id);

		$('.tab.active').removeClass('active');
		$(this).addClass('active');

		$('.content-wrap .content').hide();
		$('.content-wrap .content.'+id).slideDown();
	})

	var self = this;
	this.loginAndValidate().then(function(data) {
		
		$('.no-access').hide();
		$('#name').text(data.name);
		$('.logged-in').slideDown();

		$('.content-wrap .content').hide();
		$('.content.logs').show();

		self.loadLogs(data.logs);
		self.loadEmails(data.emails);

	}).catch(function(err) {
		console.log(err);
	});
}

Admin.prototype.loadLogs = function(logs) {
	console.log('found '+logs.length+' logs');

	if (logs.length > 0) {
		$('.logs .empty').hide();
		$('.logs .table').removeClass('hidden');
	}

	var $table = $('.logs .table');
	for (var i = 0; i < logs.length; i++) {
		var log = logs[i];
		var content = log.content;

		if (log.type == 'rating') {
			content = content.course_id + ': Difficulty = '+content.difficulty+', Interest = '
						+content.interest+' ('+content.professor+')';
		} else if (log.type == 'comment') {
			content = content.course_id + ': '+content.comment;
		}

		var $row = $('<tr/>');
		var $type = $('<td/>').text(log.type);
		var $content = $('<td/>').text(content);
		var $time = $('<td/>').text(new Date(log.time).toString('hh:mm tt MMM dd yyyy'));

		$row.append($type).append($content).append($time);

		$table.append($row);
	}
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
	loadFirebase().then(function(data) {
		firebase.initializeApp(data);
		window.admin = new Admin();
	});
}