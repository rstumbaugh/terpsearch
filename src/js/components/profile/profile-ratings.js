import React, {Component} from 'react';
import ProfileRatingItem from './profile-rating-item';

class ProfileRatings extends Component {
	render() {
		return (
			<div className='user-profile-ratings card col-sm-12'>
				<h1 className='user-profile-ratings-header'>
					Course Ratings
				</h1>

				{
					this.props.ratings 
						? Object.keys(this.props.ratings).map(course => 
								<ProfileRatingItem 
									courseId={course} 
									rating={this.props.ratings[course]}
									isSelf={this.props.isSelf}
									key={course}
								/>
							)
						: ''
				}
			</div>
		)
	}
}

export default ProfileRatings;