import React, {Component} from 'react';
import Globals from 'globals';
import RemoteSimpleSelect from 'components/remote-simple-select';

class ProfileScheduleForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			fields: <ScheduleFormItem index={0} onUpdate={this.updateCourse.bind(this)} />,
			courses: ['']
		}
	}

	updateCourse(index, course) {
		var {fields, courses} = this.state;
		
		courses[index] = course;
		if (!course) {
			fields[index] = undefined;
		}

		this.setState({ courses, fields });
	}

	addField() {
		var {fields, courses} = this.state;
		var i = fields.length;

		fields.push(
			<ScheduleFormItem index={i} key={i} onUpdate={this.updateCourse.bind(this)} />
		)
		courses.push('');

		this.setState({ fields, courses })
	}

	render() {
		return (
			<div className='profile-schedule-form'>
				{
					this.state.fields
				}
				<div className='profile-schedule-add'>
					<span onClick={this.addField.bind(this)}>+ Add Course</span>
				</div>
				<div className='btn-white' onClick={this.props.onCancel}>Cancel</div>
				<div className='btn-submit' onClick={() => this.props.onSubmit(this.state.courses)}>Save</div>
			</div>
		)
	}
}

class ScheduleFormItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value
		}
	}
	
	render() {
		return (
			<RemoteSimpleSelect 
				className='profile-schedule-form-item'
				placeholder='Enter a course ID'
				url={`${Globals.API_LIST_COURSES}?course_id=`}
				textField={item => `${item.course_id}: ${item.name}`}
				name='course'
				value={this.state.value}
				onChange={(name,course) => {
					this.props.onUpdate(this.props.index, course);
					this.setState({ value: course });
				}}
			/>
		)
	}
}

export default ProfileScheduleForm;