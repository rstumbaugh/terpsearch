import React, {Component} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import Store from 'utils/store';

class Link extends Component {
	constructor() {
		super();

		this.pushHistory = this.pushHistory.bind(this);
	}

	pushHistory() {
		var path = window.location.pathname;
		var title = window.location.pathname.split('/')[1];
		Store.addHistoryItem(title, path);
	}

	render() {
		return (
			<RouterLink to={this.props.to} onClick={this.pushHistory}>
				{ this.props.children }
			</RouterLink>
		)
	}
}

export default Link;