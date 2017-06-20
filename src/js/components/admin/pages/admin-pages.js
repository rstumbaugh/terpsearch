import React, {Component} from 'react';
import Globals from 'components/globals.js';
import Logs from './admin-logs.js';
import Emails from './admin-emails.js';
import Users from './admin-users.js';
import Feedback from './admin-feedback.js';

class Pages extends Component {
	render() {
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
}

export default Pages;