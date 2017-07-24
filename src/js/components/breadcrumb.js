import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Store from 'utils/store';
import Globals from 'globals';

class Breadcrumb extends Component {
	render() {
		var items = [];
		// for each item in history, make a new breadcrumb entry
		var history = Store.getHistory();
		
		if (history.length) {
			var currentPath = window.location.pathname.split('/')[1];
			history.forEach((item,i) => {
				items.push(<Link to={item.path} key={i}>{Globals.capitalize(item.name)}</Link>);
				items.push(<span key={`${i}${i}`}> / </span>);
				console.log(items);
			})

			items.push(<span>{Globals.capitalize(currentPath)}</span>);
		}

		return items.length ? <div className='breadcrumb row'>{items}</div> : <div />;
	}
}

export default Breadcrumb;