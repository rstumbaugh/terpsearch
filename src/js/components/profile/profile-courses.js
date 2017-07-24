import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import StarRating from 'components/rating/star-rating';

class ProfileCourses extends Component {
	constructor(props) {
		super(props);

		this.state = {
			courses: {}
		}
	}

	// combine ratings & comments for each course
	componentWillReceiveProps(nextProps) {
		var courses = {};
		
		// initialize course with rating
		for (const course in nextProps.ratings) {
			courses[course] = {
				rating: nextProps.ratings[course]
			}
		}

		// add comments to course
		for (const course in nextProps.comments) {
			courses[course] = courses[course] || {};
			courses[course].comment = nextProps.comments[course]
		}

		this.setState({ courses });
	}

	render() {
		console.log(this.state.courses);
		return (
			<div className='user-profile-course-info card'>
				{
					Object.keys(this.state.courses).map(courseId => 
						<ProfileCourseItem 
							courseId={courseId}
							course={this.state.courses[courseId]} 
							isSelf={this.props.isSelf}
							key={courseId} 
						/>
					)
				}
			</div>
		)
	}
}

const ProfileCourseItem = props => {
	const href = `/course/${props.courseId}`;
	const path = window.location.pathname;
	return (
		<div className='user-profile-course-item'>
			<h4 className='user-profile-course-id'>{props.courseId}</h4>
			<Link 
				to={{pathname: href, state: {from: path, display: 'Profile'}}} 
				className='user-profile-course-link'>
				View course
			</Link>
			{
				props.course.rating
					? <div className='user-profile-course-rating'>
							<span className='user-profile-rating-item'>
								Difficulty
								<StarRating rating={props.course.rating.difficulty} />
							</span>
							<span className='user-profile-rating-item'>
								Interest
								<StarRating rating={props.course.rating.interest} />
							</span>
						</div>
					: ''
			}
			{
				props.course.comment
					? <blockquote className='user-profile-course-comment'>
							{props.course.comment.comment}
						</blockquote>
					: ''
			}
		</div>
	)
}

export default ProfileCourses;