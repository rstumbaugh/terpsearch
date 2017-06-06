var React = require('react');
var Globals = require('../../globals.js');
var Logs = require('./admin-logs.js');
var Emails = require('./admin-emails.js');
var Users = require('./admin-users.js');
var Feedback = require('./admin-feedback.js');

var Pages = React.createClass({
	render: function() {
		var active = this.props.active;
		var logs = this.props.content.logs;
		var emails = this.props.content.emails;
		var feedback = this.props.content.feedback;
		var users = this.props.content.users;

		var removeItem = this.props.callbacks.removeItem;
		var sendEmail = this.props.callbacks.sendEmail;
		var addEmail = this.props.callbacks.addEmail;

		var components = {
			logs: <Logs logs={logs} />,
			emails: <Emails emails={emails} removeItem={removeItem} sendEmail={sendEmail} addEmail={addEmail} />,
			users: <Users users={users} />,
			feedback: <Feedback feedback={feedback} removeItem={removeItem} />
		};

		return active ? components[active] : <h6>nothing to see here</h6>;
	}
});

module.exports = Pages;