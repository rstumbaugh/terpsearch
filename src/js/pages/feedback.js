import React, {Component} from 'react';

import {Header, Footer} from 'utils/layout.js';
import Globals from 'globals';
import Form from 'components/feedback.js';

class Feedback extends Component {
	componentDidMount() {
		Globals.scrollTop();
	}

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