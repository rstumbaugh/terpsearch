import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Auth from 'utils/auth';
import fbLogo from 'images/fb-logo.png';

// if user already logged in, show info
// otherwise, show login button
// FB token found at user.providerData.uid
class Login extends Component {
	constructor() {
		super();

		this.state = {
			user: undefined,
			dropdownClass: 'dd-hidden'
		}
	}

	componentDidMount() {
		// set up state watcher to check for login
		Auth.onStateChanged(user => {
			this.setState({
				user: user
			})
		})
	}

	toggleDropdown(e) {
		this.setState({
			dropdownClass: /enter/i.test(e.dispatchConfig.registrationName) ? 'dd-visible' : 'dd-hidden'
		})
	}

	logIn() {
		Auth.logIn();
	}

	logOut() {
		Auth.logOut();
	}

	getLoginButton() {
		return (
			<div className='fb-login-btn' onClick={this.logIn.bind(this)}>
				<img src={fbLogo} className='fb-login-logo'/>
				Log in <span className='fb-login-btn-text'>with Facebook</span>
			</div>
		)
	}

	getUserInfo() {
		var photo = this.state.user.providerData[0].photoURL;
		return (
			<div className='login-user-info' onMouseEnter={this.toggleDropdown.bind(this)} onMouseLeave={this.toggleDropdown.bind(this)}>
				<Link to='/'>
					<div className='login-user-info-photo-wrap'>
						<img src={photo} className='login-user-info-photo' alt='User Profile Image'/>
					</div>
					<span className='login-user-info-name'>{this.state.user.displayName}</span>
				</Link>
				<ul className={`login-user-info-options ${this.state.dropdownClass}`}>
					<li className='login-user-info-option'>
						<Link to='/test'>
							<span className='glyphicon glyphicon-user'></span>
							My Profile
						</Link>
					</li>
					<li className='login-user-info-option' onClick={this.logOut.bind(this)}>
						<span className='glyphicon glyphicon-log-out'></span>
						Log Out
					</li>
				</ul>
			</div>
		)
	}

	render() {
		return this.state.user ? this.getUserInfo() : this.getLoginButton();
	}
}

export default Login;