import React, {Component} from 'react';
import Store from 'utils/store';
import {BrowserRouter, Route, Link} from 'react-router-dom';

class Breadcrumb extends Component {
	capitalize(str) {
		return str.charAt(0).toUpperCase() + str.substring(1);
	}

	render() {
		var lastPath = this.props.link;
		var currentPath = window.location.pathname.split('/')[1];
		var panel = <div />;

		if (lastPath && lastPath != currentPath) {
			panel = (
				<div className='breadcrumb row'>
					<Link to={lastPath.startsWith('/') ? lastPath : `/${lastPath}`}>
						{this.capitalize(this.props.display)}
					</Link>
					{` / ${this.capitalize(currentPath)}`}
				</div>
			)
		}

		return panel;
	}
}

export default Breadcrumb;