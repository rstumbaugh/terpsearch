import React, {Component} from 'react';

class ProfileRatingItem extends Component {
	render() {
		return (
			<div className='user-profile-rating-item'>
				<h3 className='profile-rating-title'>
					{this.props.courseId}
				</h3>
				<p>Difficulty: { this.props.rating.difficulty }</p>
				<p>Interest: { this.props.rating.interest }</p>
			</div>
		)
	}
}

export default ProfileRatingItem;