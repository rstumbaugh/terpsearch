import React, {Component} from 'react';
import Link from 'components/link';
import Globals from 'globals';
import History from 'utils/history';

class Breadcrumb extends Component {
	render() {
		var items = [];
		// for each item in history, make a new breadcrumb entry
		var history = History.get();
		
		if (history.length) {
			var currentPath = window.location.pathname.split('/')[1];
			history.forEach((item,i) => {
				items.push(<Link to={item.href} key={i} popHistory>{Globals.capitalize(item.pageName)}</Link>);
				items.push(<span key={`${i}span`}> / </span>);
			})
			
			items.push(<span key='current'>{Globals.capitalize(currentPath)}</span>);
		}
		
		return items.length ? <div className='breadcrumb row'>{items}</div> : <div />;
	}
}

export default Breadcrumb;