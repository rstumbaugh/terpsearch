function Main() {

	var self = this;

	$('#btnFeedback').click(function() {
		self.submitFeedback();
	});

	$('#btnEmail').click(function() {
		self.submitEmail();
	});
}

Main.prototype.submitFeedback = function() {
	var text = $('#txtFeedback').val();

	if (text) {
		$.post('http://localhost:8888/users/feedback', {msg: text})
			.then(function(res) {
				$('#txtFeedback').val('');
				console.log('thanks');
			}).catch(function(err) {
				console.log('error: '+err);
			})
	} else {
		console.log('invalid');
	}
};

Main.prototype.submitEmail = function() {
	$('.email .help-block').text('').hide();

	var email = $('#txtEmail').val();
	var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (email.match(regex)) {
		$.post('http://localhost:8888/users/email', {email: email})
			.then(function(res) {
				$('#txtEmail').val('');
				$('.email .help-block').text('Thanks!').slideDown();
			}).catch(function(err) {
				console.log('error: '+err);
			})
	} else {
		$('.email .help-block').text('Please enter a valid email.').slideDown();
	}
	
}

window.onload = function() {
	window.ratingsForm = new RatingsForm();
	window.main = new Main();
}