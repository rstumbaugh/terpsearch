import React, {Component} from 'react';
import {Header, Content, Footer} from 'utils/layout';
import Globals from 'globals';
import Ajax from 'utils/ajax';
import Store from 'utils/store';

// handle redirect from UMD auth server
// URL querystring will have ticket, rating info, previous page
class AuthRedirect extends Component {
	constructor() {
		super();

		const query = Globals.getQueryString(window.location.href);
		this.state = {
			status: 'loading',
			message: 'Loading...',
			service: encodeURIComponent(window.location.href.split('?')[0]),
			ticket: query.ticket,
			type: query.type,
			data: decodeURIComponent(query.data)
		}
	}

	// if user is on this page, posting something failed and user must be authenticated
	componentDidMount() {
		if (!this.state.ticket) {
			Store.setItem('type', this.state.type);
			Store.setItem('data', this.state.data);
			window.location.href = `https://login.umd.edu/cas/login?service=${this.state.service}`;
			return;
		}
		
		// if this block is reached, user has alredy been redirected from UMD login and should be validated
		var referrer = Store.getItem('referrer'); // set in rating-form and comment-input
		var referrerName = referrer.split('/').length && referrer.split('/')[3].length
			? Globals.capitalize(referrer.split('/')[3])
			: 'Home page';

		var type = Store.getItem('type');
		var object = JSON.parse(Store.getItem('data'));
		Ajax.post(`${Globals.API_COURSES}/reviews/${type}`, {
			headers: {
				'Authorization': object.userId ? Store.getItem('userToken') : '',
				'X-Auth-Ticket': this.state.ticket,
				'X-Auth-Service': this.state.service
			},

			body: JSON.stringify(object)
		})
			.then(res => {
				this.setState({
					message: res.response,
					status: 'success',
					href: referrer,
					linkText: `Back to ${referrerName}`
				})
			})
			.catch(err => {
				this.setState({
					message: err.response,
					status: 'error',
					href: referrer,
					linkText: `Back to ${referrerName}`
				})
			})
	}

	render() {
		return (
			<div>
				<Header />
				<Content offset>
					<div className='auth-redirect col-sm-12'>
						<div className={`auth-redirect-message ${this.state.status}`}>
							{
								this.state.status != 'loading' 
									? this.state.status == 'success'
										? <span className='glyphicon glyphicon-ok'></span>
										: <span className='glyphicon glyphicon-remove'></span>
									: ''
							}
							{ this.state.message }
							{
								this.state.status != 'loading'
									? <a className='auth-redirect-link' href={this.state.href}>
											{ this.state.linkText }
										</a>
									: ''
							}
						</div>
					</div>
				</Content>
				<Footer />
			</div>
		)
	}
}

export default AuthRedirect;