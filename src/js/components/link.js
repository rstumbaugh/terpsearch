import React, {Component} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import History from 'utils/history';
import Globals from 'globals';

class Link extends Component {
	pushHistory() {
		// add current page to history before changing pages
		var href = window.location.pathname;
		var pageName = window.location.pathname.split('/')[1];
		pageName = pageName ? Globals.capitalize(pageName) : 'Home';
		History.push({ href, pageName });
	}

	popHistory() {
		// pop link URL and any following items from history
		var href = typeof(this.props.to) == 'string' ? this.props.to : this.props.to.pathname;
		History.pop(href);
	}

	handleClick() {
		if (this.props.pushHistory) {
			this.pushHistory();
		} else if (this.props.popHistory) {
			this.popHistory();
		}
	}

	render() {
		return (
			<RouterLink 
				to={this.props.to} 
				className={this.props.className} 
				onClick={this.handleClick.bind(this)}
			>
				{ this.props.children }
			</RouterLink>
		)
	}
}

export default Link;