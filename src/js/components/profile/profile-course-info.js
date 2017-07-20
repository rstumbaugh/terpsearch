import React, {Component} from 'react';

class ProfileCourseInfo extends Component {
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
							key={courseId} 
						/>
					)
				}
			</div>
		)
	}
}

const ProfileCourseItem = props => {
	return (
		<div className='user-profile-course-item'>
			{ props.courseId }
		</div>
	)
}

export default ProfileCourseInfo;