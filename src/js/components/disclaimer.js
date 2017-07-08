import React, {Component} from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom';

class Disclaimer extends Component {
	render() {
		return (
			<div className='disclaimer-wrap row'>
				<div className='col-sm-12'>
					<div className='panel panel-warning'>
						<div className='panel-heading'>
							This site is still in its first versions. If you find any loading errors,
							weird formatting, or something that doesn't look right, please
							<Link to='/feedback'>leave some feedback!</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Disclaimer;