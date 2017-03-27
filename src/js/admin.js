var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('./modules/header.js');
var Footer = require('./modules/footer.js');
var Sidebar = require('./modules/admin/admin-sidebar.js');
var Auth = require('./modules/firebase/firebase-auth.js');
var Globals = require('./modules/globals.js');
require('es6-promise').polyfill();
require('isomorphic-fetch');

var App = React.createClass({
	getInitialState: function() {
		return {
			status: 'logging in',
			name: '',
			active: '',
			items: []
		}
	},

	updateActive: function(active) {
		this.setState({
			active: active
		})
	},

	componentDidMount: function() {
		var self = this;

		Auth.onStateChanged(function(user) {
			if (user) {
				// get user's firebase access token
				// use token to check if admin, then get 
				console.log('logged in');
				user.getToken(true)
					.then(function(token) {
						self.setState({
							token: token,
							name: user.displayName
						})
						return fetch(Globals.API_ADMIN_DASHBOARD + '?token=' + token);
					})
					.then(Globals.handleFetchResponse)
					.then(function(response) {
						// populate state with info
						console.log('token received');
						self.setState({
							status: 'logged in',
							items: ['Logs', 'Users', 'Emails', 'Feedback'],
							active: 'Logs',
							logs: response.logs,
							emails: response.emails,
							feedback: response.feedback,
							users: response.users
						})
					})
					.catch(function(err) {
						// error thrown if unauthorized 
						console.log(err);
						self.setState({
							status: 'unauthorized'
						})
					})
			} else {
				self.setState({
					status: 'logged out',
					items: [],
					active: '',
				})
			}
		})

		Auth.logIn();
	},

	removeItem: function(type, key) {
		var obj = this.state[type];
		delete obj[key];
		
		var state = {};
		state[type] = obj;

		var item = {
			type: type,
			key: key
		}

		var self = this;
		fetch(Globals.API_DASHBOARD_REMOVE + '?token=' + this.state.token, {
			method: 'post',
			'headers': {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(item)
		})
		.then(Globals.handleFetchResponse)
		.then(function(response) {
			self.setState(state);
		})
		.catch(function(err) {
			console.log(err);
		})


		
	},

	getLogs: function(logs) {
		var rows = [];

		logs.sort(function(a,b) {
			return a.time > b.time ? -1 : 1
		})

		for (var i = 0; i < logs.length; i++) {
			var log = logs[i];
			var c = log.content;
			var type = log.type;
			var content;
			var time = new Date(log.time).toString('hh:mm tt MMM dd yyyy');

			if (log.type == 'rating') {
				content = c.course_id + ': Diff = ' + c.difficulty + ', Int = ' + c.interest 
							+ ' (' + c.professor + ')';
			} else if (log.type == 'comment') {
				content = c.course_id + ': ' + c.comment;
			} else {
				content = c;
			}

			rows.push(
				<tr key={i}>
					<td>{type}</td>
					<td>{content}</td>
					<td>{time}</td>
				</tr>
			)
		}

		return rows;
	},

	getUsers: function(users) {
		var rows = []

		for (var key in users) {
			rows.push(
				<tr key={key}>
					<td>{users[key].name}</td>
					<td>{users[key].uid}</td>
					<td>{users[key].token.substring(0,5) + '...'}</td>
				</tr>
			)
		}

		return rows;
	},

	getEmails: function(emails) {
		var rows = [];

		for (var key in emails) {
			rows.push(
				<tr key={key}>
					<td>{emails[key]}</td>
					<td>
						<button className='btn btn-danger' onClick={this.removeItem.bind(this, 'emails', key)}>
							<i className='glyphicon glyphicon-remove'></i>
						</button>
					</td>
				</tr>
			)
		}
		return rows;
	},

	getFeedback: function(feedback) {
		var rows = [];

		var sortedKeys = Object.keys(feedback).sort(function(a,b) {
			return feedback[a].timestamp < feedback[b].timestamp ? 1 : -1;
		})
		
		for (var i = 0; i < sortedKeys.length; i++) {
			var key = sortedKeys[i];
			var item = feedback[key];
			var time = new Date(item.timestamp).toString('h:mm tt MMM dd yyyy');

			rows.push(
				<tr key={key}>
					<td>{item.message}</td>
					<td>{item.email}</td>
					<td>{time}</td>
					<td>
						<button className='btn btn-danger' onClick={this.removeItem.bind(this, 'feedback', key)}>
							<i className='glyphicon glyphicon-remove'></i>
						</button>
					</td>
				</tr>
			)
		}

		return rows;
	},

	getContent: function() {
		if (this.state.status == 'logged in') { // authorized and logged in
			if (this.state.active == 'Logs') {
				var rows = this.getLogs(this.state.logs);
				return (
					<table className='table table-bordered'>
						<tbody>
							<tr>
								<th>Type</th>
								<th>Content</th>
								<th>Time</th>
							</tr>
							{rows}
						</tbody>
					</table>
				)
			} else if (this.state.active == 'Users') {
				var admins = {};
				for (var key in this.state.users.admins) {
					admins[key] = this.state.users.users[key]
				}

				var userRows = this.getUsers(this.state.users.users);
				var adminRows = this.getUsers(admins);
				return (
					<div>
						<h3>Admins</h3>
						<table className='table table-bordered'>
							<tbody>
								<tr>
									<th>Name</th>
									<th>UID</th>
									<th>Access Token</th>
								</tr>
								{adminRows}
							</tbody>
						</table>
						<br/>
						<br/>
						<h3>Users</h3>
						<table className='table table-bordered'>
							<tbody>
								<tr>
									<th>Name</th>
									<th>UID</th>
									<th>Access Token</th>
								</tr>
								{userRows}
							</tbody>
						</table>
					</div>
				)
			} else if (this.state.active == 'Emails') {
				return (
					<table className='table table-bordered'>
						<tbody>
							<tr>
								<th>{'Emails (' + Object.keys(this.state.emails).length + ' found)'}</th>
								<th></th>
							</tr>
							{this.getEmails(this.state.emails)}
						</tbody>
					</table>
				)
			} else if (this.state.active == 'Feedback') {
				return (
					<table className='table table-bordered'>
						<tbody>
							<tr>
								<th>Feedback</th>
								<th>Email</th>
								<th>Time</th>
								<th></th>
							</tr>
							{this.getFeedback(this.state.feedback)}
						</tbody>
					</table>
				)
			}
		}
	},

	render: function() {
		var content;
		if (this.state.status == 'logging in') {
			content = <h1>Logging in...</h1>;
		} else if (this.state.status == 'unauthorized') {
			content = (
				<div>
					<h1>Unauthorized</h1>
					<p>You are unauthorized to see this page.</p>
				</div>
			)
		} else if (this.state.status == 'logged in') {
			content = (
				<div className='row'>
					<div className='col-sm-10 col-sm-offset-1'>
						{this.getContent()}
					</div>
				</div>
			)
		} else if (this.state.status == 'logged out') {
			content = (
				<div>
					<h1>Logged out</h1>
					<p>You are not logged in.</p>
				</div>
			)
		}

		var displayName = this.state.status != 'logging in' && this.state.status != 'logged out';
		return (
			<div>
				<Header hideFeedback={true} />
				<div className='container-fluid content-wrap'>
					<div className='row'>
						<div className='col-sm-2 sidebar-wrap'>
							<Sidebar
								items={this.state.items}
								default='Logs'
								active={this.state.active}
								onActiveChange={this.updateActive}
							/>
						</div>
						<div className='col-sm-10 admin-content'>
							<h1>{this.state.active}</h1>
							<div style={{display: displayName ? '' : 'none'}}>
								<div>
									{'Logged in as '+this.state.name}
								</div>
								<div className='link' onClick={function() {Auth.logOut()}}>
									Log Out
								</div>
								<br/><br/>
							</div>
							{content}
						</div>
					</div>
				</div>
			</div>
		)
	}

	

	

	
})

ReactDOM.render(<App />, document.getElementById('app'))