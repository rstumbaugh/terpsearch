function Admin() {
	// log in with FB, check if admin
	var self = this;

	$('.tab').click(function() {
		var id = $(this).attr('id');

		$('.tab.active').removeClass('active');
		$(this).addClass('active');

		$('.content-wrap .content').hide();
		$('.content-wrap .content.'+id).slideDown();
	})

	$('.content-wrap').on('click', 'button.remove', function() {
		var $this = $(this);
		$this.attr('disabled', 'disabled');
		var type = $this.attr('type');
		var key = $this.attr('value');

		var body = {
			type: type,
			key: key
		}

		$.post(API_ADMIN_DASH_RM + '?token='+self.token, body).done(function(res) {
			$this.closest('tr, .row').hide('slow');
		});
	});

	
	this.loginAndValidate().then(function(data) {

		$('textarea.comment').val('');
		
		$('.no-access').hide();
		$('#name').text(data.name);
		$('.logged-in').slideDown();

		$('.content-wrap .content').hide();
		$('.content.users').show();

		self.loadUsers(data.users);
		self.loadLogs(data.logs);
		self.loadEmails(data.emails);
		self.loadFeedback(data.feedback);

	}).catch(function(err) {
		console.log(err);
	});
}

Admin.prototype.loadUsers = function(data) {
	var admins = data.admins;
	var users = data.users;

	if (admins != {}) {
		$('.admins-table-wrap .empty').hide();
		$('.admins-table-wrap .table').removeClass('hidden');
	}

	if (users != {}) {
		$('.users-table-wrap .empty').hide();
		$('.users-table-wrap .table').removeClass('hidden');
	}

	var aKeys = Object.keys(admins);
	var uKeys = Object.keys(users);

	aKeys.sort(function(a,b) {
		return users[a].name < users[b].name ? -1 : 1;
	})

	uKeys.sort(function(a,b) {
		return users[a].name < users[b].name ? -1 : 1;
	})

	var $aTable = $('.users .admins-table-wrap table');
	var $uTable = $('.users .users-table-wrap table');

	for (var i = 0; i < aKeys.length; i++) {
		var user = users[aKeys[i]];

		var $row = $('<tr/>');
		var $name = $('<td/>', {text: user.name});
		var $uid = $('<td/>', {text: user.uid});
		var $token = $('<td/>', {text: user.token.toString().substring(0,10)+'...'});

		$row.append($name).append($uid).append($token);
		$aTable.append($row);
	}

	for (var i = 0; i < uKeys.length; i++) {
		var user = users[uKeys[i]];

		var $row = $('<tr/>');
		var $name = $('<td/>', {text: user.name});
		var $uid = $('<td/>', {text: user.uid});
		var $token = $('<td/>', {text: user.token.toString().substring(0,10)+'...'});

		$row.append($name).append($uid).append($token);
		$uTable.append($row);
	}
}

Admin.prototype.loadLogs = function(logs) {

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

	var keys = Object.keys(emails);
	if (keys.length > 0) {
		$('.email .table .empty').hide();

		$('#numEmails').text(keys.length);
	}

	var $table = $('.email .table');

	
	for (var i = 0; i < keys.length; i++) {
		var email = emails[keys[i]];

		var $row = $('<tr/>');

		var $rm = $('<button/>', {class: ['btn btn-danger remove'], type: 'emails', val: keys[i]});
		$rm.html('<i class="glyphicon glyphicon-remove"></i>');

		var $item = $('<td/>').text(email);
		var $btn = $('<td/>').append($rm);

		$row.append($item).append($btn);

		$table.append($row);

	}
}

Admin.prototype.loadFeedback = function(feedback) {

	var $wrap = $('.feedback .feedback-wrap');

	var source = $('#feedback-template').html();
	var template = Handlebars.compile(source);

	var keys = Object.keys(feedback);
	keys.sort(function(a,b) {
		return feedback[a].timestamp > feedback[b].timestamp ? -1 : 1;
	})

	$('#numFeedback').text(keys.length);

	for (var i = 0; i < keys.length; i++) {
		var key = keys[i]
		var item = feedback[key];
		item.key = key;
		item.time = new Date(item.timestamp).toString('hh:mm tt MMM dd yyyy');

		var $body = template(item);
		$wrap.append($body);
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
					res(user);
				} else { // if not logged in, log in with popup
					auth.signInWithRedirect(provider);
					auth.getRedirectResult().then(function(result) {
						var user = result.user;
						res(user)
					})
				}
			}).then(function(user) { // get current user
				var name = user.displayName.split(' ')[0];

				user.getToken(true).then(function(token) { // get token
					self.token = token;
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


window.onload = function() {
	loadFirebase().then(function(data) {
		firebase.initializeApp(data);
		window.admin = new Admin();
	});
}