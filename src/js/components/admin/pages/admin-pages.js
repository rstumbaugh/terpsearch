import React, {Component} from 'react';
import Globals from 'globals';
import Logs from './admin-logs.js';
import Emails from './admin-emails.js';
import Users from './admin-users.js';
import Feedback from './admin-feedback.js';
import Incidents from './admin-incidents';

class Pages extends Component {
	render() {
		var active = this.props.active;
		var {logs, emails, feedback, users, incidents} = this.props.content;

		var removeItem = this.props.callbacks.removeItem;
		var sendEmail = this.props.callbacks.sendEmail;
		var addEmail = this.props.callbacks.addEmail;

		var components = {
			logs: <Logs logs={logs} />,
			emails: <Emails emails={emails} removeItem={removeItem} sendEmail={sendEmail} addEmail={addEmail} />,
			users: <Users users={users} />,
			feedback: <Feedback feedback={feedback} removeItem={removeItem} />,
			incidents: <Incidents incidents={incidents} />
		};

		return active ? components[active] : <h6>nothing to see here</h6>;
	}
}

export default Pages;