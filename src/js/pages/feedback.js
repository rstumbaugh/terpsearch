import styles from 'styles/info.scss';
import React, {Component} from 'react';
import * as isofetch from 'isomorphic-fetch';

import {Header, Content, Footer} from 'utils/layout.js';
import Form from 'components/feedback.js';

class Feedback extends Component {
	render() {
		return (
			<div>
				<Header />
				<div className='container-fluid'>
					<div className='row'>
						<div className='card col-md-10 col-md-offset-1'>
							<h1>Feedback</h1>
							<br/>
							<p style={{fontSize: '16px'}}>
								Experience any errors or strange behavior using this application?
								Have any questions, comments, or suggestions? Leave your feedback here
								and we will look into it! You can choose to leave your email as well if you would
								like a response. 
								<br/><br/>
								For developers, you can visit the 
								<a href='https://github.com/rstumbaugh/terpsearch' target='_blank'> GitHub page </a>
								for this website to report an issue or just poke through the front-end code.
								You can also send an email to <a href='mailto:admin@terpsearch.me'>admin@terpsearch.me</a>.
							</p>
							<br/>
							<Form />
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}

export default Feedback;