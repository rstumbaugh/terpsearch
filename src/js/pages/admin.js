import React, {Component} from 'react';
import {Header, Content} from 'utils/layout.js';
import Sidebar from 'components/admin/admin-sidebar.js';
import Pages from 'components/admin/pages/admin-pages.js';
import Auth from 'utils/auth';
import Globals from 'globals';
import Ajax from 'utils/ajax';
import Store from 'utils/store';




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

		if (!Store.getItem('userToken')) {
			self.setState({
				status: 'logged out',
				items: [],
				active: '',
			})
			return;
		}

		Ajax.get(Globals.API_ADMIN_DASHBOARD, {
			'Authorization': Store.getItem('userToken')
		}).then(response => JSON.parse(response.response))
			.then(response => {
				var state = {
					status: 'logged in',
					items: Globals.ADMIN_PAGES,
					active: Globals.ADMIN_PAGES[0],
					content: {}
				}

				Globals.ADMIN_PAGES.forEach(page => {
					state.content[page] = response[page];
				})
				
				self.setState(state);
			})
			.catch(err => {
				console.error(err);
				self.setState({
					status: 'unauthorized'
				})
			})
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

		Ajax.post(Globals.API_DASHBOARD_REMOVE, {
			headers: {
				'Authorization': Store.getItem('userToken')
			},
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
		
		Ajax.post(Globals.API_EMAIL_SEND, {
			headers: {
				'Authorization': Store.getItem('userToken')
			},
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
		Ajax.post(Globals.API_ADD_EMAIL, {
			headers: {
				'Authorization': Store.getItem('userToken')
			},
			body: JSON.stringify({email: email})
		})
			.then(() => {
				return Ajax.get(Globals.API_ADMIN_DASHBOARD, {
					'Authorization': Store.getItem('userToken')
				})
			})
			.then(res => JSON.parse(res.response))
			.then(function(response) {
				this.setState({
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