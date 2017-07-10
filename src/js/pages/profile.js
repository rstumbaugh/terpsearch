import React, {Component} from 'react';
import Auth from 'utils/auth';
import {Header, Content, Footer} from 'utils/layout';

class Profile extends Component {
	constructor() {
		super();

		this.state = {
			user: {}
		}
	}

	componentDidMount() {
		var unsub = Auth.onStateChanged(user => {
			this.setState({
				user: user,
				unsubscribe: unsub
			})
		})
	}

	componentWillUnmount() {
		this.state.unsubscribe();
	}

	render() {
		return (
			<div>
				<Header />
				<Content offset>
					<div className='user-profile-wrap'>
						<div className='card row'>
							<div className='col-sm-12'>
								<h1>{this.state.user.displayName}</h1>
							</div>
						</div>
					</div>
				</Content>
				<Footer />
			</div>
		)
	}
}

export default Profile;