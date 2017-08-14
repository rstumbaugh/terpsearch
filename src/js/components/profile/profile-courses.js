import React, {Component} from 'react';
import Link from 'components/link';
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
		return (
			<div className='user-profile-course-info card'>
				{
					Object.keys(this.state.courses).map((courseId, i) => 
						i >= this.props.max 
							? '' 
							: <ProfileCourseItem 
									courseId={courseId}
									course={this.state.courses[courseId]} 
									isSelf={this.props.isSelf}
									key={courseId} 
								/>
					)
				}
				{
					Object.keys(this.state.courses).length > this.props.max
						? <div className='user-profile-view-all-courses'>
								<Link to={`/user/${this.props.uid}/courses`} className='user-profile-all-course-link'>
									{ `View all courses (${Object.keys(this.state.courses).length} found)`}
								</Link>
							</div>
						: ''
				}
			</div>
		)
	}
}

const ProfileCourseItem = props => {
	return (
		<div className='user-profile-course-item'>
			<h4 className='user-profile-course-id'>{props.courseId}</h4>
			<Link 
				pushHistory 
				to={`/course/${props.courseId}`}
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