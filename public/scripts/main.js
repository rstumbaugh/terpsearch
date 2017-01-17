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
	$('.feedback .help-block').text('').hide();

	var text = $('#txtFeedback').val();

	if (text) {
		$.post(API_ADD_FEEDBACK, {msg: text})
			.then(function(res) {
				$('#txtFeedback').val('');
				$('.feedback .help-block').text('Thanks!').slideDown();
			}).catch(function(err) {
				console.log('error: '+err);
				$('.feedback .help-block').text('Sorry, something went wrong. Please try again later.').slideDown();
			})
	} else {
		$('.feedback .help-block').text('Please enter some valid text.').slideDown();
	}
};

Main.prototype.submitEmail = function() {
	$('.email .help-block').text('').hide();

	var email = $('#txtEmail').val();
	var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (email.match(regex)) {
		$.post(API_ADD_EMAIL, {email: email})
			.then(function(res) {
				$('#txtEmail').val('');
				$('.email .help-block').text('Thanks!').slideDown();
			}).catch(function(err) {
				console.log('error: '+err);
				$('.email .help-block').text('Sorry, something went wrong. Please try again later.').slideDown();
			})
	} else {
		$('.email .help-block').text('Please enter a valid email.').slideDown();
	}
	
}

window.onload = function() {
	window.ratingsForm = new RatingsForm();
	window.main = new Main();
}