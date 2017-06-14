import styles from 'styles/info.scss';
import React, {Component} from 'react';
import * as isofetch from 'isomorphic-fetch'

import Header from 'components/header.js';
import Footer from 'components/footer.js';
import Globals from 'components/globals.js';

class Course extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<div>
				<Header />
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-sm-10 col-sm-offset-1'>
							<h1>Course</h1>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Course;