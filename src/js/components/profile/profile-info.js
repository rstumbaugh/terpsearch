import React, {Component} from 'react';
import Globals from 'globals';
import ProfileSettings from 'components/profile/profile-settings';
import ProfileSchedule from 'components/profile/profile-schedule';

class UserInfo extends Component {
	render() {
		const photo = `${Globals.API_USERS}/${this.props.uid}/photo`;
		return (
			<div className='user-profile-info card col-sm-12'>
				<div className='row'>
					<div className='col-sm-3'>
						<div className='user-profile-image-wrap'>
							<img src={photo} className='user-profile-image' />
						</div>
					</div>
					<div className='col-sm-9'>
						<h1 className='user-profile-name'>{this.props.name}</h1>
						<div className='user-profile-details'>
							<ProfileSchedule 
								isSelf={this.props.isSelf} 
								schedule={this.props.schedule}
								onUpdate={this.props.onScheduleUpdate} />
							{
								this.props.isSelf 
									? <ProfileSettings {...this.props} />
									: ''
							}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default UserInfo;