import styles from 'styles/info.scss';
import React, {Component} from 'react';
import RatingForm from 'components/rating/rating-form.js';
import {Header, Content, Footer} from 'utils/layout.js';

class Rating extends Component {
	render() {
		return (
			<div>
				<Header />
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-sm-10 col-sm-offset-1'>
							<div className='card'>
								<div className='row'>
									<div className='col-sm-12'>
										<h1>Course Rating Form</h1>
										<p>
											Course ratings keep the site going. Every contribution counts,
											so your rating counts! Feel free to rate as many courses as you can,
											as more ratings means more information to use while helping students
											find the courses that are right for them.
										</p>
										<br/>
										<div className='col-lg-6 col-lg-offset-3'>
											<RatingForm />
											<br/>
											<br/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}

export default Rating;