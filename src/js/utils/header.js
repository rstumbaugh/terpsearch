import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Login from 'components/login';

class Header extends Component {
	logIn(e) {
		e.preventDefault();
		console.log('here');
	}
	render() {
		var className = this.props.white ? 'nav-header-wrap-white' : 'nav-header-wrap';

		return (
			<div className={className}>
				<Link to='/'>TerpSearch</Link>
				<div className='header-login-info'>
					<Login />
				</div>
			</div>
		)
	}
}

export default Header;