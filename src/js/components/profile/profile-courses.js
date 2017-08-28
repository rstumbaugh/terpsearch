import React, {Component} from 'react';
import Modal from 'react-modal';
import Link from 'components/link';
import StarRating from 'components/rating/star-rating';

class ProfileCourses extends Component {
	constructor(props) {
		super(props);

		this.state = {
			courses: props.courses || {},
			showModal: false
		}
	}

	// combine ratings & comments for each course
	componentWillReceiveProps(nextProps) {
		var courses = nextProps.courses || {};
		
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

	toggleModal(showModal) {
		this.setState({ showModal });
	}

	render() {
		var numCourses = Object.keys(this.state.courses).length;
		return (
			<div className={`user-profile-course-info card ${numCourses == 0 ? 'empty' : ''}`}>
				{
					numCourses == 0 
						? <i>No courses to display.</i> 
						: Object.keys(this.state.courses).map((courseId, i) => 
								this.props.max && i >= this.props.max 
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
					this.props.max && Object.keys(this.state.courses).length > this.props.max
						? <div className='user-profile-view-all-courses' onClick={this.toggleModal.bind(this, true)}>
								{ `View all courses (${Object.keys(this.state.courses).length} found)`}
							</div>
						: ''
				}

				<Modal
					isOpen={this.state.showModal}
					onRequestClose={this.toggleModal.bind(this, false)}
					contentLabel='Courses modal'
				>
					<div className='modal-header'>
						<h2>
							{`${this.props.name ? this.props.name.split(' ')[0] : ''}'s reviews`}
							<span className='modal-close' onClick={this.toggleModal.bind(this, false)}>&times;</span>
						</h2>
					</div>
					<div className='modal-body'>
						{
							Object.keys(this.state.courses).map(courseId => 
								<ProfileCourseItem
									courseId={courseId}
									course={this.state.courses[courseId]}
									key={courseId}
								/>
							)
						}
					</div>
				</Modal>

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
			<hr />
		</div>
	)
}

export default ProfileCourses;