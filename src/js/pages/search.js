import styles from 'styles/home.scss';
import React from 'react';

import Header from 'components/header.js';

class Search extends React.Component {
	render() {
		return (
			<div className='row'>
				<Header />
				<div className='col-md-10 col-md-offset-1'>
					<h1>Search</h1>
				</div>
			</div>
		)
	}
}

export default Search;