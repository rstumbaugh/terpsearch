import React, {Component} from 'react';
import {Header, Content, Footer} from 'utils/layout';
import Ajax from 'utils/ajax';
import Store from 'utils/store';
import Globals from 'globals';
import Breadcrumb from 'components/breadcrumb';
import ProfileCourses from 'components/profile/profile-courses';

class ProfileAllCourses extends Component {
	constructor(props) {
		super(props);

		this.state = {
			courses: this.props.location.state.courses,
			uid: this.props.location.state.userId,
			name: ''
		}
	}

	componentDidMount() {
		Ajax.get(`${Globals.API_USERS}/${this.state.uid}/name`)
			.then(response => JSON.parse(response.response))
			.then(name => this.setState({ name: name.name }))
			.catch(err => console.error(err))
	}

	render() {
		return (
			<div>
				<Header />
				<Content offset>
					<Breadcrumb current='Courses' />
					<div className='row'>
						<div className='col-md-8 col-md-offset-2'>
							<div className='section'>
								<h1 className='section-heading'>{ `${this.state.name.split(' ')[0]}'s courses` }</h1>
								<div className='user-profile-all-courses'>
									<ProfileCourses {...this.state} />
								</div>
							</div>
						</div>
					</div>
				</Content>
				<Footer />
			</div>
		)
	}
}

export default ProfileAllCourses;