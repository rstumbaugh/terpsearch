var React = require('react');
var Globals = require('../../globals.js');
var Logs = require('./admin-logs.js');
var Emails = require('./admin-emails.js');
var Users = require('./admin-users.js');
var Feedback = require('./admin-feedback.js');

var Pages = React.createClass({
	render: function() {
		var active = this.props.active;
		var {logs, emails, feedback, users} = this.props.content;
		var {removeItem} = this.props.callbacks;

		var components = {
			logs: <Logs logs={logs} />,
			emails: <Emails emails={emails} removeItem={removeItem} />,
			users: <Users users={users} />,
			feedback: <Feedback feedback={feedback} removeItem={removeItem} />
		};

		return active ? components[active] : <h6>nothing to see here</h6>;
	}
});

module.exports = Pages;