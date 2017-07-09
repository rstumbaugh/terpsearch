import React, {Component} from 'react';
import {Header, Content, Footer} from 'utils/layout.js';
import Sidebar from 'components/admin/admin-sidebar.js';
import Pages from 'components/admin/pages/admin-pages.js';
import Auth from 'components/firebase/firebase-auth.js';
import Globals from 'globals';
import Ajax from 'utils/ajax';

class Admin extends Component {
	constructor() {
		super();

		this.state = {
			status: 'logging in',
			name: '',
			active: '',
			items: []
		};
	}

	updateActive(active) {
		this.setState({
			active: active
		})
	}

	// set up auth state change monitor
	componentDidMount() {
		var self = this;

		Auth.onStateChanged(function(user) {
			if (user) {
				// get user's firebase access token
				// use token to check if admin, then get 

				// get Firebase token, check if authenticated
				user.getIdToken(true)
					.then(function(token) {
						self.setState({
							token: token,
							name: user.displayName
						})

						var url = `${Globals.API_ADMIN_DASHBOARD}?token=${token}`;
						return Ajax.get(url);
					})
					.then(res => JSON.parse(res.response))
					.then(function(response) {
						// populate state with info
						self.setState({
							status: 'logged in',
							items: Globals.ADMIN_PAGES,
							active: Globals.ADMIN_PAGES[0],
							content: {
								logs: response.logs,
								emails: response.emails,
								feedback: response.feedback,
								users: response.users
							}
						})
					})
					.catch(function(err) {
						// error thrown if unauthorized 
						console.error(err);
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
	}

	// remove item from one of the pages
	// arguments are type of item to remove (emails, users, feedback, etc)
	// and the PK of object to remove
	removeItem(type, key) {
		var obj = this.state.content[type];
		delete obj[key];
		
		var state = {};
		state[type] = obj;

		var item = {
			type: type,
			key: key
		}

		Ajax.post(`${Globals.API_DASHBOARD_REMOVE}?token=${this.state.token}`, {
			body: JSON.stringify(item)
		})
			.then(res => res.response)
			.then(response => {
				this.setState(state);
			})
			.catch(err => {
				console.error(err);
			})
	}

	sendEmail(subject, body) {
		var obj = {
			subject: subject,
			message: body
		};
		
		Ajax.post(`${Globals.API_EMAIL_SEND}?token=${this.state.token}`, {
			body: JSON.stringify(obj)
		})
			.then(res => res.response)
			.then(function(response) {
				console.log('email sent!');
			})
			.catch(function(err) {
				console.error(err);
			})
	}

	addEmail(email) {
		var self = this;
		Ajax.post(Globals.API_ADD_EMAIL + '?token=' + this.state.token, {
			body: JSON.stringify({email: email})
		})
			.then(res => res.response)
			.then(function(response) {
				return Ajax.get(Globals.API_ADMIN_DASHBOARD + '?token=' + self.state.token)
			})
			.then(res => JSON.parse(res.response))
			.then(function(response) {
				self.setState({
					content: {
						emails: response.emails
					}
				});
			})
			.catch(function(err) {
				console.error(err);
			})
	}

	getContent() {
		var content;
		var callbacks = { // passed down to pages, all API calls managed here
			removeItem: this.removeItem.bind(this),
			sendEmail: this.sendEmail.bind(this),
			addEmail: this.addEmail.bind(this)
		};

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
						<Pages
							active={this.state.active}
							content={this.state.content}
							callbacks={callbacks}
						/>
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

		return content;
	}

	render() {
		var content = this.getContent();

		var displayName = this.state.status != 'logging in' && this.state.status != 'logged out';
		return (
			<div>
				<Header />
				<Content noDisclaimer>
					<div className='admin-wrap row'>
						<div className='col-sm-2'>
							<Sidebar
								items={this.state.items}
								default='Logs'
								active={this.state.active}
								onActiveChange={this.updateActive.bind(this)}
							/>
						</div>
						<div className='col-sm-10 admin-content'>
							<h1>{Globals.capitalize(this.state.active)}</h1>
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
				</Content>
			</div>
		)
	}
}

export default Admin;