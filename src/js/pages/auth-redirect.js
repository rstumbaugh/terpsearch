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
			message: '',
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
					message: res.response
				})
			})
			.catch(err => {
				this.setState({
					message: err.response
				})
			})
	}

	render() {
		return (
			<div>
				<Header />
				<Content offset>
					<div className='auth-redirect card col-sm-12'>
						<h1 style={{marginTop: 0}}>{ this.state.message }</h1>
					</div>
				</Content>
				<Footer />
			</div>
		)
	}
}

export default AuthRedirect;