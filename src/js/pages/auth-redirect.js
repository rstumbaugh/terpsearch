import React, {Component} from 'react';
import {Header, Content, Footer} from 'utils/layout';
import Globals from 'globals';
import Ajax from 'utils/ajax';

// handle redirect from UMD auth server
// URL querystring will have ticket, rating info, previous page
class AuthRedirect extends Component {
	constructor() {
		super();

		this.state = {
			message: '',
			ticket: Globals.getQueryString(window.location.href).ticket
		}
	}

	componentDidMount() {
		if (!this.state.ticket) {
			var thisUrl = encodeURIComponent('http://localhost:8080/auth/redirect');
			window.location.href = `https://login.umd.edu/cas/login?service=${thisUrl}`;
			return;
		}

		Ajax.get(`http://localhost:8888/auth/validate?ticket=${this.state.ticket}`)
			.then(() => {
				this.setState({
					message: 'authorized'
				})
			})
			.catch(err => {
				this.setState({
					message: 'unauthorized'
				})
			})
	}

	render() {
		return (
			<div>
				<Header />
				<Content offset>
					<div className='card col-sm-12'>
						<h1 style={{marginTop: 0}}>Redirect result</h1>
						{ this.state.message }
					</div>
				</Content>
				<Footer />
			</div>
		)
	}
}

export default AuthRedirect;