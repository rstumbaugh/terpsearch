function Admin() {
	// log in with FB, check if admin

	$('.tab').click(function() {
		var id = $(this).attr('id');
		console.log(id);

		$('.tab.active').removeClass('active');
		$(this).addClass('active');

		$('.content-wrap .content').hide();
		$('.content-wrap .content.'+id).slideDown();
	})

	$('h1').click(function() {
		firebase.auth().signOut().then(function() {
			console.log('logged out');
		}, function(error) {
		  // An error happened.
		});
	})

	var self = this;
	this.loginAndValidate().then(function(data) {

		$('textarea.comment').val('');
		
		$('.no-access').hide();
		$('#name').text(data.name);
		$('.logged-in').slideDown();

		$('.content-wrap .content').hide();
		$('.content.logs').show();

		self.loadLogs(data.logs);
		self.loadEmails(data.emails);
		self.loadFeedback(data.feedback);

	}).catch(function(err) {
		console.log(err);
	});
}

Admin.prototype.loadLogs = function(logs) {
	console.log('found '+logs.length+' logs');

	if (logs.length > 0) {
		$('.logs .empty').hide();
		$('.logs .table').removeClass('hidden');

		$('#numLogs').text(logs.length);
	}

	logs.sort(function(a,b) {
		return a.time > b.time ? -1 : 1
	})

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

		$('#numEmails').text(emails.length);
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

Admin.prototype.loadFeedback = function(feedback) {

	var $wrap = $('.feedback .feedback-wrap');

	var source = $('#feedback-template').html();
	var template = Handlebars.compile(source);

	for (var key in feedback) {
		var item = feedback[key];
		item.key = key;
		item.time = new Date(item.timestamp).toString('hh:mm tt MMM dd yyyy');

		var $body = template(item);
		$wrap.append($body);

		console.log(item);
	}
}

Admin.prototype.loginAndValidate = function() {
	var provider = new firebase.auth.FacebookAuthProvider();

	var self = this;
	var auth = firebase.auth();
	return new Promise(function(resolve, reject) {
		auth.onAuthStateChanged(function(user) { // check if logged in
			new Promise(function(res, rej) {
				if (user) {
					console.log('logged in');
					res(user);
				} else { // if not logged in, log in with popup
					console.log('not logged in');
					auth.signInWithRedirect(provider);
					auth.getRedirectResult().then(function(result) {
						var user = result.user;
						res(user)
					})
				}
			}).then(function(user) { // get current user
				var name = user.displayName.split(' ')[0];

				user.getToken(true).then(function(token) { // get token

					var p = $.get(API_ROOT + 'admin/dash?token='+token); // get dashboard info from API
					p.done(function(data) {
						data.name = name;
						resolve(data);
					}).fail(function(xhr, status, err) { // if not an admin, gets rejected
						reject('not authorized.');
					})
				})
			})
		});
	})
}

// given a course, generate search result item from course info
// uses Handlebar
function generateFeedbackItem(feedbackItem, template) {

	var body = template(data);

	return body;
}


window.onload = function() {
	loadFirebase().then(function(data) {
		firebase.initializeApp(data);
		window.admin = new Admin();
	});
}