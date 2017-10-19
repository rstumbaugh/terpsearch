import React, {Component} from 'react';
import ProfileScheduleForm from './profile-schedule-form';
import Link from 'components/link';
import Globals from 'globals';

class ProfileSchedule extends Component {
	constructor() {
		super();

		this.state = {
			showForm: false
		}
	}

	updateSchedule(courses) {
		this.toggleForm(false);
		this.props.onUpdate(courses.filter(x => !!x)); // filter "undefined" courses
	}

	toggleForm(visible) {
		this.setState({ showForm: visible });
	}

	getScheduleContent() {
		if (!this.props.schedule) {
			return <div className='empty-schedule'>User has not added their schedule.</div>;
		}
		
		var courses = this.props.schedule.courses;
		return courses.map((course,idx) => <ScheduleItem course={course} key={idx} />)
	}

	render() {
		return (
			<div className='user-profile-schedule'>
				<fieldset>
					<legend>
						<span className='glyphicon glyphicon-list-alt' style={{paddingRight: '5px'}}></span>
						Schedule
					</legend>
					{
						this.state.showForm
							? <ProfileScheduleForm 
									isSelf={this.props.isSelf}
									schedule={this.props.schedule}
									onSubmit={this.updateSchedule.bind(this)}
									onCancel={() => this.setState({ showForm: false })} 
								/>
							: <div className='profile-schedule-wrap'>
									{this.props.schedule
										?	<div className='profile-schedule-last-updated'>
												<i>{`Last updated on ${Globals.formatDate(this.props.schedule.updated, false)}.`}</i>
											</div>
										: ''}

									{ this.getScheduleContent() }
								</div>
					}
					{
						this.props.isSelf && !this.state.showForm
							? <div className='btn-white schedule-add' onClick={this.toggleForm.bind(this,true)}>
									Edit
								</div>
							: ''
					}
				</fieldset>
			</div>
		)
	}
}

const ScheduleItem = props => {
	return (
		<div className='profile-schedule-item'>
			<Link to={`/course/${props.course.split(':')[0]}`} pushHistory>
				{props.course}
			</Link>
		</div>
	)
}


export default ProfileSchedule;