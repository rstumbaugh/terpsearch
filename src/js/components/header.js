import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Header extends Component {
	render() {
		var className = this.props.white ? 'nav-header-wrap-white' : 'nav-header-wrap';

		return (
			<div className={className}>
				<Link to='/'>TerpSearch</Link>
			</div>
		)
	}
}

export default Header;